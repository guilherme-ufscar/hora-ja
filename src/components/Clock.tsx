"use client";

import { useEffect, useState } from "react";

export default function Clock() {
    const [time, setTime] = useState<Date | null>(null);

    useEffect(() => {
        // Inicializa o tempo imediatamente e atualiza a cada segundo
        setTime(new Date());

        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Hydration safeguard strategy
    if (!time) {
        return (
            <div className="flex flex-col items-center justify-center space-y-4 py-8 opacity-0">
                <div className="text-7xl font-bold tracking-tighter tabular-nums drop-shadow-sm h-[80px]">
                    --:--:--
                </div>
            </div>
        );
    }

    // Formatador fixo para Brasília (America/Sao_Paulo)
    // Utiliza toLocaleTimeString para pegar a string exata no fuso-horário correto, garantindo flexibilidade e robustez.
    const timeFormatter = new Intl.DateTimeFormat("pt-BR", {
        timeZone: "America/Sao_Paulo",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    });

    const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
        timeZone: "America/Sao_Paulo",
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    const timeString = timeFormatter.format(time);
    const dateString = dateFormatter.format(time);

    return (
        <div className="flex flex-col items-center justify-center space-y-4 py-8 animate-in fade-in zoom-in duration-700 ease-out">
            <div className="relative group cursor-default">
                {/* Glow Element */}
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-emerald-400 to-teal-400 opacity-20 blur-xl group-hover:opacity-40 transition duration-1000"></div>

                {/* Informação principal */}
                <div className="relative flex flex-col items-center justify-center px-8 py-6 rounded-3xl glass-panel text-center w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto border-emerald-500/20">
                    <p className="text-sm font-medium tracking-wider text-emerald-600 dark:text-emerald-400 uppercase mb-2">
                        Horário de Brasília (GMT-3)
                    </p>
                    <h1 className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tighter tabular-nums text-transparent bg-clip-text bg-gradient-to-br from-foreground to-foreground/70 drop-shadow-sm transition-all">
                        {timeString}
                    </h1>
                    <p className="mt-4 text-base sm:text-lg font-medium text-foreground/70 capitalize">
                        {dateString}
                    </p>
                </div>
            </div>
        </div>
    );
}
