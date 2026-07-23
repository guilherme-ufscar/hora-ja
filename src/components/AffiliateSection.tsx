import { affiliatePartners, type AffiliatePartner } from "@/lib/site-content";

interface AffiliateSectionProps {
    partners?: AffiliatePartner[];
    eyebrow?: string;
    title?: string;
    description?: string;
}

export default function AffiliateSection({
    partners = affiliatePartners,
    eyebrow = "Onde comprar câmbio",
    title = "Parceiros para comparar antes de fechar a operação",
    description = "Selecionamos corretoras, contas internacionais e serviços de remessa com boa reputação para você comparar taxas e condições antes de fechar qualquer operação de câmbio.",
}: AffiliateSectionProps) {
    return (
        <section className="mt-16">
            <div className="flex flex-col gap-3 mb-8">
                <span className="text-xs font-bold tracking-[0.25em] uppercase text-primary">{eyebrow}</span>
                <h2 className="text-3xl font-black tracking-tight text-foreground">{title}</h2>
                <p className="text-foreground/60 max-w-3xl">
                    {description}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
                {partners.map((partner) => (
                    <a
                        key={partner.name}
                        href={partner.href}
                        target="_blank"
                        rel="noreferrer sponsored"
                        className="glass-panel p-5 flex flex-col gap-4 transition-transform duration-300 hover:-translate-y-1"
                    >
                        <div className={`inline-flex h-12 items-center justify-center rounded-2xl px-4 text-sm font-black tracking-tight ${partner.logoClassName}`}>
                            {partner.logoText}
                        </div>
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

            <p className="mt-6 text-xs text-foreground/45 max-w-3xl">
                Aviso: o HoraJá Cambio pode receber comissão por indicações feitas através dos links de parceiros listados acima. Isso não altera o valor pago por você e não influencia as cotações exibidas no site.
            </p>
        </section>
    );
}
