import Link from "next/link";
import { currencyDefinitions } from "@/lib/currencies";

export default function CurrencyQuickLinks() {
    const currencies = currencyDefinitions.filter((currency) => currency.code !== "BRL");

    return (
        <section className="mt-16">
            <div className="flex flex-col gap-3 mb-8">
                <span className="text-xs font-bold tracking-[0.25em] uppercase text-primary">Moedas acompanhadas</span>
                <h2 className="text-3xl font-black tracking-tight text-foreground">Acesse rapidamente cada página de moeda</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {currencies.map((currency) => (
                    <Link key={currency.code} href={currency.route} className="glass-panel p-5 flex flex-col gap-2 transition-transform duration-300 hover:-translate-y-1">
                        <div className="text-3xl">{currency.flag}</div>
                        <strong className="text-lg text-foreground">{currency.shortName}</strong>
                        <span className="text-sm text-foreground/60">{currency.code}/BRL</span>
                    </Link>
                ))}
            </div>
        </section>
    );
}
