import { EventEmitter } from 'events';
import { currencyMap, supportedCurrencyCodes } from './currencies';
import type { CurrencyCode } from './currencies';
import type { AppCurrencyData } from './api';

const POLL_MS = 30_000;

interface RawQuote {
    code: string;
    codein: string;
    name: string;
    high: string;
    low: string;
    varBid: string;
    pctChange: string;
    bid: string;
    ask: string;
    timestamp: string;
    create_date: string;
}

function parseNum(v: string | number | undefined): number {
    const n = typeof v === 'number' ? v : Number.parseFloat(v ?? '0');
    return Number.isFinite(n) ? n : 0;
}

class QuoteCache extends EventEmitter {
    private snapshot: Record<string, AppCurrencyData> = {};
    private started = false;

    start(): void {
        if (this.started) return;
        this.started = true;
        this.poll();
        // .unref() permite que o processo encerre normalmente sem travar no timer
        setInterval(() => this.poll(), POLL_MS).unref();
    }

    get(): Record<string, AppCurrencyData> {
        return this.snapshot;
    }

    private async poll(): Promise<void> {
        try {
            const pairs = supportedCurrencyCodes
                .filter(c => c !== 'BRL')
                .map(c => currencyMap[c as CurrencyCode].pair)
                .filter(Boolean)
                .join(',');

            const headers: Record<string, string> = {};
            if (process.env.AWESOMEAPI_KEY) {
                headers['x-api-key'] = process.env.AWESOMEAPI_KEY;
            }

            const res = await fetch(
                `https://economia.awesomeapi.com.br/json/last/${pairs}`,
                { headers, signal: AbortSignal.timeout(10_000) },
            );

            if (!res.ok) return;

            const raw: Record<string, RawQuote> = await res.json();

            let changed = false;
            const next = { ...this.snapshot };

            for (const code of supportedCurrencyCodes) {
                if (code === 'BRL') continue;
                const def = currencyMap[code as CurrencyCode];
                if (!def.pair) continue;

                const key = def.pair.replace('-', '').toUpperCase();
                const q = raw[key];
                if (!q) continue;

                const newBid = parseNum(q.bid);
                if (newBid !== this.snapshot[code]?.bid) {
                    next[code] = {
                        id: code,
                        name: def.name,
                        symbol: def.symbol,
                        bid: newBid,
                        ask: parseNum(q.ask),
                        high: parseNum(q.high),
                        low: parseNum(q.low),
                        pctChange: parseNum(q.pctChange),
                        varBid: parseNum(q.varBid),
                        createDate: q.create_date,
                        flag: def.flag,
                        route: def.route,
                    };
                    changed = true;
                }
            }

            if (changed) {
                this.snapshot = next;
                this.emit('update', this.snapshot);
            }
        } catch {
            // erro de rede — mantém snapshot anterior válido
        }
    }
}

// Singleton a nível de módulo — seguro em Docker (processo Node.js persistente único)
export const quoteCache = new QuoteCache();
