import {
    currencyMap,
    supportedCurrencyCodes,
    type CurrencyCode,
} from "@/lib/currencies";

interface AwesomeApiQuote {
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

export interface AppCurrencyData {
    id: string;
    name: string;
    symbol: string;
    bid: number;
    ask: number;
    high: number;
    low: number;
    pctChange: number;
    varBid: number;
    createDate: string;
    flag: string;
    route: string;
    isStale?: boolean;
}

export interface HistoricalDataPoint {
    date: string;
    bid: number;
    ask: number;
    high: number;
    low: number;
    pctChange: number;
    varBid: number;
    createDate: string;
}

export interface RecentQuotePoint {
    bid: number;
    ask: number;
    high: number;
    low: number;
    pctChange: number;
    varBid: number;
    createDate: string;
    timestamp: string;
}

export interface GlobalMarketSnapshot {
    symbol: string;
    name: string;
    price: number;
    changePercent: number;
    marketState: "open" | "closed";
}

const AWESOME_API_BASE_URL = "https://economia.awesomeapi.com.br";
const FALLBACK_LATEST_BASE_URL = "https://latest.currency-api.pages.dev/v1/currencies";
const FALLBACK_HISTORICAL_BASE_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api";
const ALPHA_VANTAGE_BASE_URL = "https://www.alphavantage.co/query";
const TEN_MINUTES = 600;
const ONE_DAY = 86400;
const AWESOME_API_KEY = process.env.AWESOMEAPI_KEY;
const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY;

const EMERGENCY_RATES: Record<CurrencyCode, number> = {
    BRL: 1,
    USD: 5.65,
    EUR: 6.15,
    GBP: 7.25,
    ARS: 0.0054,
    CAD: 4.12,
    CHF: 6.55,
    JPY: 0.039,
    CNY: 0.78,
};

function parseNumber(value: string | number | undefined): number {
    const parsed = typeof value === "number" ? value : Number.parseFloat(value ?? "0");
    return Number.isFinite(parsed) ? parsed : 0;
}

function withApiKey(init?: RequestInit): RequestInit {
    if (!AWESOME_API_KEY) {
        return init ?? {};
    }

    return {
        ...init,
        headers: {
            ...(init?.headers ?? {}),
            "x-api-key": AWESOME_API_KEY,
        },
    };
}

function getCurrencyKeyFromPair(pair: string): string {
    return pair.replace("-", "").toUpperCase();
}

function toIsoDate(value: string): string {
    if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
        return value.slice(0, 10);
    }

    return new Date(value).toISOString().slice(0, 10);
}

function subtractDays(date: Date, days: number): Date {
    const copy = new Date(date);
    copy.setUTCDate(copy.getUTCDate() - days);
    return copy;
}

function dateToString(date: Date): string {
    return date.toISOString().slice(0, 10);
}

function normalizeQuote(code: CurrencyCode, quote: AwesomeApiQuote): AppCurrencyData {
    const definition = currencyMap[code];

    return {
        id: code,
        name: definition.name,
        symbol: definition.symbol,
        bid: parseNumber(quote.bid),
        ask: parseNumber(quote.ask),
        high: parseNumber(quote.high),
        low: parseNumber(quote.low),
        pctChange: parseNumber(quote.pctChange),
        varBid: parseNumber(quote.varBid),
        createDate: quote.create_date,
        flag: definition.flag,
        route: definition.route,
    };
}

function buildEmergencyCurrency(code: CurrencyCode): AppCurrencyData {
    const definition = currencyMap[code];
    const bid = EMERGENCY_RATES[code];

    return {
        id: code,
        name: definition.name,
        symbol: definition.symbol,
        bid,
        ask: bid,
        high: bid,
        low: bid,
        pctChange: 0,
        varBid: 0,
        createDate: new Date().toISOString(),
        flag: definition.flag,
        route: definition.route,
        isStale: true,
    };
}

function normalizeHistoryPoint(quote: AwesomeApiQuote): HistoricalDataPoint {
    return {
        date: toIsoDate(quote.create_date),
        bid: parseNumber(quote.bid),
        ask: parseNumber(quote.ask),
        high: parseNumber(quote.high),
        low: parseNumber(quote.low),
        pctChange: parseNumber(quote.pctChange),
        varBid: parseNumber(quote.varBid),
        createDate: quote.create_date,
    };
}

function normalizeRecentPoint(quote: AwesomeApiQuote): RecentQuotePoint {
    return {
        bid: parseNumber(quote.bid),
        ask: parseNumber(quote.ask),
        high: parseNumber(quote.high),
        low: parseNumber(quote.low),
        pctChange: parseNumber(quote.pctChange),
        varBid: parseNumber(quote.varBid),
        createDate: quote.create_date,
        timestamp: quote.timestamp,
    };
}

