import Link from "next/link";

const categoryColors: Record<string, string> = {
    cambio: "text-emerald-600 bg-emerald-500/10",
    economia: "text-sky-600 bg-sky-500/10",
    investimentos: "text-violet-600 bg-violet-500/10",
    mercados: "text-amber-600 bg-amber-500/10",
    cripto: "text-orange-600 bg-orange-500/10",
};

interface NewsCardProps {
    slug: string;
    title: string;
    summary: string;
    category: string;
    source_name: string;
    published_at: string;
}

export default function NewsCard({ slug, title, summary, category, source_name, published_at }: NewsCardProps) {
    const colorClass = categoryColors[category] || categoryColors.economia;
    const date = new Date(published_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });

    return (
        <Link href={`/noticias/${slug}`} className="glass-panel p-6 flex flex-col gap-3 hover:-translate-y-1 transition-transform duration-300 group">
            <div className="flex items-center justify-between gap-2">
                <span className={`text-xs font-bold uppercase tracking-widest rounded-full px-3 py-1 ${colorClass}`}>
                    {category}
                </span>
                <span className="text-xs text-foreground/40">{date}</span>
            </div>
            <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                {title}
            </h3>
            {summary && <p className="text-sm text-foreground/60 line-clamp-2">{summary}</p>}
            <div className="mt-auto text-xs text-foreground/40 font-medium">{source_name}</div>
        </Link>
    );
}
