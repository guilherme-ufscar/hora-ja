"use client";

import { useEffect, useMemo, useState } from "react";
import type { AppCurrencyData, RecentQuotePoint } from "@/lib/api";
import { calculateTravelTotal, convertAmountWithIof, formatDecimalInput, getPaymentLabel, iofRates, parseNumericInput, travelDestinations, type PaymentType } from "@/lib/calculations";
import { currencyDefinitions, currencyMap, type CurrencyCode } from "@/lib/currencies";
import { formatCompactNumber, formatCurrency, formatLastUpdate, formatPercentage } from "@/lib/formatters";

interface CryptoRate { symbol: string; name: string; priceBRL: number; }
const CRYPTOS: CryptoRate[] = [
    { symbol: "BTC", name: "Bitcoin", priceBRL: 0 },
    { symbol: "ETH", name: "Ethereum", priceBRL: 0 },
    { symbol: "SOL", name: "Solana", priceBRL: 0 },
    { symbol: "XRP", name: "XRP", priceBRL: 0 },
    { symbol: "ADA", name: "Cardano", priceBRL: 0 },
    { symbol: "DOT", name: "Polkadot", priceBRL: 0 },
];

type AnyCurrency = CurrencyCode | "BTC" | "ETH" | "SOL" | "XRP" | "ADA" | "DOT";

interface ConverterProps {
    initialCurrencies: Record<string, AppCurrencyData | null>;
    recentQuotes: Record<string, RecentQuotePoint[]>;
}

function getDefaultQuote(code: CurrencyCode): AppCurrencyData {
    const definition = currencyMap[code];

    return {
        id: code,
        name: definition.name,
        symbol: definition.symbol,
        bid: code === "BRL" ? 1 : 0,
        ask: code === "BRL" ? 1 : 0,
        high: code === "BRL" ? 1 : 0,
        low: code === "BRL" ? 1 : 0,
        pctChange: 0,
        varBid: 0,
        createDate: new Date().toISOString(),
        flag: definition.flag,
        route: definition.route,
    };
}

