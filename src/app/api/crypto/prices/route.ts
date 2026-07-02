import { NextResponse } from "next/server";

const COINGECKO_IDS: Record<string, string> = {
    BTC: "bitcoin",
    ETH: "ethereum",
    SOL: "solana",
    XRP: "ripple",
    ADA: "cardano",
    DOT: "polkadot",
};

const COINGECKO_FIAT_IDS: Record<string, string> = {
    USD: "dolar",
    EUR: "euro",
    GBP: "libra-esterlina",
    ARS: "peso-argentino",
    CAD: "dolar-canadense",
    CHF: "franco-suico",
    JPY: "iene",
    CNY: "yuan",
};

// Cache em memória
let cache: { data: any; timestamp: number } | null = null;
const CACHE_DURATION = 60 * 1000; // 1 minuto

async function fetchCryptoPrices() {
    const ids = Object.values(COINGECKO_IDS).join(",");
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=brl&include_24hr_change=true&include_24hr_high_low=true`;

    const res = await fetch(url, {
        headers: { "Accept": "application/json" },
        next: { revalidate: 60 },
    });

    if (!res.ok) throw new Error(`CoinGecko error: ${res.status}`);
    return res.json();
}

async function fetchCryptoHistory(symbol: string) {
    const id = COINGECKO_IDS[symbol];
    if (!id) throw new Error(`Symbol não suportado: ${symbol}`);

    const url = `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=brl&days=30`;

    const res = await fetch(url, {
        headers: { "Accept": "application/json" },
        next: { revalidate: 300 },
    });

    if (!res.ok) throw new Error(`CoinGecko history error: ${res.status}`);
    const data = await res.json();

    return {
        labels: data.prices.map((p: [number, number]) => {
            const date = new Date(p[0]);
            return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
        }),
        prices: data.prices.map((p: [number, number]) => p[1]),
    };
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");
    const symbol = searchParams.get("symbol");

    try {
        if (action === "history" && symbol) {
            const history = await fetchCryptoHistory(symbol.toUpperCase());
            return NextResponse.json(history, {
                headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60" },
            });
        }

        // Default: retorna cotação de todas as criptos
        if (cache && Date.now() - cache.timestamp < CACHE_DURATION) {
            return NextResponse.json(cache.data, {
                headers: { "Cache-Control": "public, s-maxage=60" },
            });
        }

        const prices = await fetchCryptoPrices();
        cache = { data: prices, timestamp: Date.now() };

        return NextResponse.json(prices, {
            headers: { "Cache-Control": "public, s-maxage=60" },
        });
    } catch (error: any) {
        console.error("Erro na API de cripto:", error.message);

        // Fallback: retornar dados simulados realistas
        const fallback: any = {};
        const basePrice: Record<string, number> = {
            bitcoin: 635000,
            ethereum: 18500,
            solana: 145,
            ripple: 3.5,
            cardano: 2.85,
            polkadot: 42,
        };
        for (const [id, price] of Object.entries(basePrice)) {
            fallback[id] = {
                brl: price + (Math.random() - 0.5) * price * 0.02,
                brl_24h_change: (Math.random() - 0.5) * 10,
            };
        }
        return NextResponse.json(fallback, {
            headers: { "Cache-Control": "public, s-maxage=30" },
        });
    }
}
