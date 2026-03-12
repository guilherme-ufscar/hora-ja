import { getCurrencyHistory, type HistoricalDataPoint } from "@/lib/api";
import { formatCurrency, formatPercentage } from "@/lib/formatters";

interface CurrencyHistoryProps {
    base: string;   // "usd" | "eur" | "gbp"
    days?: number;
}

function formatHistoryDate(dateStr: string): string {
    const [year, month, day] = dateStr.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    return new Intl.DateTimeFormat("pt-BR", {
        timeZone: "UTC",
        weekday: "short",
        day: "2-digit",
        month: "short",
    }).format(date);
}

function Sparkline({ points }: { points: HistoricalDataPoint[] }) {
    if (points.length < 2) return null;

    const bids = points.map(p => p.bid);
    const min = Math.min(...bids);
    const max = Math.max(...bids);
    const range = max - min || 1;

    const W = 280;
    const H = 56;
    const pad = 4;

    const coords = points.map((p, i) => {
        const x = pad + (i / (points.length - 1)) * (W - pad * 2);
        const y = H - pad - ((p.bid - min) / range) * (H - pad * 2);
        return { x, y };
    });

    const pathD = coords
        .map((c, i) => `${i === 0 ? "M" : "L"} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`)
        .join(" ");

    const areaD =
        `M ${coords[0].x.toFixed(1)} ${H} ` +
        coords.map(c => `L ${c.x.toFixed(1)} ${c.y.toFixed(1)}`).join(" ") +
        ` L ${coords[coords.length - 1].x.toFixed(1)} ${H} Z`;

    const firstBid = points[0].bid;
    const lastBid = points[points.length - 1].bid;
    const isUp = lastBid >= firstBid;
    const color = isUp ? "#10b981" : "#f43f5e";

    return (
        <svg
            viewBox={`0 0 ${W} ${H}`}
            className="w-full h-14"
            aria-hidden="true"
        >
            <defs>
                <linearGradient id={`sg-${isUp ? "up" : "dn"}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.25" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <path d={areaD} fill={`url(#sg-${isUp ? "up" : "dn"})`} />
            <path d={pathD} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            {/* Ponto final destacado */}
            <circle
                cx={coords[coords.length - 1].x}
                cy={coords[coords.length - 1].y}
                r="3.5"
                fill={color}
            />
        </svg>
    );
}

export default async function CurrencyHistory({ base, days = 5 }: CurrencyHistoryProps) {
    const points = await getCurrencyHistory(base.toLowerCase(), days);

    if (points.length === 0) {
        return (
            <div className="glass-panel p-6 rounded-3xl text-center text-foreground/50">
                Dados históricos indisponíveis no momento.
            </div>
        );
    }

    const firstBid = points[0].bid;
    const lastBid = points[points.length - 1].bid;
    const totalPct = firstBid > 0 ? ((lastBid - firstBid) / firstBid) * 100 : 0;
    const isTotalUp = totalPct >= 0;

    return (
        <section className="glass-panel p-6 sm:p-8 rounded-3xl" aria-label="Histórico de cotação">
            {/* Cabeçalho */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                <div>
                    <h2 className="text-xl font-bold tracking-tight text-foreground">
                        Histórico dos Últimos {days} Dias
                    </h2>
                    <p className="text-sm text-foreground/50 mt-0.5">
                        Evolução diária do câmbio frente ao Real (BRL)
                    </p>
                </div>
                <span className={`self-start sm:self-auto px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 ${isTotalUp ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/15 text-rose-600 dark:text-rose-400'}`}>
                    {isTotalUp ? '↑' : '↓'} {formatPercentage(totalPct)} no período
                </span>
            </div>

            {/* Sparkline */}
            <div className="mb-6 px-1">
                <Sparkline points={points} />
            </div>

            {/* Tabela de dias */}
            <div className="flex flex-col gap-2">
                {[...points].reverse().map((point, idx) => {
                    const isUp = point.pctChange >= 0;
                    const isToday = idx === 0;

                    return (
                        <div
                            key={point.date}
                            className={`flex items-center justify-between px-4 py-3 rounded-2xl transition-colors ${isToday ? 'bg-foreground/5 ring-1 ring-foreground/10' : 'hover:bg-foreground/3'}`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isUp ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                <div>
                                    <span className="text-sm font-semibold text-foreground/80 capitalize">
                                        {formatHistoryDate(point.date)}
                                    </span>
                                    {isToday && (
                                        <span className="ml-2 text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
                                            Hoje
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <span className="text-base font-black tabular-nums text-foreground">
                                    {formatCurrency(point.bid)}
                                </span>
                                <span className={`text-sm font-semibold tabular-nums min-w-[72px] text-right ${isUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                                    {formatPercentage(point.pctChange)}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <p className="text-xs text-foreground/30 text-right mt-4">
                Fonte: fawazahmed0/currency-api · Fechamento diário
            </p>
        </section>
    );
}
