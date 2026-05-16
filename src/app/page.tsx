import Clock from "@/components/Clock";
import CurrencyCard from "@/components/CurrencyCard";
import FAQ from "@/components/FAQ";
import FAQJsonLd from "@/components/FAQJsonLd";
import AdSlot from "@/components/AdSlot";
import GlobalMarketsPanel from "@/components/GlobalMarketsPanel";
import MarketClockGrid from "@/components/MarketClockGrid";
import CurrencyQuickLinks from "@/components/CurrencyQuickLinks";
import { getFeaturedCurrencies } from "@/lib/api";
import { homepageFaq } from "@/lib/site-content";
import { buildStaticMetadata } from "@/lib/metadata";

export const revalidate = 600;

export const metadata = buildStaticMetadata(
    "/",
    "HoraJá Cambio | Cotações, conversor e mercados globais",
    "Acompanhe cotações, compare IOF, veja histórico cambial e consulte relógios de mercados mundiais em um só lugar.",
);

export default async function Home() {
    const currencies = await getFeaturedCurrencies();

    return (
        <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <main className="flex flex-col gap-12">
                <section className="w-full flex items-center justify-center min-h-[40vh]">
                    <Clock />
                </section>

                <section className="w-full flex justify-center">
                    <AdSlot label="Banner abaixo do menu" width={728} height={90} className="max-w-[728px]" />
                </section>

                <section className="w-full flex flex-col gap-6">
                    <div className="flex flex-col sm:flex-row items-baseline sm:items-center justify-between gap-2 sm:gap-4 mb-2">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary">Câmbio ao vivo</span>
                            <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground">Principais moedas acompanhadas no HoraJá Cambio</h2>
                        </div>
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

                <CurrencyQuickLinks />
                <GlobalMarketsPanel />
                <MarketClockGrid />

                <section className="mt-8 mb-8">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold tracking-tight text-foreground">Perguntas frequentes</h2>
                        <p className="text-foreground/60 mt-2 max-w-2xl mx-auto">
                            Tire dúvidas sobre atualização das cotações, IOF e como usar as ferramentas do site no seu planejamento de câmbio.
                        </p>
                    </div>

                    <FAQ items={homepageFaq} />
                    <FAQJsonLd items={homepageFaq} />
                </section>
            </main>
        </div>
    );
}
