import { getCurrencies } from "@/lib/api";
import CurrencyConverter from "@/components/CurrencyConverter";
import FAQ from "@/components/FAQ";

export const revalidate = 600;

export async function generateMetadata() {
    return {
        title: "Conversor de Moedas | Cotação em Tempo Real | Hora Já",
        description: "Converta Dólar, Euro e Libra para Real instantaneamente. Ferramenta gratuita de conversão de câmbio online.",
    };
}

export default async function ConversorPage() {
    const currencies = await getCurrencies();

    return (
        <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">

            {/* Header */}
            <section className="flex flex-col items-center text-center mb-16 animate-in fade-in zoom-in duration-700">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-foreground mb-6">
                    Conversor de <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">Moedas</span>
                </h1>
                <p className="text-lg md:text-xl text-foreground/60 max-w-2xl">
                    Conversão instantânea, precisa e bidirecional das principais moedas em circulação no mercado global.
                </p>
            </section>

            {/* Ferramenta Interativa Client-Side */}
            <section className="mb-24">
                <CurrencyConverter initialCurrencies={currencies} />
            </section>

            {/* Conteúdo Textual SEO e Instrucional */}
            <section className="max-w-4xl mx-auto prose prose-slate dark:prose-invert">
                <h2>Como funciona nosso conversor?</h2>
                <p>
                    Nosso painel interativo permite que você visualize de maneira <strong>instantânea</strong> a conversão entre o Real Brasileiro (BRL) e três das divisas mais influentes mundialmente: Dólar Americano (USD), Euro (EUR) e Libra Esterlina (GBP).
                </p>
                <p>
                    A tecnologia <em>Stale-While-Revalidate</em> do <strong>Hora Já</strong> garante que todas as cotações financeiras utilizadas nas conversões estejam sincronizadas com a <strong>AwesomeAPI</strong>, com precisão garantida e latência próxima a zero.
                </p>
            </section>

            {/* FAQ Conversor */}
            <section className="max-w-4xl mx-auto mt-16">
                <h2 className="text-2xl font-bold tracking-tight text-foreground mb-6">Dúvidas sobre Conversão</h2>
                <FAQ items={[
                    {
                        question: "Posso confiar nos valores exibidos para realizar uma viagem?",
                        answer: "Os valores apresentados na plataforma referem-se à cotação COMERCIAL. Se você for viajar e precisar comprar moeda física em espécie, as corretoras e bancos usarão o dólar TURISMO, que inclui taxas extras, IOF e a margem de lucro da instituição financeira. Utilize nossa ferramenta como referência de mercado."
                    },
                    {
                        question: "Como o cálculo bidirecional é feito na hora?",
                        answer: "Nós utilizamos o Real Brasileiro (BRL) como moeda de ponte segura. Exemplo: Para converter 10 Dólares para Euros, nossa lógica calcula primeiro quanto 10 Dólares equivalem em Reais (BRL), e imediatamente depois converte esse saldo intermediário em Euros (EUR)."
                    }
                ]} />
            </section>

        </div>
    );
}