async function fetchJson<T>(url: string, revalidate: number, includeAwesomeApiKey = true): Promise<T> {
    const requestInit = {
        next: { revalidate },
    } satisfies RequestInit;

    const response = await fetch(
        url,
        includeAwesomeApiKey ? withApiKey(requestInit) : requestInit,
    );

    if (!response.ok) {
        throw new Error(`AwesomeAPI request failed: ${response.status}`);
    }

    return response.json() as Promise<T>;
}

async function fetchFallbackLatestRate(code: CurrencyCode): Promise<number | null> {
    if (code === "BRL") {
        return 1;
    }

    const base = code.toLowerCase();

    try {
        const data = await fetchJson<Record<string, Record<string, number>>>(
            `${FALLBACK_LATEST_BASE_URL}/${base}.json`,
            TEN_MINUTES,
            false,
        );
        const rate = data[base]?.brl;
        return typeof rate === "number" ? rate : null;
    } catch {
        return null;
    }
}

async function fetchFallbackHistoricalRate(code: CurrencyCode, date: string): Promise<number | null> {
    if (code === "BRL") {
        return 1;
    }

    const base = code.toLowerCase();

    try {
        const data = await fetchJson<Record<string, Record<string, number>>>(
            `${FALLBACK_HISTORICAL_BASE_URL}@${date}/v1/currencies/${base}.json`,
            ONE_DAY,
            false,
        );
        const rate = data[base]?.brl;
        return typeof rate === "number" ? rate : null;
    } catch {
        return null;
    }
}

async function buildFallbackCurrency(code: CurrencyCode): Promise<AppCurrencyData | null> {
    const definition = currencyMap[code];

    if (code === "BRL") {
        return {
            id: "BRL",
            name: definition.name,
            symbol: definition.symbol,
            bid: 1,
            ask: 1,
            high: 1,
            low: 1,
            pctChange: 0,
            varBid: 0,
            createDate: new Date().toISOString(),
            flag: definition.flag,
            route: definition.route,
            isStale: true,
        };
    }

    const today = new Date();
    const yesterday = dateToString(subtractDays(today, 1));
    const [bid, previousBid] = await Promise.all([
        fetchFallbackLatestRate(code),
        fetchFallbackHistoricalRate(code, yesterday),
    ]);

    if (bid === null) {
        return buildEmergencyCurrency(code);
    }

    const varBid = previousBid !== null ? bid - previousBid : 0;
    const pctChange = previousBid && previousBid > 0 ? (varBid / previousBid) * 100 : 0;

    return {
        id: code,
        name: definition.name,
        symbol: definition.symbol,
        bid,
        ask: bid,
        high: bid,
        low: bid,
        pctChange,
        varBid,
        createDate: new Date().toISOString(),
        flag: definition.flag,
        route: definition.route,
        isStale: true,
    };
}

export async function getCurrencies(): Promise<Record<string, AppCurrencyData | null>> {
    const result = Object.fromEntries(
        supportedCurrencyCodes.map((code) => [code, code === "BRL"
            ? {
                id: "BRL",
                name: currencyMap.BRL.name,
                symbol: currencyMap.BRL.symbol,
                bid: 1,
                ask: 1,
                high: 1,
                low: 1,
                pctChange: 0,
                varBid: 0,
                createDate: new Date().toISOString(),
                flag: currencyMap.BRL.flag,
                route: currencyMap.BRL.route,
                isStale: true,
            }
            : null]),
    ) as Record<string, AppCurrencyData | null>;

    const pairs = supportedCurrencyCodes
        .filter((code) => code !== "BRL")
        .map((code) => currencyMap[code].pair)
        .join(",");

    try {
        const data = await fetchJson<Record<string, AwesomeApiQuote>>(
            `${AWESOME_API_BASE_URL}/json/last/${pairs}`,
            TEN_MINUTES,
        );

        for (const code of supportedCurrencyCodes) {
            if (code === "BRL") {
                continue;
            }

            const pair = currencyMap[code].pair;
            if (!pair) {
                continue;
            }

            const quote = data[getCurrencyKeyFromPair(pair)];
            result[code] = quote ? normalizeQuote(code, quote) : null;
        }

        return result;
    } catch (error) {
        console.error("Falha ao buscar dados na AwesomeAPI:", error);

        const fallbackEntries = await Promise.all(
            supportedCurrencyCodes.map(async (code) => [code, await buildFallbackCurrency(code)] as const),
        );

        const fallbackResult = Object.fromEntries(fallbackEntries) as Record<string, AppCurrencyData | null>;

        for (const code of supportedCurrencyCodes) {
            if (!fallbackResult[code]) {
                fallbackResult[code] = buildEmergencyCurrency(code);
            }
        }

        return fallbackResult;
    }
}

