export interface CurrencyConfig {
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

export interface AwesomeApiResponse {
    USDBRL?: CurrencyConfig;
    EURBRL?: CurrencyConfig;
    GBPBRL?: CurrencyConfig;
    [key: string]: CurrencyConfig | undefined;
}

export interface AppCurrencyData {
    id: string; // ex: "USD"
    name: string; // ex: "Dólar Comercial"
    symbol: string; // ex: "USD/BRL"
    bid: number; // valor de compra
    pctChange: number; // variação percentual
    varBid: number; // variação absoluta
    createDate: string; // data de atualização
    isStale?: boolean; // indica se falhou e retornou cache antigo
}

export interface HistoricalDataPoint {
    date: string;        // "YYYY-MM-DD"
    bid: number;         // valor BRL naquele dia
    pctChange: number;   // variação em relação ao dia anterior
    varBid: number;      // variação absoluta em relação ao dia anterior
}

/** Formata uma data como string YYYY-MM-DD */
function dateToString(date: Date): string {
    return date.toISOString().slice(0, 10);
}

/** Subtrai N dias de uma data */
function subtractDays(date: Date, days: number): Date {
    const d = new Date(date);
    d.setUTCDate(d.getUTCDate() - days);
    return d;
}

/** Busca cotação BRL de uma moeda numa data específica (YYYY-MM-DD).
 *  Usa o CDN do fawazahmed0 para datas históricas. */
async function fetchBrlRate(base: string, dateStr: string): Promise<number | null> {
    const url = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${dateStr}/v1/currencies/${base}.json`;
    try {
        const res = await fetch(url, { next: { revalidate: 86400 } }); // cache por 24h (dado histórico fixo)
        if (!res.ok) return null;
        const data = await res.json();
        const rate = data[base]?.brl;
        return typeof rate === 'number' ? rate : null;
    } catch {
        return null;
    }
}

/**
 * Busca as cotações de múltiplas moedas na fawazahmed0 API simultaneamente via Server Component.
 * Calcula a variação percentual real comparando com o fechamento do dia anterior.
 * Tempo de revalidação: 600 segundos (10 minutos).
 */
export async function getCurrencies(): Promise<Record<string, AppCurrencyData | null>> {
    try {
        const [usdRes, eurRes, gbpRes] = await Promise.all([
            fetch('https://latest.currency-api.pages.dev/v1/currencies/usd.json', { next: { revalidate: 600 } }),
            fetch('https://latest.currency-api.pages.dev/v1/currencies/eur.json', { next: { revalidate: 600 } }),
            fetch('https://latest.currency-api.pages.dev/v1/currencies/gbp.json', { next: { revalidate: 600 } })
        ]);

        if (!usdRes.ok || !eurRes.ok || !gbpRes.ok) {
            throw new Error(`Currency API HTTP error!`);
        }

        const [usdData, eurData, gbpData] = await Promise.all([
            usdRes.json(),
            eurRes.json(),
            gbpRes.json(),
        ]);

        // Data de hoje e ontem (para calcular variação real)
        const today = new Date();
        const todayStr = dateToString(today);
        const yesterdayStr = dateToString(subtractDays(today, 1));

        // Busca ontem em paralelo para os três pares
        const [usdYest, eurYest, gbpYest] = await Promise.all([
            fetchBrlRate('usd', yesterdayStr),
            fetchBrlRate('eur', yesterdayStr),
            fetchBrlRate('gbp', yesterdayStr),
        ]);

        const now = usdData.date || todayStr;

        const formatData = (
            baseCode: string,
            brlToday: number,
            brlYesterday: number | null,
            name: string
        ): AppCurrencyData => {
            let pctChange = 0;
            let varBid = 0;

            if (brlYesterday && brlYesterday > 0) {
                varBid = brlToday - brlYesterday;
                pctChange = (varBid / brlYesterday) * 100;
            }

            return {
                id: baseCode,
                name,
                symbol: `${baseCode}/BRL`,
                bid: brlToday,
                pctChange: parseFloat(pctChange.toFixed(4)),
                varBid: parseFloat(varBid.toFixed(4)),
                createDate: now,
            };
        };

        return {
            USD: formatData("USD", usdData.usd.brl, usdYest, "Dólar Comercial"),
            EUR: formatData("EUR", eurData.eur.brl, eurYest, "Euro"),
            GBP: formatData("GBP", gbpData.gbp.brl, gbpYest, "Libra Esterlina"),
        };
    } catch (error) {
        console.error("Falha ao buscar dados na Currency API:", error);

        return {
            USD: null,
            EUR: null,
            GBP: null,
        };
    }
}

/**
 * Busca o histórico de cotação BRL dos últimos `days` dias para uma moeda.
 * Retorna os pontos do mais antigo ao mais recente, com variação calculada entre dias consecutivos.
 */
export async function getCurrencyHistory(
    base: string,
    days: number = 5
): Promise<HistoricalDataPoint[]> {
    const today = new Date();

    // Gera as datas: hoje + `days` dias anteriores (para ter `days` variações)
    const dates: string[] = [];
    for (let i = days; i >= 0; i--) {
        dates.push(dateToString(subtractDays(today, i)));
    }

    // Busca todas as datas em paralelo
    const rates = await Promise.all(
        dates.map(async (dateStr) => {
            // Hoje usa o endpoint "latest" para maior frescor; passado usa CDN fixo
            if (dateStr === dateToString(today)) {
                const url = `https://latest.currency-api.pages.dev/v1/currencies/${base}.json`;
                try {
                    const res = await fetch(url, { next: { revalidate: 600 } });
                    if (!res.ok) return { date: dateStr, bid: null };
                    const data = await res.json();
                    const bid = data[base]?.brl;
                    return { date: dateStr, bid: typeof bid === 'number' ? bid : null };
                } catch {
                    return { date: dateStr, bid: null };
                }
            } else {
                const bid = await fetchBrlRate(base, dateStr);
                return { date: dateStr, bid };
            }
        })
    );

    // Converte para HistoricalDataPoint (calcula variação entre dias consecutivos)
    const points: HistoricalDataPoint[] = [];

    for (let i = 1; i < rates.length; i++) {
        const prev = rates[i - 1];
        const curr = rates[i];

        if (curr.bid === null) continue;

        let pctChange = 0;
        let varBid = 0;

        if (prev.bid !== null && prev.bid > 0) {
            varBid = curr.bid - prev.bid;
            pctChange = (varBid / prev.bid) * 100;
        }

        points.push({
            date: curr.date,
            bid: curr.bid,
            pctChange: parseFloat(pctChange.toFixed(4)),
            varBid: parseFloat(varBid.toFixed(4)),
        });
    }

    return points;
}
