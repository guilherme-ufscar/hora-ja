import Anthropic from "@anthropic-ai/sdk";
import Parser from "rss-parser";
import pool from "./db";

const RSS_FEEDS: Record<string, { url: string; name: string }> = {
    infomoney: { url: "https://www.infomoney.com.br/feed/", name: "InfoMoney" },
    valoreconomico: { url: "https://valor.globo.com/rss/all.ghtml", name: "Valor Econômico" },
    g1economia: { url: "https://g1.globo.com/rss/g1/economia/", name: "G1 Economia" },
    exame: { url: "https://exame.com/feed/", name: "Exame" },
    investing: { url: "https://br.investing.com/rss/news.rss", name: "Investing.com" },
};

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const parser = new Parser({ timeout: 10000 });

function slugify(text: string): string {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .slice(0, 80)
        + "-" + Date.now().toString(36);
}

async function fetchRSSItems(sourceKeys: string[], limit: number) {
    const items: { title: string; link: string; content: string; sourceName: string }[] = [];

    for (const key of sourceKeys) {
        const feed = RSS_FEEDS[key];
        if (!feed) continue;
        try {
            const result = await parser.parseURL(feed.url);
            for (const item of result.items.slice(0, Math.ceil(limit / sourceKeys.length) + 2)) {
                if (item.title && item.link) {
                    items.push({
                        title: item.title,
                        link: item.link,
                        content: item.contentSnippet || item.content || item.summary || "",
                        sourceName: feed.name,
                    });
                }
            }
        } catch {
            // feed unavailable, skip
        }
    }

    return items.slice(0, limit);
}

async function rewriteWithClaude(item: { title: string; content: string; sourceName: string; link: string }) {
    const prompt = `Você é redator financeiro do HoraJá Câmbio, site brasileiro de finanças e câmbio.

Recebeu esta notícia da fonte "${item.sourceName}":
TÍTULO: ${item.title}
CONTEÚDO: ${item.content.slice(0, 2000)}
LINK ORIGINAL: ${item.link}

Sua tarefa:
1. Reescreva a notícia com suas próprias palavras, em português claro e acessível para o público brasileiro. Não copie frases da fonte.
2. O conteúdo deve ter entre 300 e 500 palavras, estruturado em parágrafos HTML (<p> tags). Use <strong> para destacar dados importantes.
3. Gere dados para 1 ou 2 gráficos relevantes ao tema da notícia. Se a notícia mencionar variação cambial, juros, inflação, bolsa ou qualquer dado numérico, crie um gráfico ilustrativo com dados plausíveis e didáticos.

Responda APENAS com JSON válido neste formato:
{
  "title": "título reescrito em até 80 caracteres",
  "summary": "resumo em 1 frase de até 150 caracteres",
  "content": "<p>parágrafo 1...</p><p>parágrafo 2...</p>",
  "category": "uma de: cambio | economia | investimentos | mercados | cripto",
  "charts": [
    {
      "type": "line",
      "title": "título do gráfico",
      "labels": ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
      "datasets": [
        {
          "label": "nome da série",
          "data": [1.1, 2.2, 3.3, 4.4, 5.5, 6.6],
          "color": "#10b981"
        }
      ]
    }
  ]
}`;

    const response = await anthropic.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1500,
        messages: [{ role: "user", content: prompt }],
    });

    const raw = (response.content[0] as { type: string; text: string }).text.trim();
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Claude returned no JSON");
    return JSON.parse(jsonMatch[0]) as {
        title: string;
        summary: string;
        content: string;
        category: string;
        charts: object[];
    };
}

async function articleExists(sourceUrl: string): Promise<boolean> {
    const res = await pool.query("SELECT id FROM articles WHERE source_url = $1 LIMIT 1", [sourceUrl]);
    return res.rowCount! > 0;
}

async function countTodayArticles(): Promise<number> {
    const res = await pool.query(
        "SELECT COUNT(*) FROM articles WHERE published_at >= NOW() - INTERVAL '24 hours'"
    );
    return parseInt(res.rows[0].count, 10);
}

async function getConfig() {
    const res = await pool.query("SELECT key, value FROM app_config");
    const config: Record<string, string> = {};
    for (const row of res.rows) config[row.key] = row.value;
    return config;
}

export async function runNewsPipeline(): Promise<{ processed: number; skipped: number; errors: number }> {
    const config = await getConfig();
    if (config.pipeline_enabled !== "true") return { processed: 0, skipped: 0, errors: 0 };

    const limit = parseInt(config.articles_per_day || "15", 10);
    const todayCount = await countTodayArticles();
    const remaining = limit - todayCount;
    if (remaining <= 0) return { processed: 0, skipped: 0, errors: 0 };

    const sourceKeys = (config.rss_sources || "infomoney,g1economia,exame").split(",").map(s => s.trim());
    const items = await fetchRSSItems(sourceKeys, remaining + 5);

    let processed = 0, skipped = 0, errors = 0;

    for (const item of items) {
        if (processed >= remaining) break;
        if (await articleExists(item.link)) { skipped++; continue; }

        try {
            const result = await rewriteWithClaude(item);
            const slug = slugify(result.title);

            await pool.query(
                `INSERT INTO articles (slug, title, summary, content, chart_data, source_url, source_name, category, status, published_at)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'published', NOW())`,
                [slug, result.title, result.summary, result.content, JSON.stringify(result.charts), item.link, item.sourceName, result.category]
            );
            processed++;
        } catch {
            errors++;
        }
    }

    return { processed, skipped, errors };
}
