import { getCurrencies } from "@/lib/api";
import { formatCurrency, formatLastUpdate, formatPercentage } from "@/lib/formatters";
import FAQ from "@/components/FAQ";
import FAQJsonLd from "@/components/FAQJsonLd";

const dolarFaq = [
    {
        question: "Qual a diferença entre Dólar Comercial e Turismo?",
        answer: "O comercial é usado em transações entre países e empresas (mercado financeiro). O turismo é aquele que você compra em casas de câmbio para viajar, e costuma ser mais caro por incluir custos administrativos, transporte da moeda física e o lucro da corretora."
    },
    {
        question: "Quem define o valor do Dólar no Brasil?",
        answer: "No Brasil, o câmbio é flutuante. O valor é definido pelo próprio mercado a cada segundo de acordo com quem compra e quem vende. O Banco Central atua apenas ocasionalmente para evitar variações muito bruscas (suavizar volatilidade)."
    }
];
export const revalidate = 600;

export async function generateMetadata() {
    return {
        title: "Cotação do Dólar Comercial Hoje | Hora Já",
        description: "Acompanhe o valor atualizado do Dólar Comercial (USD) em tempo real. Veja a variação de hoje e converta para Real (BRL).",
    };
}

export default async function DolarPage() {
    const currencies = await getCurrencies();
    const data = currencies.USD;

    if (!data) {
        return (
            <div className="flex-1 flex items-center justify-center p-8">
                <p className="text-xl text-foreground/60">Não foi possível carregar os dados do Dólar no momento.</p>
            </div>
        );
    }

    const isPositive = data.pctChange >= 0;

    return (
        <div className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
            {/* Header Principal */}
            <section className="flex flex-col items-center text-center mb-10 sm:mb-16 animate-in fade-in zoom-in duration-700">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 mb-6">
                    <span className="relative flex h-2 w-2">
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500/50"></span>
                    </span>
                    <span className="text-xs font-bold tracking-widest uppercase">Atualizado a cada 10 min</span>
                </div>

                <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-foreground mb-4">
                    Cotação do Dólar <span className="text-primary">Hoje</span>
                </h1>
                <p className="text-lg text-foreground/60 max-w-2xl">
                    Acompanhe o valor do Dólar Comercial (USD) atualizado frente ao Real (BRL).
                </p>
            </section>

            {/* Card Destaque */}
            <section className="glass-panel p-8 sm:p-12 rounded-[3rem] mb-16 relative overflow-hidden flex flex-col items-center justify-center text-center shadow-2xl shadow-emerald-900/5">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent"></div>

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
                        <span className="text-xs text-foreground/40 mt-1">Fonte: B3 / Banco Central</span>
                    </div>
                </div>
            </section>

            {/* Conteúdo Informativo */}
            <section className="prose prose-slate dark:prose-invert max-w-none mb-16">
                <h2>Entendendo o Dólar Comercial</h2>
                <p>
                    O dólar comercial é a cotação oficial utilizada no mercado financeiro brasileiro para transações de importação, exportação e movimentações de capital entre empresas e o governo. Diferente do dólar turismo, ele não inclui margens de corretoras, sendo um reflexo mais puro da economia.
                </p>
                <p>
                    As flutuações que você acompanha acima em tempo real são definidas pela lei de oferta e demanda no mercado internacional, e impactam diretamente a inflação e o preço dos produtos que consumimos diariamente.
                </p>
            </section>

            {/* FAQ Específico */}
            <section>
                <h2 className="text-2xl font-bold tracking-tight text-foreground mb-6">Dúvidas Frequentes sobre o Dólar</h2>
                <FAQ items={dolarFaq} />
                <FAQJsonLd items={dolarFaq} />
            </section>
        </div>
    );
}
