import { getCurrencies } from "@/lib/api";
import { formatCurrency, formatLastUpdate, formatPercentage } from "@/lib/formatters";
import FAQ from "@/components/FAQ";
import FAQJsonLd from "@/components/FAQJsonLd";

const libraFaq = [
    {
        question: "A Inglaterra usa o Euro ou a Libra?",
        answer: "Apesar de ter feito parte da União Europeia até a conclusão do Brexit, o Reino Unido nunca adotou o Euro. A Libra Esterlina sempre foi a única moeda oficial."
    }
];
export const revalidate = 600;

export async function generateMetadata() {
    return {
        title: "Cotação da Libra Hoje | Hora Já",
        description: "Acompanhe o valor da Libra Esterlina (GBP) atualizado em tempo real. Consulte a variação diária.",
    };
}

export default async function LibraPage() {
    const currencies = await getCurrencies();
    const data = currencies.GBP;

    if (!data) {
        return (
            <div className="flex-1 flex items-center justify-center p-8">
                <p className="text-xl text-foreground/60">Não foi possível carregar os dados da Libra no momento.</p>
            </div>
        );
    }

    const isPositive = data.pctChange >= 0;

    return (
        <div className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
            <section className="flex flex-col items-center text-center mb-10 sm:mb-16 animate-in fade-in zoom-in duration-700">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 mb-6">
                    <span className="relative flex h-2 w-2">
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500/50"></span>
                    </span>
                    <span className="text-xs font-bold tracking-widest uppercase">Atualizado a cada 10 min</span>
                </div>

                <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-foreground mb-4">
                    Cotação da Libra <span className="text-purple-500">Hoje</span>
                </h1>
                <p className="text-lg text-foreground/60 max-w-2xl">
                    Acompanhe o valor da moeda mais antiga do mundo ainda em uso.
                </p>
            </section>

            {/* Card Destaque */}
            <section className="glass-panel p-8 sm:p-12 rounded-[3rem] mb-16 relative overflow-hidden flex flex-col items-center justify-center text-center shadow-2xl shadow-purple-900/5">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent"></div>

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
                        <span className="text-xs text-foreground/40 mt-1">Fonte: Forex Exchange</span>
                    </div>
                </div>
            </section>

            {/* Conteúdo Informativo */}
            <section className="prose prose-slate dark:prose-invert max-w-none mb-16">
                <h2>A Libra Esterlina no Mercado Global</h2>
                <p>
                    A Libra Esterlina (GBP) é a moeda do Reino Unido e uma das divisas mais influentes e valorizadas do mercado internacional. Considerada uma moeda historicamente muito forte e de grande reserva de valor, a libra comanda uma alta taxa de câmbio perante moedas de países emergentes, como o Brasil.
                </p>
            </section>

            {/* FAQ Específico */}
            <section>
                <h2 className="text-2xl font-bold tracking-tight text-foreground mb-6">Dúvidas sobre a Libra</h2>
                <FAQ items={libraFaq} />
                <FAQJsonLd items={libraFaq} />
            </section>
        </div>
    );
}
