import Link from "next/link";
import { formatCurrency, formatLastUpdate, formatPercentage } from "@/lib/formatters";
import type { AppCurrencyData } from "@/lib/api";

interface CurrencyCardProps {
    data: AppCurrencyData | null;
    href: string; // Ex: /dolar
}

export default function CurrencyCard({ data, href }: CurrencyCardProps) {
    if (!data) {
        // Skeleton/Fallback caso os dados falhem (não veio do cache ou do build inicial)
        return (
            <div className="glass-panel p-6 flex flex-col justify-between h-48 opacity-50 relative overflow-hidden group border border-slate-500/20">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-500/20 to-slate-500/5 opacity-50"></div>
                <div className="relative z-10 flex justify-between items-start">
                    <div>
                        <h3 className="text-lg font-semibold text-foreground/80">Indisponível</h3>
                        <p className="text-sm text-foreground/50">Tente novamente</p>
                    </div>
                </div>
            </div>
        );
    }

    // Identificação colorida baseada na variação principal (Aumento ou Queda)
    const isPositive = data.pctChange >= 0;

    return (
        <Link href={href} className="block w-full h-full">
            <div className="glass-panel p-6 sm:p-8 flex flex-col justify-between h-56 sm:h-64 relative overflow-hidden group transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_40px_0_rgba(16,185,129,0.15)] focus:ring-2 focus:ring-primary focus:outline-none">

                {/* Glow dinâmico de fundo */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative z-10 flex justify-between items-start">
                    <div>
                        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground/90 group-hover:text-foreground transition-colors">
                            {data.name}
                        </h3>
                        <p className="text-sm font-medium text-foreground/50 mt-1 uppercase tracking-wider">
                            {data.symbol}
                        </p>
                    </div>

                    {/* Badge Variação */}
                    <div className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 shadow-sm backdrop-blur-md border ${isPositive ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'bg-rose-500/10 text-rose-600 border-rose-500/20 group-hover:shadow-[0_0_15px_rgba(244,63,94,0.4)]'} transition-shadow duration-300`}>
                        {isPositive ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 17 13.5 8.5 8.5 13.5 2 7" /><polyline points="16 17 22 17 22 11" /></svg>
                        )}
                        {formatPercentage(data.pctChange)}
                    </div>
                </div>

                <div className="relative z-10 flex flex-col items-start gap-1">
                    <div className="text-4xl sm:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-foreground to-foreground/80 tabular-nums">
                        {formatCurrency(data.bid)}
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-foreground/40 mt-2 flex items-center gap-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                        Última atualização: {formatLastUpdate(data.createDate)}
                    </p>
                </div>
            </div>
        </Link>
    );
}
