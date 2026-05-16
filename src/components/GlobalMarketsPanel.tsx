import { getGlobalMarketSnapshots } from "@/lib/api";
import { formatCompactNumber, formatPercentage } from "@/lib/formatters";

function getMarketCountdown(marketName: string, state: "open" | "closed") {
    const sessions: Record<string, string> = {
        Ibovespa: state === "open" ? "B3 em sessão regular" : "Próxima janela: 10h–17h",
        "S&P 500": state === "open" ? "Bolsa americana em sessão" : "Próxima janela: 9h30–16h",
        Nasdaq: state === "open" ? "Nasdaq em sessão" : "Próxima janela: 9h30–16h",
        Ouro: state === "open" ? "Mercado referencial em sessão" : "Referência fora do horário principal",
        Bitcoin: "Mercado 24/7",
    };

    return sessions[marketName] ?? (state === "open" ? "Mercado em sessão" : "Fora do horário principal");
}

export default async function GlobalMarketsPanel() {
    const markets = await getGlobalMarketSnapshots();

    if (!markets.length) {
        return (
            <section className="mt-20">
                <div className="glass-panel p-6 rounded-3xl text-center text-foreground/50">
                    Painel de mercados disponível assim que a integração com a Alpha Vantage estiver configurada.
                </div>
            </section>
        );
    }

    return (
        <section className="mt-20">
            <div className="flex flex-col gap-3 mb-8">
                <span className="text-xs font-bold tracking-[0.25em] uppercase text-primary">Mercados globais</span>
                <h2 className="text-3xl font-black tracking-tight text-foreground">Indicadores internacionais em um só painel</h2>
                <p className="text-foreground/60 max-w-3xl">
                    Acompanhe índices e ativos relevantes ao lado das cotações de moedas para contextualizar melhor o humor do mercado.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
                {markets.map((market) => {
                    const isPositive = market.changePercent >= 0;

                    return (
                        <div key={market.symbol} className="glass-panel p-5 flex flex-col gap-4">
                            <div className="flex items-center justify-between gap-3">
                                <strong className="text-lg text-foreground">{market.name}</strong>
                                <span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${market.marketState === "open" ? "bg-emerald-500/10 text-emerald-600" : "bg-foreground/10 text-foreground/60"}`}>
                                    {market.marketState === "open" ? "Aberto" : "Fechado"}
                                </span>
                            </div>
                            <div className="text-3xl font-black tracking-tight text-foreground">{formatCompactNumber(market.price)}</div>
                            <div className={`text-sm font-semibold ${isPositive ? "text-emerald-600" : "text-rose-600"}`}>
                                {formatPercentage(market.changePercent)}
                            </div>
                            <div className="text-xs text-foreground/50">{getMarketCountdown(market.name, market.marketState)}</div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
