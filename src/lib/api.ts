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

/**
 * Busca as cotações de múltiplas moedas na AwesomeAPI simultaneamente via Server Component.
 * Utiliza o Incremental Static Regeneration (ISR) natural do Next.js via fetch.
 * Tempo de revalidação: 600 segundos (10 minutos).
 */
export async function getCurrencies(): Promise<Record<string, AppCurrencyData | null>> {
    try {
        // Usar a API fawazahmed0/exchange-api (gratuita, sem rate limits agressivos via Cloudflare)
        // Busca os valores do Dólar (usd), Euro (eur) e Libra (gbp) em relação a todas as moedas
        const [usdRes, eurRes, gbpRes] = await Promise.all([
            fetch('https://latest.currency-api.pages.dev/v1/currencies/usd.json', { next: { revalidate: 600 } }),
            fetch('https://latest.currency-api.pages.dev/v1/currencies/eur.json', { next: { revalidate: 600 } }),
            fetch('https://latest.currency-api.pages.dev/v1/currencies/gbp.json', { next: { revalidate: 600 } })
        ]);

        if (!usdRes.ok || !eurRes.ok || !gbpRes.ok) {
            throw new Error(`Currency API HTTP error!`);
        }

        const usdData = await usdRes.json();
        const eurData = await eurRes.json();
        const gbpData = await gbpRes.json();

        // Data atual como timestamp base
        const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

        const formatData = (baseCode: string, brlValue: number, name: string): AppCurrencyData => {
            return {
                id: baseCode,
                name: name,
                symbol: `${baseCode}/BRL`,
                bid: brlValue,
                // A Free Currency API simplificada não fornece variação diária nativamente em um único request (só current bid).
                // Definindo como 0 para manter o card limpo visualmente sem quebrar o formato.
                pctChange: 0,
                varBid: 0,
                createDate: usdData.date || now,
            };
        };

        return {
            USD: formatData("USD", usdData.usd.brl, "Dólar Comercial"),
            EUR: formatData("EUR", eurData.eur.brl, "Euro"),
            GBP: formatData("GBP", gbpData.gbp.brl, "Libra Esterlina"),
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
