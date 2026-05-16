interface ArticleSection {
    title: string;
    paragraphs: string[];
}

interface ArticlePageProps {
    title: string;
    description: string;
    sections: ArticleSection[];
}

export default function ArticlePage({ title, description, sections }: ArticlePageProps) {
    return (
        <div className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-12">
            <section className="mb-12 text-center">
                <span className="inline-flex rounded-full bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-primary">
                    Conteúdo especial
                </span>
                <h1 className="mt-6 text-4xl sm:text-5xl font-black tracking-tight text-foreground">{title}</h1>
                <p className="mt-4 text-lg text-foreground/60 max-w-3xl mx-auto">{description}</p>
            </section>

            <div className="glass-panel p-8 sm:p-10 flex flex-col gap-10">
                {sections.map((section) => (
                    <section key={section.title} className="prose prose-slate dark:prose-invert max-w-none">
                        <h2>{section.title}</h2>
                        {section.paragraphs.map((paragraph) => (
                            <p key={paragraph}>{paragraph}</p>
                        ))}
                    </section>
                ))}
            </div>
        </div>
    );
}
