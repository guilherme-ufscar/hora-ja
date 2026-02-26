import Clock from "@/components/Clock";
import CurrencyCard from "@/components/CurrencyCard";
import FAQ from "@/components/FAQ";
import FAQJsonLd from "@/components/FAQJsonLd";
import { getCurrencies } from "@/lib/api";

const faqItems = [
  {
    question: "Por que usar o fuso horário de Brasília (GMT-3)?",
    answer: "O Horário de Brasília é o horário oficial do Brasil e serve como base para a B3 (Bolsa de Valores Brasileira) e as principais instituições financeiras do país, sendo crucial para o acompanhamento preciso das cotações."
  },
  {
    question: "Com que frequência as cotações são atualizadas?",
    answer: "Nossos dados são sincronizados através da AwesomeAPI e atualizados a cada 10 minutos (600 segundos) para garantir um balanço excelente entre precisão e performance."
  },
  {
    question: "O que é o valor de Compra e a Variação?",
    answer: "O valor de 'Compra' (Bid) reflete quanto o mercado está pagando pela moeda no momento. A 'Variação' mostra o crescimento (verde) ou a queda (vermelho) percentual do dia em relação ao último fechamento."
  }
];

// Incremental Static Regeneration at the Page level, fallback for API failure.
export const revalidate = 600;

export default async function Home() {
  const currencies = await getCurrencies();

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <main className="flex flex-col gap-12">
        {/* Seção principal: Relógio */}
        <section className="w-full flex items-center justify-center min-h-[40vh]">
          <Clock />
        </section>

        {/* Bento Grid layout para as Cotações */}
        <section className="w-full flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row items-baseline sm:items-center justify-between gap-2 sm:gap-4 mb-2">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Cotações (Ultimos Valores)</h2>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500/50"></span>
              </span>
              <span className="text-xs sm:text-sm font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                Atualizado a cada 10 min
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CurrencyCard data={currencies.USD} href="/dolar" />
            <CurrencyCard data={currencies.EUR} href="/euro" />
            <CurrencyCard data={currencies.GBP} href="/libra" />
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-8 mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Perguntas Frequentes</h2>
            <p className="text-foreground/60 mt-2 max-w-2xl mx-auto">Tire suas dúvidas sobre fuso horário, mercados globais e o funcionamento da nossa plataforma.</p>
          </div>

          <FAQ items={faqItems} />
          <FAQJsonLd items={faqItems} />
        </section>
      </main>
    </div>
  );
}
