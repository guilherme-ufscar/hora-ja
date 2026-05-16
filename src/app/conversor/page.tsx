import CurrencyConverter from "@/components/CurrencyConverter";
import ExchangeAlerts from "@/components/ExchangeAlerts";
import FAQ from "@/components/FAQ";
import AdSlot from "@/components/AdSlot";
import { getCurrencies, getRecentQuotes } from "@/lib/api";
import { buildStaticMetadata } from "@/lib/metadata";

export const revalidate = 600;

export const metadata = buildStaticMetadata(
    "/conversor",
    "Conversor de moedas com IOF | HoraJá Cambio",
    "Converta moedas em tempo real, compare IOF por tipo de pagamento e simule o custo total em reais para viagens e compras no exterior.",
);

const faqItems = [
    {
        question: "Os valores do conversor já incluem IOF?",
        answer: "Você pode alternar entre cartão, espécie e transferência para ver o efeito estimado do IOF no cálculo. A cotação-base continua separada para facilitar a comparação.",
    },
    {
        question: "A calculadora de viagem serve para qual tipo de decisão?",
        answer: "Ela ajuda a prever o custo total em BRL antes de comprar moeda, usar cartão internacional ou enviar dinheiro para o exterior, sempre com foco em custo final e não só na cotação isolada.",
    },
    {
        question: "Posso compartilhar a simulação no celular?",
        answer: "Sim. Em navegadores compatíveis, o site usa a Web Share API para compartilhar a simulação. Caso não esteja disponível, o resumo pode ser copiado.",
    },
];

export default async function ConversorPage() {
    const currencies = await getCurrencies();
    const [recentUsd, recentEur, recentGbp, recentArs, recentCad, recentChf, recentJpy, recentCny] = await Promise.all([
        getRecentQuotes("USD", 5),
        getRecentQuotes("EUR", 5),
        getRecentQuotes("GBP", 5),
        getRecentQuotes("ARS", 5),
        getRecentQuotes("CAD", 5),
        getRecentQuotes("CHF", 5),
        getRecentQuotes("JPY", 5),
        getRecentQuotes("CNY", 5),
    ]);

    return (
        <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
            <section className="flex flex-col items-center text-center mb-16 animate-in fade-in zoom-in duration-700">
                <span className="inline-flex rounded-full bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-primary">
                    Ferramentas de câmbio
                </span>
                <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-foreground mb-6">
                    Conversor de <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">moedas</span>
                </h1>
                <p className="text-lg md:text-xl text-foreground/60 max-w-3xl">
                    Faça conversões em tempo real, compare IOF por forma de pagamento e estime o custo total em reais para viagens, remessas e compras internacionais.
                </p>
            </section>

            <section className="mb-24">
                <CurrencyConverter
                    initialCurrencies={currencies}
                    recentQuotes={{
                        USD: recentUsd,
                        EUR: recentEur,
                        GBP: recentGbp,
                        ARS: recentArs,
                        CAD: recentCad,
                        CHF: recentChf,
                        JPY: recentJpy,
                        CNY: recentCny,
                    }}
                />
            </section>

            <section className="mb-16 flex justify-center">
                <AdSlot label="Banner mobile entre seções" width={320} height={50} />
            </section>

            <section className="max-w-5xl mx-auto">
                <ExchangeAlerts currencies={currencies} />
            </section>

            <section className="max-w-4xl mx-auto prose prose-slate dark:prose-invert mt-16">
                <h2>Como usar o conversor com mais inteligência</h2>
                <p>
                    A cotação comercial ajuda a acompanhar o mercado, mas a decisão prática exige olhar também para IOF, spread, tempo da operação e o objetivo do gasto. Por isso, o conversor agora vai além do valor bruto e aproxima o cálculo do custo real em reais.
                </p>
                <p>
                    Se a operação for para viagem, a calculadora complementar ajuda a comparar cenários com mais contexto. Se for para remessa, o ideal é combinar a simulação com uma comparação entre parceiros e prazo de liquidação.
                </p>
            </section>

            <section className="max-w-4xl mx-auto mt-16">
                <h2 className="text-2xl font-bold tracking-tight text-foreground mb-6">Dúvidas sobre conversão e IOF</h2>
                <FAQ items={faqItems} />
            </section>
        </div>
    );
}
