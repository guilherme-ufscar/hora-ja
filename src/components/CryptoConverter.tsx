"use client";

import { useState, useEffect, useCallback } from "react";

interface CryptoRate {
    symbol: string;
    name: string;
    price: number;
    change24h: number;
}

const CRIPTOS = [
    { symbol: "BTC", name: "Bitcoin", icon: "₿" },
    { symbol: "ETH", name: "Ethereum", icon: "Ξ" },
    { symbol: "SOL", name: "Solana", icon: "◎" },
    { symbol: "XRP", name: "Ripple", icon: "✕" },
    { symbol: "ADA", name: "Cardano", icon: "₳" },
    { symbol: "DOT", name: "Polkadot", icon: "●" },
];

const FIAT_CURRENCIES = [
    { symbol: "BRL", name: "Real Brasileiro", flag: "🇧🇷" },
    { symbol: "USD", name: "Dólar Americano", flag: "🇺🇸" },
    { symbol: "EUR", name: "Euro", flag: "🇪🇺" },
];

export default function CryptoConverter() {
    const [cryptoRates, setCryptoRates] = useState<Record<string, number>>({});
    const [fiatRates, setFiatRates] = useState<Record<string, number>>({ USD: 1, EUR: 0.92, BRL: 5.0 });
    const [loading, setLoading] = useState(true);

    const [fromCrypto, setFromCrypto] = useState("BTC");
    const [toFiat, setToFiat] = useState("BRL");
    const [fromAmount, setFromAmount] = useState("1");
    const [toAmount, setToAmount] = useState("");

    const [reverseFromCrypto, setReverseFromCrypto] = useState("BTC");
    const [reverseToCrypto, setReverseToCrypto] = useState("ETH");
    const [reverseFromAmount, setReverseFromAmount] = useState("1");
    const [reverseToAmount, setReverseToAmount] = useState("");

    // Buscar cotações reais da API CoinGecko via proxy
    const fetchCryptoRates = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/crypto/prices", { cache: "no-store" });
            if (res.ok) {
                const data = await res.json();
                const rates: Record<string, number> = {};
                for (const [geckoId, info] of Object.entries(data)) {
                    const geckoIdToSymbol: Record<string, string> = {
                        bitcoin: "BTC", ethereum: "ETH", solana: "SOL",
                        ripple: "XRP", cardano: "ADA", polkadot: "DOT",
                    };
                    const sym = geckoIdToSymbol[geckoId];
                    if (sym && (info as any).brl) rates[sym] = (info as any).brl;
                }
                setCryptoRates(rates);
            }
        } catch (error) {
            console.error("Erro ao buscar cripto:", error);
            setCryptoRates({ BTC: 635000, ETH: 18500, SOL: 145, XRP: 3.5, ADA: 2.85, DOT: 42 });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCryptoRates();
        // Atualizar a cada 60 segundos
        const interval = setInterval(fetchCryptoRates, 60000);
        return () => clearInterval(interval);
    }, [fetchCryptoRates]);

    // Calcular conversão cripto -> fiat
    const calculateCryptoToFiat = useCallback(() => {
        if (!cryptoRates[fromCrypto] || !fromAmount) {
            setToAmount("");
            return;
        }
        const cryptoValue = parseFloat(fromAmount) * cryptoRates[fromCrypto];
        const fiatRate = fiatRates[toFiat] || 1;
        const result = cryptoValue / fiatRate;
        setToAmount(result.toLocaleString("en-US", { maximumFractionDigits: 8 }));
    }, [fromCrypto, toFiat, fromAmount, cryptoRates, fiatRates]);

    // Calcular conversão cripto -> cripto
    const calculateCryptoToCrypto = useCallback(() => {
        if (!cryptoRates[reverseFromCrypto] || !reverseFromAmount) {
            setReverseToAmount("");
            return;
        }
        const fromValue = parseFloat(reverseFromAmount) * cryptoRates[reverseFromCrypto];
        const toValue = fromValue / cryptoRates[reverseToCrypto];
        setReverseToAmount(toValue.toLocaleString("en-US", { maximumFractionDigits: 8 }));
    }, [reverseFromCrypto, reverseToCrypto, reverseFromAmount, cryptoRates]);

    useEffect(() => {
        calculateCryptoToFiat();
    }, [calculateCryptoToFiat]);

    useEffect(() => {
        calculateCryptoToCrypto();
    }, [calculateCryptoToCrypto]);

    const formatPrice = (price: number) => {
        if (price >= 1000) {
            return price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
        }
        return price.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 4 });
    };

    return (
        <div className="space-y-12">
            {/* Cotação em tempo real */}
            <section>
                <h2 className="text-2xl font-bold text-foreground mb-6">Cotações em tempo real</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {CRIPTOS.map((crypto) => {
                        const price = cryptoRates[crypto.symbol] || 0;
                        return (
                            <div key={crypto.symbol} className="glass-panel p-4 text-center">
                                <div className="text-3xl mb-2">{crypto.icon}</div>
                                <div className="font-bold text-foreground">{crypto.symbol}</div>
                                <div className="text-sm text-foreground/60 mb-1">{crypto.name}</div>
                                {loading ? (
                                    <div className="h-6 bg-card-bg rounded animate-pulse mx-auto w-20"></div>
                                ) : (
                                    <div className="font-semibold text-foreground text-sm">
                                        {formatPrice(price)}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Conversor Cripto -> Fiat */}
            <section className="glass-panel p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">Converter para moeda fiduciária</h2>
                <div className="flex flex-col lg:flex-row gap-6 items-end">
                    <div className="flex-1 flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-foreground/50">Criptomoeda</label>
                        <select
                            value={fromCrypto}
                            onChange={(e) => setFromCrypto(e.target.value)}
                            className="w-full rounded-xl bg-card-bg border border-card-border px-4 py-3 text-foreground focus:outline-none focus:border-primary"
                        >
                            {CRIPTOS.map((c) => (
                                <option key={c.symbol} value={c.symbol}>
                                    {c.icon} {c.name} ({c.symbol})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex-1 flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-foreground/50">Quantidade</label>
                        <input
                            type="number"
                            value={fromAmount}
                            onChange={(e) => setFromAmount(e.target.value)}
                            placeholder="0.00"
                            className="w-full rounded-xl bg-card-bg border border-card-border px-4 py-3 text-foreground focus:outline-none focus:border-primary"
                        />
                    </div>

                    <div className="text-4xl text-foreground/30">=</div>

                    <div className="flex-1 flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-foreground/50">Moeda</label>
                        <select
                            value={toFiat}
                            onChange={(e) => setToFiat(e.target.value)}
                            className="w-full rounded-xl bg-card-bg border border-card-border px-4 py-3 text-foreground focus:outline-none focus:border-primary"
                        >
                            {FIAT_CURRENCIES.map((f) => (
                                <option key={f.symbol} value={f.symbol}>
                                    {f.flag} {f.name} ({f.symbol})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex-1 flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-foreground/50">Resultado</label>
                        <div className="w-full rounded-xl bg-primary/10 border border-primary/20 px-4 py-3 text-foreground font-bold text-lg">
                            {toAmount || "0.00"}
                        </div>
                    </div>
                </div>

                {fromAmount && toAmount && (
                    <p className="mt-4 text-sm text-foreground/60">
                        {parseFloat(fromAmount).toLocaleString()} {CRIPTOS.find(c => c.symbol === fromCrypto)?.name} = {toAmount} {toFiat}
                    </p>
                )}
            </section>

            {/* Conversor Cripto -> Cripto */}
            <section className="glass-panel p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">Converter entre criptomoedas</h2>
                <div className="flex flex-col lg:flex-row gap-6 items-end">
                    <div className="flex-1 flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-foreground/50">De</label>
                        <select
                            value={reverseFromCrypto}
                            onChange={(e) => setReverseFromCrypto(e.target.value)}
                            className="w-full rounded-xl bg-card-bg border border-card-border px-4 py-3 text-foreground focus:outline-none focus:border-primary"
                        >
                            {CRIPTOS.map((c) => (
                                <option key={c.symbol} value={c.symbol}>
                                    {c.icon} {c.name} ({c.symbol})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex-1 flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-foreground/50">Quantidade</label>
                        <input
                            type="number"
                            value={reverseFromAmount}
                            onChange={(e) => setReverseFromAmount(e.target.value)}
                            placeholder="0.00"
                            className="w-full rounded-xl bg-card-bg border border-card-border px-4 py-3 text-foreground focus:outline-none focus:border-primary"
                        />
                    </div>

                    <div className="text-4xl text-foreground/30">→</div>

                    <div className="flex-1 flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-foreground/50">Para</label>
                        <select
                            value={reverseToCrypto}
                            onChange={(e) => setReverseToCrypto(e.target.value)}
                            className="w-full rounded-xl bg-card-bg border border-card-border px-4 py-3 text-foreground focus:outline-none focus:border-primary"
                        >
                            {CRIPTOS.map((c) => (
                                <option key={c.symbol} value={c.symbol}>
                                    {c.icon} {c.name} ({c.symbol})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex-1 flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-foreground/50">Resultado</label>
                        <div className="w-full rounded-xl bg-primary/10 border border-primary/20 px-4 py-3 text-foreground font-bold text-lg">
                            {reverseToAmount || "0.00"}
                        </div>
                    </div>
                </div>

                {reverseFromAmount && reverseToAmount && (
                    <p className="mt-4 text-sm text-foreground/60">
                        {parseFloat(reverseFromAmount).toLocaleString()} {CRIPTOS.find(c => c.symbol === reverseFromCrypto)?.name} = {reverseToAmount} {reverseToCrypto}
                    </p>
                )}
            </section>
        </div>
    );
}
