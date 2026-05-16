import { affiliatePartners } from "@/lib/site-content";

export default function AffiliateSection() {
    return (
        <section className="mt-16">
            <div className="flex flex-col gap-3 mb-8">
                <span className="text-xs font-bold tracking-[0.25em] uppercase text-primary">Onde comprar câmbio</span>
                <h2 className="text-3xl font-black tracking-tight text-foreground">Parceiros para comparar antes de fechar a operação</h2>
                <p className="text-foreground/60 max-w-3xl">
                    Use estes parceiros como ponto de comparação para taxa efetiva, praticidade, prazo de entrega e custo total da operação.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
                {affiliatePartners.map((partner) => (
                    <a
                        key={partner.name}
                        href={partner.href}
                        className="glass-panel p-5 flex flex-col gap-4 transition-transform duration-300 hover:-translate-y-1"
                    >
                        <div>
                            <h3 className="text-lg font-bold text-foreground">{partner.name}</h3>
                            <p className="mt-2 text-sm text-foreground/60">{partner.description}</p>
                        </div>
                        <span className="mt-auto inline-flex items-center justify-center rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                            {partner.cta}
                        </span>
                    </a>
                ))}
            </div>
        </section>
    );
}
