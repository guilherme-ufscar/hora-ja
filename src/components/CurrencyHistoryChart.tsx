"use client";

import { useMemo, useState } from "react";
import { formatCurrency, formatHistoryDate, formatPercentage } from "@/lib/formatters";
import type { HistoricalDataPoint } from "@/lib/api";

interface CurrencyHistoryChartProps {
    histories: Record<number, HistoricalDataPoint[]>;
}

const periods = [7, 30, 90, 365] as const;

export default function CurrencyHistoryChart({ histories }: CurrencyHistoryChartProps) {
    const [activePeriod, setActivePeriod] = useState<number>(periods.find((period) => histories[period]?.length) ?? 7);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const points = histories[activePeriod] ?? [];

    const chart = useMemo(() => {
        if (points.length < 2) {
            return null;
        }

        const width = 720;
        const height = 260;
        const padX = 36;
        const padY = 24;
        const values = points.map((point) => point.bid);
        const min = Math.min(...values);
        const max = Math.max(...values);
        const range = max - min || 1;

        const coords = points.map((point, index) => {
            const x = padX + (index / (points.length - 1)) * (width - padX * 2);
            const y = height - padY - ((point.bid - min) / range) * (height - padY * 2);
            return { point, x, y };
        });

        const linePath = coords
            .map((coord, index) => `${index === 0 ? "M" : "L"} ${coord.x.toFixed(1)} ${coord.y.toFixed(1)}`)
            .join(" ");

        const areaPath = `M ${coords[0].x.toFixed(1)} ${height - padY} ${coords
            .map((coord) => `L ${coord.x.toFixed(1)} ${coord.y.toFixed(1)}`)
            .join(" ")} L ${coords[coords.length - 1].x.toFixed(1)} ${height - padY} Z`;

        return { width, height, coords, linePath, areaPath, min, max };
    }, [points]);

    const tooltip = hoveredIndex !== null ? chart?.coords[hoveredIndex] : null;
    const firstBid = points[0]?.bid ?? 0;
    const lastBid = points[points.length - 1]?.bid ?? 0;
    const totalPct = firstBid > 0 ? ((lastBid - firstBid) / firstBid) * 100 : 0;
    const isPositive = totalPct >= 0;

    return (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-black tracking-tight text-foreground">Variação histórica</h2>
                    <p className="text-sm text-foreground/60 mt-1">Compare o comportamento do câmbio em diferentes janelas de tempo.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    {periods.map((period) => (
                        <button
                            key={period}
                            type="button"
                            onClick={() => setActivePeriod(period)}
                            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${activePeriod === period ? "bg-primary text-white" : "bg-foreground/5 text-foreground/70 hover:bg-foreground/10"}`}
                        >
                            {period} dias
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 lg:items-start">
                <div className="flex-1">
                    {chart ? (
                        <div className="relative">
                            <svg viewBox={`0 0 ${chart.width} ${chart.height}`} className="w-full h-auto">
                                <defs>
                                    <linearGradient id="currency-chart-fill" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor={isPositive ? "#10b981" : "#f43f5e"} stopOpacity="0.28" />
                                        <stop offset="100%" stopColor={isPositive ? "#10b981" : "#f43f5e"} stopOpacity="0.02" />
                                    </linearGradient>
                                </defs>
                                <path d={chart.areaPath} fill="url(#currency-chart-fill)" />
                                <path d={chart.linePath} fill="none" stroke={isPositive ? "#10b981" : "#f43f5e"} strokeWidth="3" strokeLinecap="round" />
                                {chart.coords.map((coord, index) => (
                                    <g key={coord.point.createDate}>
                                        <circle
                                            cx={coord.x}
                                            cy={coord.y}
                                            r={hoveredIndex === index ? 7 : 5}
                                            fill={isPositive ? "#10b981" : "#f43f5e"}
                                            opacity={hoveredIndex === index ? 1 : 0.75}
                                        />
                                        <circle
                                            cx={coord.x}
                                            cy={coord.y}
                                            r={20}
                                            fill="transparent"
                                            onMouseEnter={() => setHoveredIndex(index)}
                                            onMouseLeave={() => setHoveredIndex(null)}
                                        />
                                    </g>
                                ))}
                            </svg>

                            {tooltip && (
                                <div
                                    className="absolute glass-panel border border-card-border px-4 py-3 text-sm shadow-xl pointer-events-none"
                                    style={{
                                        left: `min(calc(${(tooltip.x / chart.width) * 100}% + 12px), calc(100% - 220px))`,
                                        top: "12px",
                                    }}
                                >
                                    <div className="font-semibold text-foreground">{formatHistoryDate(tooltip.point.date)}</div>
                                    <div className="mt-1 text-foreground/70">Cotação: <strong className="text-foreground">{formatCurrency(tooltip.point.bid)}</strong></div>
                                    <div className="text-foreground/70">Mínima: <strong className="text-foreground">{formatCurrency(tooltip.point.low)}</strong></div>
                                    <div className="text-foreground/70">Máxima: <strong className="text-foreground">{formatCurrency(tooltip.point.high)}</strong></div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="rounded-3xl border border-card-border/60 bg-foreground/3 px-6 py-12 text-center text-foreground/50">
                            Dados históricos indisponíveis no momento.
                        </div>
                    )}
                </div>

                <aside className="w-full lg:max-w-xs glass-panel p-5 rounded-3xl border border-card-border/60">
                    <div className="text-xs font-bold uppercase tracking-[0.25em] text-primary">Resumo</div>
                    <div className="mt-4 space-y-4">
                        <div>
                            <div className="text-sm text-foreground/50">Variação no período</div>
                            <div className={`text-2xl font-black ${isPositive ? "text-emerald-600" : "text-rose-600"}`}>
                                {formatPercentage(totalPct)}
                            </div>
                        </div>
                        <div>
                            <div className="text-sm text-foreground/50">Menor cotação</div>
                            <div className="text-xl font-bold text-foreground">{points.length ? formatCurrency(Math.min(...points.map((point) => point.low))) : "-"}</div>
                        </div>
                        <div>
                            <div className="text-sm text-foreground/50">Maior cotação</div>
                            <div className="text-xl font-bold text-foreground">{points.length ? formatCurrency(Math.max(...points.map((point) => point.high))) : "-"}</div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
