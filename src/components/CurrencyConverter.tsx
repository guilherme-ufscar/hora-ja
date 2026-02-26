"use client";

import { useState, useEffect } from "react";
import type { AppCurrencyData } from "@/lib/api";
import { formatCurrency, formatLastUpdate } from "@/lib/formatters";

interface ConverterProps {
    initialCurrencies: Record<string, AppCurrencyData | null>;
}

export default function CurrencyConverter({ initialCurrencies }: ConverterProps) {
    // Configuração inicial de quais moedas estão selecionadas
    const [currencyA, setCurrencyA] = useState("USD");
    const [currencyB, setCurrencyB] = useState("BRL");

    // Valores dos inputs (string para permitir digitação livre como '10.5')
    const [valueA, setValueA] = useState("1.00");
    const [valueB, setValueB] = useState("");

    // Array simplificado para os selects
    const availableCurrencies = [
        { code: "BRL", name: "Real Brasileiro", bid: 1 }, // Real é a nossa base (1:1)
        { code: "USD", name: "Dólar Comercial", bid: initialCurrencies.USD?.bid || 5.0 },
        { code: "EUR", name: "Euro", bid: initialCurrencies.EUR?.bid || 5.5 },
        { code: "GBP", name: "Libra Esterlina", bid: initialCurrencies.GBP?.bid || 6.5 },
    ];

    // Função core de conversão (A -> BRL -> B)
    const calculateConversion = (amountStr: string, fromCode: string, toCode: string) => {
        const amount = parseFloat(amountStr) || 0;

        // Obter cotação da moeda de origem em BRL
        const fromCurrency = availableCurrencies.find(c => c.code === fromCode);
        const fromBid = fromCurrency ? fromCurrency.bid : 1;

        // Obter cotação da moeda de destino em BRL
        const toCurrency = availableCurrencies.find(c => c.code === toCode);
        const toBid = toCurrency ? toCurrency.bid : 1;

        // Valor total em reais (Ex: 100 USD = 500 BRL)
        const valueInBrl = amount * fromBid;

        // Quantas unidades da moeda de destino podemos comprar com esse valor em BRL?
        const result = valueInBrl / toBid;

        return result.toFixed(2);
    };

    // Efeito responsivo: recalcular sempre que a moeda A ou B mudar,
    // mantendo o Input A fixo como fonte da verdade nesse cenário.
    useEffect(() => {
        const newValB = calculateConversion(valueA, currencyA, currencyB);
        setValueB(newValB);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currencyA, currencyB]);

    // Handlers para os inputs (Bidirecionalidade)
    const handleInputAChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setValueA(val);
        if (val === "" || val === ".") {
            setValueB("");
            return;
        }
        setValueB(calculateConversion(val, currencyA, currencyB));
    };

    const handleInputBChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setValueB(val);
        if (val === "" || val === ".") {
            setValueA("");
            return;
        }
        // Conversão inversa (B -> A)
        setValueA(calculateConversion(val, currencyB, currencyA));
    };

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
            <div className="glass-panel p-6 sm:p-10 w-full relative overflow-hidden rounded-[2.5rem] shadow-xl shadow-emerald-900/5">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-blue-500/5"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">

                    {/* Lado A */}
                    <div className="flex-1 w-full bg-background/50 rounded-3xl p-6 border border-card-border shadow-inner">
                        <label className="block text-sm font-semibold text-foreground/60 mb-2 uppercase tracking-wide">De</label>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <input
                                type="number"
                                value={valueA}
                                onChange={handleInputAChange}
                                placeholder="0.00"
                                className="w-full sm:w-2/3 bg-transparent text-4xl sm:text-5xl font-black text-foreground outline-none tabular-nums placeholder:text-foreground/20"
                            />
                            <div className="relative w-full sm:w-1/3">
                                <select
                                    value={currencyA}
                                    onChange={(e) => setCurrencyA(e.target.value)}
                                    className="w-full h-full min-h-[64px] bg-foreground/5 border-none rounded-xl text-lg font-bold text-foreground py-3 pl-4 pr-12 focus:ring-2 focus:ring-primary outline-none cursor-pointer appearance-none"
                                >
                                    {availableCurrencies.map(c => (
                                        <option key={c.code} value={c.code} className="bg-[#0f172a] text-white">
                                            {c.code} - {c.name}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-foreground/50">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m7 15 5 5 5-5" /><path d="m7 9 5-5 5 5" /></svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Ícone Central Bidirecional */}
                    <div className="shrink-0 flex items-center justify-center -my-2 md:-mx-4 z-20">
                        <div className="bg-primary text-white p-4 rounded-full shadow-lg shadow-primary/30 flex items-center justify-center transform hover:rotate-180 transition-transform duration-500 cursor-pointer"
                            onClick={() => {
                                // Swap moedas logicamente
                                setCurrencyA(currencyB);
                                setCurrencyB(currencyA);
                                setValueA(valueB);
                                setValueB(valueA);
                            }}
                            title="Inverter Moedas"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 3 21 3 21 8" /><line x1="4" y1="21" x2="21" y2="3" /><polyline points="21 16 21 21 16 21" /><line x1="15" y1="15" x2="21" y2="21" /><line x1="4" y1="4" x2="9" y2="9" /></svg>
                        </div>
                    </div>

                    {/* Lado B */}
                    <div className="flex-1 w-full bg-background/50 rounded-3xl p-6 border border-card-border shadow-inner">
                        <label className="block text-sm font-semibold text-foreground/60 mb-2 uppercase tracking-wide">Para</label>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <input
                                type="number"
                                value={valueB}
                                onChange={handleInputBChange}
                                placeholder="0.00"
                                className="w-full sm:w-2/3 bg-transparent text-4xl sm:text-5xl font-black text-primary outline-none tabular-nums placeholder:text-primary/20"
                            />
                            <div className="relative w-full sm:w-1/3">
                                <select
                                    value={currencyB}
                                    onChange={(e) => setCurrencyB(e.target.value)}
                                    className="w-full h-full min-h-[64px] bg-foreground/5 border-none rounded-xl text-lg font-bold text-foreground py-3 pl-4 pr-12 focus:ring-2 focus:ring-primary outline-none cursor-pointer appearance-none"
                                >
                                    {availableCurrencies.map(c => (
                                        <option key={c.code} value={c.code} className="bg-[#0f172a] text-white">
                                            {c.code} - {c.name}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-foreground/50">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m7 15 5 5 5-5" /><path d="m7 9 5-5 5 5" /></svg>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Footer contextual do conversor */}
                {(currencyA !== 'BRL' || currencyB !== 'BRL') && (
                    <div className="mt-8 pt-6 border-t border-card-border/30 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-sm text-foreground/50 text-center font-medium">
                        <span>Cotação usada (comercial): <span className="text-foreground/80 font-bold">{
                            currencyA !== 'BRL'
                                ? formatCurrency(availableCurrencies.find(c => c.code === currencyA)?.bid || 1)
                                : formatCurrency(availableCurrencies.find(c => c.code === currencyB)?.bid || 1)
                        }</span></span>
                        <span className="hidden sm:inline opacity-30">•</span>
                        <span>Última atualização: <span className="text-foreground/80">{
                            formatLastUpdate(
                                currencyA !== 'BRL'
                                    ? initialCurrencies[currencyA]?.createDate || ""
                                    : initialCurrencies[currencyB]?.createDate || ""
                            )
                        }</span></span>
                    </div>
                )}
            </div>
        </div>
    );
}