export default function CurrencyConverter({ initialCurrencies, recentQuotes }: ConverterProps) {
    const [currencyA, setCurrencyA] = useState<AnyCurrency>("USD");
    const [currencyB, setCurrencyB] = useState<AnyCurrency>("BRL");
    const [valueA, setValueA] = useState("1");
    const [valueB, setValueB] = useState("");
    const [paymentType, setPaymentType] = useState<PaymentType>("card");
    const [includeIof, setIncludeIof] = useState(true);
    const [travelDestination, setTravelDestination] = useState(travelDestinations[0].countryCode);
    const [cryptoRates, setCryptoRates] = useState<CryptoRate[]>(CRYPTOS);
    const isCrypto = (c: string) => ["BTC", "ETH", "SOL", "XRP", "ADA", "DOT"].includes(c);

    // Buscar taxas de cripto dinâmicas
    useEffect(() => {
        const fetchCrypto = async () => {
            try {
                const res = await fetch("/api/crypto/prices", { cache: "no-store" });
                if (res.ok) {
                    const data = await res.json();
                    const map: Record<string, string> = {
                        bitcoin: "BTC", ethereum: "ETH", solana: "SOL",
                        ripple: "XRP", cardano: "ADA", polkadot: "DOT",
                    };
                    setCryptoRates(prev => prev.map(c => {
                        const geckoId = Object.entries(map).find(([_, v]) => v === c.symbol)?.[0];
                        const price = geckoId ? (data as any)[geckoId]?.brl : 0;
                        return { ...c, priceBRL: price || c.priceBRL };
                    }));
                }
            } catch {/* ignore */}
        };
        fetchCrypto();
        const interval = setInterval(fetchCrypto, 60_000);
        return () => clearInterval(interval);
    }, []);
    const [travelAmount, setTravelAmount] = useState("100");
    const [shareFeedback, setShareFeedback] = useState<string | null>(null);

    const availableCurrencies = useMemo(
        () => currencyDefinitions.map((definition) => initialCurrencies[definition.code] ?? getDefaultQuote(definition.code)),
        [initialCurrencies],
    );

    const sourceCurrency: any = (() => {
        if (isCrypto(currencyA)) {
            const c = cryptoRates.find(cr => cr.symbol === currencyA);
            return { id: currencyA, name: c?.name || currencyA, bid: c?.priceBRL || 0, pctChange: 0, ask: 0, high: 0, low: 0, varBid: 0, createDate: new Date().toISOString(), flag: "", route: "" };
        }
        return availableCurrencies.find((currency) => currency.id === currencyA) ?? getDefaultQuote(currencyA as CurrencyCode);
    })();
    const targetCurrency: any = (() => {
        if (isCrypto(currencyB)) {
            const c = cryptoRates.find(cr => cr.symbol === currencyB);
            return { id: currencyB, name: c?.name || currencyB, bid: c?.priceBRL || 0, pctChange: 0, ask: 0, high: 0, low: 0, varBid: 0, createDate: new Date().toISOString(), flag: "", route: "" };
        }
        return availableCurrencies.find((currency) => currency.id === currencyB) ?? getDefaultQuote(currencyB as CurrencyCode);
    })();

    const calculate = (amount: string, fromCode: AnyCurrency, toCode: AnyCurrency) => {
        const amt = parseNumericInput(amount);
        const aIsCrypto = isCrypto(fromCode);
        const bIsCrypto = isCrypto(toCode);

        if (aIsCrypto && bIsCrypto) {
            // Cripto -> Cripto
            const fromRate = cryptoRates.find(c => c.symbol === fromCode)?.priceBRL || 0;
            const toRate = cryptoRates.find(c => c.symbol === toCode)?.priceBRL || 1;
            if (fromRate === 0) return "0.00";
            const brlValue = amt * fromRate;
            return (brlValue / toRate).toFixed(8);
        } else if (aIsCrypto) {
            // Cripto -> Fiat
            const rate = cryptoRates.find(c => c.symbol === fromCode)?.priceBRL || 0;
            if (rate === 0) return "0.00";
            const brlValue = amt * rate;
            const target = availableCurrencies.find(c => c.id === toCode) ?? getDefaultQuote(toCode as CurrencyCode);
            if (target.bid === 0) return brlValue.toFixed(2);
            const fiatValue = brlValue / target.bid;
            return fiatValue.toFixed(2);
        } else if (bIsCrypto) {
            // Fiat -> Cripto
            const fromCurrency = availableCurrencies.find(c => c.id === fromCode) ?? getDefaultQuote(fromCode as CurrencyCode);
            const brlValue = amt * fromCurrency.bid;
            const rate = cryptoRates.find(c => c.symbol === toCode)?.priceBRL || 0;
            if (rate === 0) return "0.00";
            return (brlValue / rate).toFixed(8);
        } else {
            // Fiat -> Fiat
            const fromCurrency = availableCurrencies.find(c => c.id === fromCode) ?? getDefaultQuote(fromCode as CurrencyCode);
            const toCurrency = availableCurrencies.find(c => c.id === toCode) ?? getDefaultQuote(toCode as CurrencyCode);
            const result = convertAmountWithIof(amt, fromCurrency.bid, toCurrency.bid, paymentType, includeIof);
            return result.convertedAmount.toFixed(2);
        }
    };

    useEffect(() => {
        setValueB(calculate(valueA, currencyA, currencyB));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currencyA, currencyB, initialCurrencies, paymentType, includeIof]);

    const selectedRecentQuotes = recentQuotes[currencyA] ?? recentQuotes[currencyB] ?? [];

    const destinationCurrency = travelDestinations.find((destination) => destination.countryCode === travelDestination)?.currencyCode ?? "USD";
    const destinationQuote = availableCurrencies.find((currency) => currency.id === destinationCurrency) ?? getDefaultQuote(destinationCurrency);
    const travelEstimate = calculateTravelTotal(parseNumericInput(travelAmount), destinationQuote, paymentType);
    const conversionPreview: any = (() => {
        // Não calcular IOF para cripto
        if (isCrypto(currencyA) || isCrypto(currencyB)) {
            return { convertedAmount: 0, iofAmount: 0, totalWithIof: 0, baseAmount: 0, totalInBrl: 0 };
        }
        try {
            return convertAmountWithIof(parseNumericInput(valueA), sourceCurrency?.bid || 0, targetCurrency?.bid || 1, paymentType, includeIof);
        } catch {
            return { convertedAmount: 0, iofAmount: 0, totalWithIof: 0, baseAmount: 0, totalInBrl: 0 };
        }
    })();

    async function handleShare() {
        const destinationLabel = travelDestinations.find((destination) => destination.countryCode === travelDestination)?.label ?? "Destino";
        const message = `Simulação HoraJá Cambio\n${destinationLabel}: ${formatCompactNumber(travelAmount)} ${destinationCurrency}\nForma de pagamento: ${getPaymentLabel(paymentType)}\nTotal estimado: ${formatCurrency(travelEstimate.totalInBrl)}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: "Simulação de câmbio",
                    text: message,
                });
                setShareFeedback("Simulação compartilhada com sucesso.");
                return;
            } catch {
                setShareFeedback("Compartilhamento cancelado.");
                return;
            }
        }

        await navigator.clipboard.writeText(message);
        setShareFeedback("Resumo copiado para a área de transferência.");
    }

    return (
        <div className="w-full max-w-6xl mx-auto flex flex-col gap-10">
            <div className="glass-panel p-6 sm:p-10 w-full relative overflow-hidden rounded-[2.5rem] shadow-xl shadow-emerald-900/5">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-blue-500/5"></div>

                <div className="relative z-10 flex flex-col gap-8">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary">Conversor em tempo real</span>
                            <h2 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight text-foreground">Converta, compare IOF e veja o custo estimado</h2>
                        </div>
                        <div className="flex flex-wrap gap-2 items-center">
                            {(["card", "cash", "transfer"] as const).map((type) => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setPaymentType(type)}
                                    className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${paymentType === type ? "bg-primary text-white" : "bg-foreground/5 text-foreground/70 hover:bg-foreground/10"}`}
                                >
                                    {getPaymentLabel(type)} · IOF {(iofRates[type] * 100).toFixed(2)}%
                                </button>
                            ))}
                            <button
                                type="button"
                                onClick={() => setIncludeIof((current) => !current)}
                                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${includeIof ? "bg-foreground text-background" : "bg-foreground/5 text-foreground/70 hover:bg-foreground/10"}`}
                            >
                                {includeIof ? "IOF incluído" : "IOF desligado"}
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
                        <div className="flex-1 w-full bg-background/50 rounded-3xl p-6 border border-card-border shadow-inner">
                            <label className="block text-sm font-semibold text-foreground/60 mb-2 uppercase tracking-wide">De</label>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <input
                                    type="text"
                                    inputMode="decimal"
                                    value={valueA}
                                    onChange={(e) => {
                                        const nextValue = formatDecimalInput(e.target.value);
                                        setValueA(nextValue);
                                        setValueB(calculate(nextValue, currencyA, currencyB));
                                    }}
                                    placeholder="0,00"
                                    className="w-full sm:w-2/3 bg-transparent text-4xl sm:text-5xl font-black text-foreground outline-none tabular-nums placeholder:text-foreground/20"
                                />
                                <div className="relative w-full sm:w-1/3">
                                    <select
                                        value={currencyA}
                                        onChange={(e) => setCurrencyA(e.target.value as AnyCurrency)}
                                        className="w-full h-full min-h-[64px] bg-foreground/5 border-none rounded-xl text-lg font-bold text-foreground py-3 pl-4 pr-12 focus:ring-2 focus:ring-primary outline-none cursor-pointer appearance-none"
                                    >
                                        <optgroup label="Moedas Fiduciárias" className="bg-[#0f172a] text-white">
                                            {availableCurrencies.map((currency) => (
                                                <option key={currency.id} value={currency.id} className="bg-[#0f172a] text-white">
                                                    {currency.flag} {currency.id} - {currency.name}
                                                </option>
                                            ))}
                                        </optgroup>
                                        <optgroup label="Criptomoedas" className="bg-[#0f172a] text-white">
                                            {cryptoRates.map((c) => (
                                                <option key={c.symbol} value={c.symbol} className="bg-[#0f172a] text-white">
                                                    {c.symbol} - {c.name}
                                                </option>
                                            ))}
                                        </optgroup>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="shrink-0 flex items-center justify-center -my-2 md:-mx-4 z-20">
                            <button
                                type="button"
                                className="bg-primary text-white p-4 rounded-full shadow-lg shadow-primary/30 flex items-center justify-center transform hover:rotate-180 transition-transform duration-500 cursor-pointer"
                                onClick={() => {
                                    setCurrencyA(currencyB);
                                    setCurrencyB(currencyA);
                                    setValueA(valueB);
                                    setValueB(valueA);
                                }}
                                title="Inverter moedas"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 3 21 3 21 8" /><line x1="4" y1="21" x2="21" y2="3" /><polyline points="21 16 21 21 16 21" /><line x1="15" y1="15" x2="21" y2="21" /><line x1="4" y1="4" x2="9" y2="9" /></svg>
                            </button>
                        </div>

                        <div className="flex-1 w-full bg-background/50 rounded-3xl p-6 border border-card-border shadow-inner">
                            <label className="block text-sm font-semibold text-foreground/60 mb-2 uppercase tracking-wide">Para</label>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <input
                                    type="text"
                                    inputMode="decimal"
                                    value={valueB}
                                    onChange={(e) => {
                                        const nextValue = formatDecimalInput(e.target.value);
                                        setValueB(nextValue);
                                        setValueA(calculate(nextValue, currencyB, currencyA));
                                    }}
                                    placeholder="0,00"
                                    className="w-full sm:w-2/3 bg-transparent text-4xl sm:text-5xl font-black text-primary outline-none tabular-nums placeholder:text-primary/20"
                                />
                                <div className="relative w-full sm:w-1/3">
                                    <select
                                        value={currencyB}
                                        onChange={(e) => setCurrencyB(e.target.value as AnyCurrency)}
                                        className="w-full h-full min-h-[64px] bg-foreground/5 border-none rounded-xl text-lg font-bold text-foreground py-3 pl-4 pr-12 focus:ring-2 focus:ring-primary outline-none cursor-pointer appearance-none"
                                    >
                                        <optgroup label="Moedas Fiduciárias" className="bg-[#0f172a] text-white">
                                            {availableCurrencies.map((currency) => (
                                                <option key={currency.id} value={currency.id} className="bg-[#0f172a] text-white">
                                                    {currency.flag} {currency.id} - {currency.name}
                                                </option>
                                            ))}
                                        </optgroup>
                                        <optgroup label="Criptomoedas" className="bg-[#0f172a] text-white">
                                            {cryptoRates.map((c) => (
                                                <option key={c.symbol} value={c.symbol} className="bg-[#0f172a] text-white">
                                                    {c.symbol} - {c.name}
                                                </option>
                                            ))}
                                        </optgroup>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6">
                        <div className="rounded-3xl border border-card-border/60 bg-foreground/3 p-6">
                            <div className="flex items-center justify-between gap-4 mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-foreground">Últimas 5 cotações</h3>
                                    <p className="text-sm text-foreground/60">Referência recente para a moeda mais importante desta conversão.</p>
                                </div>
                                <span className={`rounded-full px-3 py-1 text-sm font-semibold ${sourceCurrency.pctChange >= 0 ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"}`}>
                                    {formatPercentage(sourceCurrency.pctChange)}
                                </span>
                            </div>

                            <div className="space-y-3">
                                {selectedRecentQuotes.map((quote) => (
                                    <div key={`${quote.timestamp}-${quote.createDate}`} className="flex items-center justify-between rounded-2xl bg-background/60 px-4 py-3 text-sm">
                                        <div>
                                            <div className="font-semibold text-foreground">{formatLastUpdate(quote.createDate)}</div>
                                            <div className="text-foreground/50">Máx. {formatCurrency(quote.high)} · Mín. {formatCurrency(quote.low)}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-foreground">{formatCurrency(quote.bid)}</div>
                                            <div className={`${quote.pctChange >= 0 ? "text-emerald-600" : "text-rose-600"}`}>{formatPercentage(quote.pctChange)}</div>
                                        </div>
                                    </div>
                                ))}
                                {!selectedRecentQuotes.length && (
                                    <div className="rounded-2xl bg-background/60 px-4 py-6 text-center text-sm text-foreground/50">
                                        Sem leituras intraday disponíveis no momento.
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="rounded-3xl border border-card-border/60 bg-foreground/3 p-6">
                            <h3 className="text-xl font-bold text-foreground">Resumo da conversão</h3>
                            <div className="mt-4 space-y-4 text-sm text-foreground/70">
                                <div>
                                    <div className="text-foreground/50">Moeda de origem</div>
                                    <strong className="text-lg text-foreground">{sourceCurrency.flag} {sourceCurrency.id} · {sourceCurrency.name}</strong>
                                </div>
                                <div>
                                    <div className="text-foreground/50">Moeda de destino</div>
                                    <strong className="text-lg text-foreground">{targetCurrency.flag} {targetCurrency.id} · {targetCurrency.name}</strong>
                                </div>
                                <div>
                                    <div className="text-foreground/50">Cotação usada</div>
                                    <strong className="text-lg text-foreground">{formatCurrency(sourceCurrency.bid)}</strong>
                                </div>
                                <div>
                                    <div className="text-foreground/50">Última atualização</div>
                                    <strong className="text-base text-foreground">{formatLastUpdate(sourceCurrency.createDate)}</strong>
                                </div>
                                <div>
                                    <div className="text-foreground/50">Simulação com {getPaymentLabel(paymentType)}</div>
                                    <strong className="text-base text-foreground">{includeIof ? `IOF de ${(iofRates[paymentType] * 100).toFixed(2)}% aplicado` : "Conversão sem IOF"}</strong>
                                </div>
                                <div>
                                    <div className="text-foreground/50">Total em BRL da origem</div>
                                    <strong className="text-base text-foreground">{formatCurrency(conversionPreview.totalInBrl)}</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-6">
                <section className="glass-panel p-6 sm:p-8 rounded-[2rem]">
                    <div className="flex flex-col gap-3 mb-6">
                        <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary">Calculadora de viagem</span>
                        <h3 className="text-3xl font-black tracking-tight text-foreground">Quanto isso vira em reais com IOF e spread</h3>
                        <p className="text-foreground/60">Escolha o destino, informe o valor na moeda local e veja o total estimado em BRL com base na cotação atual.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="flex flex-col gap-2 text-sm font-semibold text-foreground/70">
                            País de destino
                            <select
                                value={travelDestination}
                                onChange={(e) => setTravelDestination(e.target.value)}
                                className="min-h-[56px] rounded-2xl border border-card-border bg-foreground/5 px-4 text-base text-foreground outline-none"
                            >
                                {travelDestinations.map((destination) => (
                                    <option key={destination.countryCode} value={destination.countryCode}>
                                        {destination.label}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="flex flex-col gap-2 text-sm font-semibold text-foreground/70">
                            Valor na moeda local
                            <input
                                type="text"
                                inputMode="decimal"
                                value={travelAmount}
                                onChange={(e) => setTravelAmount(formatDecimalInput(e.target.value))}
                                className="min-h-[56px] rounded-2xl border border-card-border bg-foreground/5 px-4 text-base text-foreground outline-none"
                                placeholder="0,00"
                            />
                        </label>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-2">
                        {(["card", "cash", "transfer"] as const).map((type) => (
                            <button
                                key={`travel-${type}`}
                                type="button"
                                onClick={() => setPaymentType(type)}
                                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${paymentType === type ? "bg-primary text-white" : "bg-foreground/5 text-foreground/70 hover:bg-foreground/10"}`}
                            >
                                {getPaymentLabel(type)}
                            </button>
                        ))}
                    </div>

                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="rounded-3xl bg-background/60 p-5">
                            <div className="text-sm text-foreground/50">Valor base</div>
                            <div className="mt-2 text-2xl font-black text-foreground">{formatCurrency(travelEstimate.baseInBrl)}</div>
                        </div>
                        <div className="rounded-3xl bg-background/60 p-5">
                            <div className="text-sm text-foreground/50">Spread estimado</div>
                            <div className="mt-2 text-2xl font-black text-foreground">{formatCurrency(travelEstimate.spreadInBrl)}</div>
                        </div>
                        <div className="rounded-3xl bg-background/60 p-5">
                            <div className="text-sm text-foreground/50">IOF</div>
                            <div className="mt-2 text-2xl font-black text-foreground">{formatCurrency(travelEstimate.iofInBrl)}</div>
                        </div>
                        <div className="rounded-3xl bg-primary/10 p-5 border border-primary/20">
                            <div className="text-sm text-primary/80">Total estimado em BRL</div>
                            <div className="mt-2 text-2xl font-black text-foreground">{formatCurrency(travelEstimate.totalInBrl)}</div>
                        </div>
                    </div>
                </section>

                <aside className="glass-panel p-6 sm:p-8 rounded-[2rem] flex flex-col gap-6">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary">Compartilhar</span>
                        <h3 className="mt-3 text-2xl font-black tracking-tight text-foreground">Envie a simulação para outra pessoa</h3>
                        <p className="mt-2 text-foreground/60">Use a Web Share API quando disponível no dispositivo. Em navegadores compatíveis, o resumo também pode ser copiado.</p>
                    </div>

                    <div className="rounded-3xl bg-background/60 p-5 text-sm text-foreground/70">
                        <div><strong className="text-foreground">Destino:</strong> {travelDestinations.find((destination) => destination.countryCode === travelDestination)?.label}</div>
                        <div className="mt-2"><strong className="text-foreground">Valor:</strong> {formatCompactNumber(travelAmount)} {destinationCurrency}</div>
                        <div className="mt-2"><strong className="text-foreground">Pagamento:</strong> {getPaymentLabel(paymentType)}</div>
                        <div className="mt-2"><strong className="text-foreground">Taxa efetiva:</strong> {formatCurrency(travelEstimate.effectiveRate)}</div>
                    </div>

                    <button
                        type="button"
                        onClick={handleShare}
                        className="rounded-full bg-primary px-6 py-3 text-base font-bold text-white shadow-lg shadow-primary/30 hover:bg-primary-hover transition-colors"
                    >
                        Compartilhar simulação
                    </button>

                    {shareFeedback && <p className="text-sm text-primary">{shareFeedback}</p>}
                </aside>
            </div>
        </div>
    );
}
