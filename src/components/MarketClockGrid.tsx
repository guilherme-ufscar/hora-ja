"use client";

import { useEffect, useMemo, useState } from "react";

interface MarketClockCity {
    label: string;
    timeZone: string;
    locale: string;
    openHour: number;
    closeHour: number;
}

const markets: MarketClockCity[] = [
    { label: "São Paulo", timeZone: "America/Sao_Paulo", locale: "pt-BR", openHour: 10, closeHour: 17 },
    { label: "Nova York", timeZone: "America/New_York", locale: "en-US", openHour: 9, closeHour: 16 },
    { label: "Londres", timeZone: "Europe/London", locale: "en-GB", openHour: 8, closeHour: 16 },
    { label: "Frankfurt", timeZone: "Europe/Berlin", locale: "de-DE", openHour: 9, closeHour: 17 },
    { label: "Tóquio", timeZone: "Asia/Tokyo", locale: "ja-JP", openHour: 9, closeHour: 15 },
    { label: "Xangai", timeZone: "Asia/Shanghai", locale: "zh-CN", openHour: 9, closeHour: 15 },
];

function getLocalHour(date: Date, timeZone: string) {
    return Number(
        new Intl.DateTimeFormat("en-GB", {
            timeZone,
            hour: "2-digit",
            hour12: false,
        }).format(date),
    );
}

function formatTime(date: Date, locale: string, timeZone: string) {
    return new Intl.DateTimeFormat(locale, {
        timeZone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    }).format(date);
}

function formatDate(date: Date, locale: string, timeZone: string) {
    return new Intl.DateTimeFormat(locale, {
        timeZone,
        weekday: "short",
        day: "2-digit",
        month: "short",
    }).format(date);
}

function getCountdown(currentHour: number, openHour: number, closeHour: number) {
    if (currentHour >= openHour && currentHour < closeHour) {
        return `${closeHour - currentHour}h para fechar`;
    }

    if (currentHour < openHour) {
        return `${openHour - currentHour}h para abrir`;
    }

    return `${24 - currentHour + openHour}h para abrir`;
}

export default function MarketClockGrid() {
    const [now, setNow] = useState<Date | null>(null);

    useEffect(() => {
        setNow(new Date());
        const interval = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    const items = useMemo(() => {
        if (!now) {
            return [];
        }

        return markets.map((market) => {
            const currentHour = getLocalHour(now, market.timeZone);
            const isOpen = currentHour >= market.openHour && currentHour < market.closeHour;

            return {
                ...market,
                time: formatTime(now, market.locale, market.timeZone),
                date: formatDate(now, market.locale, market.timeZone),
                isOpen,
                countdown: getCountdown(currentHour, market.openHour, market.closeHour),
            };
        });
    }, [now]);

    return (
        <section className="mt-20">
            <div className="flex flex-col gap-3 mb-8">
                <span className="text-xs font-bold tracking-[0.25em] uppercase text-primary">Mercados mundiais</span>
                <h2 className="text-3xl font-black tracking-tight text-foreground">Relógio global dos principais centros financeiros</h2>
                <p className="text-foreground/60 max-w-3xl">
                    Acompanhe o horário local dos mercados e veja rapidamente se cada praça está aberta ou fechada neste momento.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {items.map((item) => (
                    <div key={item.label} className="glass-panel p-6 flex flex-col gap-3">
                        <div className="flex items-center justify-between gap-3">
                            <h3 className="text-xl font-bold text-foreground">{item.label}</h3>
                            <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${item.isOpen ? "bg-emerald-500/10 text-emerald-600" : "bg-foreground/10 text-foreground/60"}`}>
                                {item.isOpen ? "Aberto" : "Fechado"}
                            </span>
                        </div>
                        <div className="text-4xl font-black tracking-tight tabular-nums text-foreground">{item.time}</div>
                        <p className="text-sm text-foreground/60 capitalize">{item.date}</p>
                        <p className="text-sm font-medium text-primary">{item.countdown}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
