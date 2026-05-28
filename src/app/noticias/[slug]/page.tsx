import { notFound } from "next/navigation";
import pool, { runMigrations } from "@/lib/db";
import ArticleChart from "@/components/ArticleChart";
import type { Metadata } from "next";

export const revalidate = 600;

interface Article {
    id: number;
    slug: string;
    title: string;
    summary: string;
    content: string;
    chart_data: object[] | null;
    source_url: string;
    source_name: string;
    category: string;
    published_at: string;
}

async function getArticle(slug: string): Promise<Article | null> {
    try {
        await runMigrations();
        const res = await pool.query(
            "SELECT * FROM articles WHERE slug = $1 AND status = 'published' LIMIT 1",
            [slug]
        );
        return res.rows[0] || null;
    } catch {
        return null;
    }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const article = await getArticle(slug);
    if (!article) return {};
    return {
        title: `${article.title} | HoraJá Câmbio`,
        description: article.summary,
        openGraph: { title: article.title, description: article.summary },
    };
}

const categoryLabels: Record<string, string> = {
    cambio: "Câmbio",
    economia: "Economia",
    investimentos: "Investimentos",
    mercados: "Mercados",
    cripto: "Cripto",
};

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const article = await getArticle(slug);
    if (!article) notFound();

    const charts = Array.isArray(article.chart_data) ? article.chart_data : [];
    const date = new Date(article.published_at).toLocaleDateString("pt-BR", {
        day: "2-digit", month: "long", year: "numeric"
    });

    const contentParts = article.content.split(/(<p>[\s\S]*?<\/p>)/g).filter(Boolean);
    const midpoint = Math.floor(contentParts.filter(p => p.startsWith("<p>")).length / 2);

    let paragraphCount = 0;
    let chartInserted = false;

    return (
        <div className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-12">
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs font-bold uppercase tracking-widest rounded-full px-3 py-1 bg-primary/10 text-primary">
                        {categoryLabels[article.category] || article.category}
                    </span>
                    <span className="text-xs text-foreground/40">{date}</span>
                    {article.source_name && (
                        <span className="text-xs text-foreground/40">· {article.source_name}</span>
                    )}
                </div>
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground leading-tight">
                    {article.title}
                </h1>
                {article.summary && (
                    <p className="mt-4 text-lg text-foreground/60 leading-relaxed">{article.summary}</p>
                )}
            </div>

            <div className="glass-panel p-8 sm:p-10">
                <div className="prose prose-slate dark:prose-invert max-w-none">
                    {contentParts.map((part, i) => {
                        if (!part.startsWith("<p>")) {
                            return <span key={i} dangerouslySetInnerHTML={{ __html: part }} />;
                        }
                        paragraphCount++;
                        const isInsertPoint = paragraphCount === midpoint && !chartInserted && charts.length > 0;
                        if (isInsertPoint) {
                            chartInserted = true;
                            return (
                                <div key={i}>
                                    <p dangerouslySetInnerHTML={{ __html: part.replace(/^<p>|<\/p>$/g, "") }} />
                                    <ArticleChart chart={charts[0] as Parameters<typeof ArticleChart>[0]["chart"]} />
                                </div>
                            );
                        }
                        return <p key={i} dangerouslySetInnerHTML={{ __html: part.replace(/^<p>|<\/p>$/g, "") }} />;
                    })}
                </div>

                {charts.slice(1).map((chart, i) => (
                    <ArticleChart key={i} chart={chart as Parameters<typeof ArticleChart>[0]["chart"]} />
                ))}
            </div>

            {article.source_url && (
                <p className="mt-6 text-xs text-foreground/40 text-center">
                    Baseado em conteúdo de:{" "}
                    <a href={article.source_url} target="_blank" rel="nofollow noreferrer" className="underline hover:text-primary">
                        {article.source_name || article.source_url}
                    </a>
                </p>
            )}
        </div>
    );
}
