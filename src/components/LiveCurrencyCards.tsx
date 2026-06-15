'use client';

import { useEffect, useState } from 'react';
import CurrencyCard from './CurrencyCard';
import type { AppCurrencyData } from '@/lib/api';

interface Props {
    initialUSD: AppCurrencyData | null;
    initialEUR: AppCurrencyData | null;
    initialGBP: AppCurrencyData | null;
}

export default function LiveCurrencyCards({ initialUSD, initialEUR, initialGBP }: Props) {
    const [rates, setRates] = useState<Record<string, AppCurrencyData | null>>({
        USD: initialUSD,
        EUR: initialEUR,
        GBP: initialGBP,
    });

    useEffect(() => {
        const es = new EventSource('/api/quotes/stream');

        es.onmessage = (e: MessageEvent<string>) => {
            const data: Record<string, AppCurrencyData> = JSON.parse(e.data);
            setRates(prev => ({
                ...prev,
                ...(data.USD ? { USD: data.USD } : {}),
                ...(data.EUR ? { EUR: data.EUR } : {}),
                ...(data.GBP ? { GBP: data.GBP } : {}),
            }));
        };

        es.onerror = () => {
            // SSE reconnects automaticamente após falha de rede
        };

        return () => es.close();
    }, []);

    return (
        <>
            <CurrencyCard data={rates.USD} href="/dolar" />
            <CurrencyCard data={rates.EUR} href="/euro" />
            <CurrencyCard data={rates.GBP} href="/libra" />
        </>
    );
}
