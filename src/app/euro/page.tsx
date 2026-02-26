import { getCurrencies } from "@/lib/api";
import { formatCurrency, formatLastUpdate, formatPercentage } from "@/lib/formatters";
import FAQ from "@/components/FAQ";
import FAQJsonLd from "@/components/FAQJsonLd";

const euroFaq = [
    {
        question: "Por que o Euro costuma ser mais caro que o Dólar?",
        answer: "A taxa de câmbio é determinada por vários fatores macroeconômicos. Em geral, o Euro mantém uma paridade mais alta frente ao Dólar devido às políticas estruturais históricas do Banco Central Europeu (BCE) e à balança comercial robusta do bloco."
    }
];
export const revalidate = 600;

export async function generateMetadata() {
    return {
        title: "Cotação do Euro Hoje | Hora Já",
        description: "Acompanhe o valor atualizado do Euro (EUR) em tempo real. Veja sua variação diária frente ao Real (BRL).",
    };
}

export default async function EuroPage() {
    const currencies = await getCurrencies();
    const data = currencies.EUR;

    if (!data) {
        return (
            <div className="flex-1 flex items-center justify-center p-8">
                <p className="text-xl text-foreground/60">Não foi possível carregar os dados do Euro no momento.</p>
            </div>
        );
    }

    const isPositive = data.pctChange >= 0;

    return (
        <div className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
            {/* Header */}
            <section className="flex flex-col items-center text-center mb-10 sm:mb-16 animate-in fade-in zoom-in duration-700">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 mb-6">
                    <span className="relative flex h-2 w-2">
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500/50"></span>
                    </span>
                    <span className="text-xs font-bold tracking-widest uppercase">Atualizado a cada 10 min</span>
                </div>

                <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-foreground mb-4">
                    Cotação do Euro <span className="text-indigo-500">Hoje</span>
                </h1>
                <p className="text-lg text-foreground/60 max-w-2xl">
                    Acompanhe o valor da moeda oficial da Zona do Euro frente ao Real (BRL).
                </p>
            </section>

            {/* Card Destaque */}
            <section className="glass-panel p-8 sm:p-12 rounded-[3rem] mb-16 relative overflow-hidden flex flex-col items-center justify-center text-center shadow-2xl shadow-indigo-900/5">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent"></div>

                <div className="relative z-10 w-full flex flex-col sm:flex-row items-center justify-between gap-8 sm:gap-4">
                    <div className="text-left flex flex-col items-center sm:items-start">
                        <span className="text-sm font-bold text-foreground/50 uppercase tracking-widest mb-1">Valor Atualizado</span>
                        <div className="text-6xl sm:text-7xl font-black tracking-tighter tabular-nums drop-shadow-sm text-foreground">
                            {formatCurrency(data.bid)}
                        </div>
                        <div className="mt-4 flex items-center gap-3">
                            <span className={`px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 ${isPositive ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400' : 'bg-rose-500/15 text-rose-700 dark:text-rose-400'}`}>
                                {isPositive ? '↑' : '↓'} {formatPercentage(data.pctChange)}
                            </span>
                            <span className="text-sm font-medium text-foreground/50">Hoje</span>
                        </div>
                    </div>

                    <div className="w-full sm:w-px h-px sm:h-32 bg-card-border/50"></div>

                    <div className="text-left flex flex-col items-center sm:items-end gap-2">
                        <span className="text-sm font-medium text-foreground/50">Última Atualização</span>
                        <span className="text-lg font-semibold text-foreground/80 bg-foreground/5 px-4 py-2 rounded-2xl">
                            {formatLastUpdate(data.createDate)}
                        </span>
                        <span className="text-xs text-foreground/40 mt-1">Fonte: Mercado Aberto</span>
                    </div>
                </div>
            </section>

            {/* Conteúdo Informativo */}
            <section className="prose prose-slate dark:prose-invert max-w-none mb-16">
                <h2>A Força da Moeda Europeia</h2>
                <p>
                    O Euro (EUR) é a moeda oficial de 20 dos 27 países membros da União Europeia, formando a chamada Zona Euro. É a segunda moeda mais negociada do mundo, perdendo apenas para o dólar americano, e uma das principais moedas de reserva globais.
                </p>
                <p>
                    Devido aos fortes laços comerciais do Brasil com a Europa, a cotação do Euro afeta os custos de importação e exportação da indústria nacional, além de ser o referencial para o turismo em países europeus dominantes comercialmente como Alemanha, França, e Itália.
                </p>
            </section>

            {/* FAQ Específico */}
            <section>
                <h2 className="text-2xl font-bold tracking-tight text-foreground mb-6">Dúvidas sobre o Euro</h2>
                <FAQ items={euroFaq} />
                <FAQJsonLd items={euroFaq} />
            </section>
        </div>
    );
}
