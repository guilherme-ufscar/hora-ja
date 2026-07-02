import FAQ from "@/components/FAQ";
import FAQJsonLd from "@/components/FAQJsonLd";
import CurrencyHistory from "@/components/CurrencyHistory";
import AffiliateSection from "@/components/AffiliateSection";
import NotificationBell from "@/components/NotificationBell";
import NotificationInfo from "@/components/NotificationInfo";
import type { AppCurrencyData } from "@/lib/api";
import { currencyMap, type CurrencyCode } from "@/lib/currencies";
import { formatCurrency, formatLastUpdate, formatPercentage } from "@/lib/formatters";
import { currencyPageContent } from "@/lib/site-content";

interface CurrencyPageTemplateProps {
    code: Exclude<CurrencyCode, "BRL">;
    data: AppCurrencyData | null;
}

export default function CurrencyPageTemplate({ code, data }: CurrencyPageTemplateProps) {
    const currency = currencyMap[code];
    const content = currencyPageContent[code];

    if (!data) {
        return (
            <div className="flex-1 flex items-center justify-center p-8">
                <p className="text-xl text-foreground/60">Não foi possível carregar os dados de {currency.shortName} no momento.</p>
            </div>
        );
    }

    const isPositive = data.pctChange >= 0;

    return (
        <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <section className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-8 items-start">
                <div>
                    <section className="flex flex-col items-center text-center mb-10 sm:mb-16 animate-in fade-in zoom-in duration-700">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 mb-6">
                            <span className="relative flex h-2 w-2">
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500/50"></span>
                            </span>
                            <span className="text-xs font-bold tracking-widest uppercase">{content.badgeLabel}</span>
                        </div>

                        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-foreground mb-4">
                            {currency.flag} Cotação do {currency.shortName} <span className={currency.heroAccent}>Hoje</span>
                        </h1>
                        <p className="text-lg text-foreground/60 max-w-2xl">
                            Acompanhe o valor atualizado de {currency.name} frente ao Real (BRL), com histórico, contexto e ferramentas para comparar custos de câmbio.
                        </p>
                    </section>

                    <NotificationInfo
                        currencyCode={code}
                        currencyName={currency.shortName}
                        currencyFlag={currency.flag}
                    />

                    <section className="glass-panel p-8 sm:p-12 rounded-[3rem] mb-16 relative overflow-hidden flex flex-col items-center justify-center text-center shadow-2xl shadow-emerald-900/5">
                        <div className={`absolute inset-0 bg-gradient-to-br ${currency.heroGlow} to-transparent`}></div>

                        <div className="relative z-10 w-full flex flex-col sm:flex-row items-center justify-between gap-8 sm:gap-4">
                            <div className="text-left flex flex-col items-center sm:items-start">
                                <span className="text-sm font-bold text-foreground/50 uppercase tracking-widest mb-1">Valor atualizado</span>
                                <div className="text-6xl sm:text-7xl font-black tracking-tighter tabular-nums drop-shadow-sm text-foreground">
                                    {formatCurrency(data.bid)}
                                </div>
                                <div className="mt-4 flex items-center gap-3">
                                    <span className={`px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 ${isPositive ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400" : "bg-rose-500/15 text-rose-700 dark:text-rose-400"}`}>
                                        {isPositive ? "↑" : "↓"} {formatPercentage(data.pctChange)}
                                    </span>
                                    <span className="text-sm font-medium text-foreground/50">Hoje</span>
                                </div>
                            </div>

                            <div className="w-full sm:w-px h-px sm:h-32 bg-card-border/50"></div>

                            <div className="text-left flex flex-col items-center sm:items-end gap-2">
                                <span className="text-sm font-medium text-foreground/50">Última atualização</span>
                                <span className="text-lg font-semibold text-foreground/80 bg-foreground/5 px-4 py-2 rounded-2xl">
                                    {formatLastUpdate(data.createDate)}
                                </span>
                                <span className="text-xs text-foreground/40 mt-1">{content.sourceLabel}</span>
                            </div>
                        </div>
                    </section>

                    <section className="prose prose-slate dark:prose-invert max-w-none mb-16">
                        <h2>{currency.introTitle}</h2>
                        {currency.introParagraphs.map((paragraph) => (
                            <p key={paragraph}>{paragraph}</p>
                        ))}
                    </section>

                    <section className="mb-16">
                        <CurrencyHistory base={code} />
                    </section>

                    <AffiliateSection />

                    <section className="mt-16">
                        <h2 className="text-2xl font-bold tracking-tight text-foreground mb-6">Dúvidas frequentes sobre {currency.shortName}</h2>
                        <FAQ items={content.faq} />
                        <FAQJsonLd items={content.faq} />
                    </section>
                </div>

                <aside className="xl:sticky xl:top-24 flex flex-col gap-6">
                    <div className="glass-panel p-5">
                        <div className="text-xs font-bold uppercase tracking-[0.25em] text-primary">Resumo rápido</div>
                        <div className="mt-4 space-y-4 text-sm text-foreground/70">
                            <div>
                                <div className="text-foreground/50">Compra</div>
                                <strong className="text-xl text-foreground">{formatCurrency(data.bid)}</strong>
                            </div>
                            <div>
                                <div className="text-foreground/50">Venda</div>
                                <strong className="text-xl text-foreground">{formatCurrency(data.ask)}</strong>
                            </div>
                            <div>
                                <div className="text-foreground/50">Máxima / mínima</div>
                                <strong className="text-base text-foreground">{formatCurrency(data.high)} / {formatCurrency(data.low)}</strong>
                            </div>
                        </div>
                    </div>
                </aside>
            </section>
        </div>
    );
}
