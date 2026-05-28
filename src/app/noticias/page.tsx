import { Metadata } from "next";
import pool, { runMigrations } from "@/lib/db";
import NewsCard from "@/components/NewsCard";
import { buildStaticMetadata } from "@/lib/metadata";

export const revalidate = 300;

export const metadata: Metadata = buildStaticMetadata(
    "/noticias",
    "Notícias Financeiras | HoraJá Câmbio",
    "Fique por dentro das principais notícias do mercado financeiro, câmbio, economia e investimentos. Atualizado diariamente."
);

interface Article {
    slug: string;
    title: string;
    summary: string;
    category: string;
    source_name: string;
    published_at: string;
}

async function getArticles(): Promise<Article[]> {
    try {
        await runMigrations();
        const res = await pool.query(
            `SELECT slug, title, summary, category, source_name, published_at
             FROM articles WHERE status = 'published'
             ORDER BY published_at DESC LIMIT 60`
        );
        return res.rows;
    } catch {
        return [];
    }
}

const categories = ["todos", "cambio", "economia", "investimentos", "mercados", "cripto"];

export default async function NoticiasPage() {
    const articles = await getArticles();

    return (
        <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <div className="mb-10">
                <span className="text-xs font-bold tracking-[0.25em] uppercase text-primary">Atualizado diariamente</span>
                <h1 className="mt-3 text-4xl sm:text-5xl font-black tracking-tight text-foreground">
                    Análises e Notícias Financeiras
                </h1>
                <p className="mt-4 text-lg text-foreground/60 max-w-3xl">
                    Conteúdo sobre câmbio, economia, investimentos e mercados — curado e reescrito para o contexto brasileiro.
                </p>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
                {categories.map((cat) => (
                    <span key={cat} className="text-xs font-bold uppercase tracking-widest rounded-full px-4 py-2 bg-card-bg border border-card-border text-foreground/60">
                        {cat}
                    </span>
                ))}
            </div>

            {articles.length === 0 ? (
                <div className="glass-panel p-16 text-center text-foreground/40">
                    <p className="text-lg">Nenhuma notícia publicada ainda.</p>
                    <p className="text-sm mt-2">O pipeline de conteúdo ainda não foi executado.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {articles.map((a) => (
                        <NewsCard key={a.slug} {...a} />
                    ))}
                </div>
            )}
        </div>
    );
}