export async function getCurrencyHistory(base: string, days = 5): Promise<HistoricalDataPoint[]> {
    const code = base.toUpperCase() as CurrencyCode;
    const pair = currencyMap[code]?.pair;

    if (!pair) {
        return [];
    }

    try {
        const data = await fetchJson<AwesomeApiQuote[]>(
            `${AWESOME_API_BASE_URL}/json/daily/${pair}/${Math.min(days, 360)}`,
            TEN_MINUTES,
        );

        return [...data].reverse().map(normalizeHistoryPoint);
    } catch (error) {
        console.error(`Falha ao buscar histórico de ${pair}:`, error);

        const today = new Date();
        const points = await Promise.all(
            Array.from({ length: days }, async (_, index) => {
                const date = dateToString(subtractDays(today, days - 1 - index));
                const bid = await fetchFallbackHistoricalRate(code, date);

                if (bid === null) {
                    return null;
                }

                return {
                    date,
                    bid,
                    ask: bid,
                    high: bid,
                    low: bid,
                    pctChange: 0,
                    varBid: 0,
                    createDate: `${date} 00:00:00`,
                } satisfies HistoricalDataPoint;
            }),
        );

        const filtered = points.filter((point): point is HistoricalDataPoint => point !== null);

        if (filtered.length > 0) {
            return filtered;
        }

        const bid = EMERGENCY_RATES[code];
        return Array.from({ length: days }, (_, index) => {
            const date = dateToString(subtractDays(today, days - 1 - index));
            return {
                date,
                bid,
                ask: bid,
                high: bid,
                low: bid,
                pctChange: 0,
                varBid: 0,
                createDate: `${date} 00:00:00`,
            } satisfies HistoricalDataPoint;
        });
    }
}

export async function getRecentQuotes(base: string, count = 5): Promise<RecentQuotePoint[]> {
    const code = base.toUpperCase() as CurrencyCode;
    const pair = currencyMap[code]?.pair;

    if (!pair) {
        return [];
    }

    try {
        const data = await fetchJson<AwesomeApiQuote[]>(
            `${AWESOME_API_BASE_URL}/${pair}/${Math.min(count, 100)}`,
            TEN_MINUTES,
        );

        return [...data].reverse().map(normalizeRecentPoint);
    } catch (error) {
        console.error(`Falha ao buscar cotações recentes de ${pair}:`, error);

        const fallback = await buildFallbackCurrency(code);
        const safeFallback = fallback ?? buildEmergencyCurrency(code);

        return Array.from({ length: count }, (_, index) => ({
            bid: safeFallback.bid,
            ask: safeFallback.ask,
            high: safeFallback.high,
            low: safeFallback.low,
            pctChange: safeFallback.pctChange,
            varBid: safeFallback.varBid,
            createDate: new Date(Date.now() - index * 60_000).toISOString(),
            timestamp: String(Math.floor((Date.now() - index * 60_000) / 1000)),
        })).reverse();
    }
}

export async function getFeaturedCurrencies() {
    const currencies = await getCurrencies();

    return {
        USD: currencies.USD,
        EUR: currencies.EUR,
        GBP: currencies.GBP,
    };
}

export async function getCurrencyByCode(code: CurrencyCode) {
    const currencies = await getCurrencies();
    return currencies[code] ?? null;
}

export async function getAvailableCurrencyPairs() {
    try {
        return fetchJson<Record<string, string>>(
            `${AWESOME_API_BASE_URL}/json/available/uniq`,
            ONE_DAY,
        );
    } catch (error) {
        console.error("Falha ao buscar pares disponíveis na AwesomeAPI:", error);
        return {};
    }
}

const globalMarketConfig = [
    { symbol: "^BVSP", name: "Ibovespa" },
    { symbol: "SPY", name: "S&P 500" },
    { symbol: "QQQ", name: "Nasdaq" },
    { symbol: "GLD", name: "Ouro" },
    { symbol: "BTCUSD", name: "Bitcoin" },
] as const;

function inferMarketState(): "open" | "closed" {
    const now = new Date();
    const saoPauloHour = Number(
        new Intl.DateTimeFormat("en-GB", {
            timeZone: "America/Sao_Paulo",
            hour: "2-digit",
            hour12: false,
        }).format(now),
    );

    return saoPauloHour >= 10 && saoPauloHour < 18 ? "open" : "closed";
}

export async function getGlobalMarketSnapshots(): Promise<GlobalMarketSnapshot[]> {
    if (!ALPHA_VANTAGE_API_KEY) {
        return [];
    }

    const marketState = inferMarketState();

    const snapshots: Array<GlobalMarketSnapshot | null> = await Promise.all(
        globalMarketConfig.map(async (market) => {
            try {
                const url = `${ALPHA_VANTAGE_BASE_URL}?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(market.symbol)}&apikey=${ALPHA_VANTAGE_API_KEY}`;
                const data = await fetchJson<{ "Global Quote"?: Record<string, string> }>(url, TEN_MINUTES, false);
                const quote = data["Global Quote"];

                if (!quote) {
                    return null;
                }

                return {
                    symbol: market.symbol,
                    name: market.name,
                    price: parseNumber(quote["05. price"]),
                    changePercent: parseNumber((quote["10. change percent"] ?? "0").replace("%", "")),
                    marketState,
                } satisfies GlobalMarketSnapshot;
            } catch {
                return null;
            }
        }),
    );

    return snapshots.filter((snapshot): snapshot is GlobalMarketSnapshot => snapshot !== null);
}
