export type CurrencyCode = "BRL" | "USD" | "EUR" | "GBP" | "ARS" | "CAD" | "CHF" | "JPY" | "CNY";

export interface CurrencyDefinition {
    code: CurrencyCode;
    pair: string | null;
    name: string;
    shortName: string;
    symbol: string;
    route: string;
    flag: string;
    priority: "high" | "medium";
    heroAccent: string;
    heroGlow: string;
    introTitle: string;
    introParagraphs: string[];
}

export const currencyDefinitions: CurrencyDefinition[] = [
    {
        code: "BRL",
        pair: null,
        name: "Real Brasileiro",
        shortName: "Real",
        symbol: "BRL/BRL",
        route: "/",
        flag: "🇧🇷",
        priority: "high",
        heroAccent: "text-primary",
        heroGlow: "from-emerald-500/5",
        introTitle: "O Real como base de comparação",
        introParagraphs: [
            "O Real Brasileiro é a moeda de referência usada em todas as conversões do HoraJá Cambio, funcionando como base para comparar o custo das principais moedas internacionais.",
            "Ao acompanhar uma cotação frente ao BRL, você entende rapidamente quanto aquela moeda impacta turismo, compras internacionais, remessas e investimentos no exterior.",
        ],
    },
    {
        code: "USD",
        pair: "USD-BRL",
        name: "Dólar Comercial",
        shortName: "Dólar",
        symbol: "USD/BRL",
        route: "/dolar",
        flag: "🇺🇸",
        priority: "high",
        heroAccent: "text-primary",
        heroGlow: "from-emerald-500/5",
        introTitle: "Entendendo o Dólar Comercial",
        introParagraphs: [
            "O dólar comercial é a cotação oficial usada no mercado financeiro brasileiro para importação, exportação e transações entre empresas e instituições. Ele serve como referência mais pura de mercado do que o dólar turismo.",
            "Oscilações do dólar afetam preços, inflação, custo de viagens e decisões de investimento. Por isso, acompanhar a cotação em tempo real ajuda tanto no planejamento financeiro quanto na leitura do cenário econômico.",
        ],
    },
    {
        code: "EUR",
        pair: "EUR-BRL",
        name: "Euro",
        shortName: "Euro",
        symbol: "EUR/BRL",
        route: "/euro",
        flag: "🇪🇺",
        priority: "high",
        heroAccent: "text-indigo-500",
        heroGlow: "from-indigo-500/5",
        introTitle: "A força da moeda europeia",
        introParagraphs: [
            "O Euro é a moeda oficial de boa parte da União Europeia e uma das divisas mais importantes do planeta, com forte peso em reservas internacionais e comércio exterior.",
            "Para brasileiros, a variação do Euro influencia turismo, importações e custos de remessas para a Europa. Acompanhar o EUR/BRL ajuda a decidir melhor o momento de compra e envio.",
        ],
    },
    {
        code: "GBP",
        pair: "GBP-BRL",
        name: "Libra Esterlina",
        shortName: "Libra",
        symbol: "GBP/BRL",
        route: "/libra",
        flag: "🇬🇧",
        priority: "high",
        heroAccent: "text-purple-500",
        heroGlow: "from-purple-500/5",
        introTitle: "A libra no mercado global",
        introParagraphs: [
            "A Libra Esterlina é uma das moedas mais tradicionais e valorizadas do mercado internacional. Sua cotação costuma refletir a força econômica do Reino Unido e a busca por ativos considerados sólidos.",
            "Para quem viaja, estuda ou faz negócios com o Reino Unido, acompanhar a libra frente ao Real é essencial para estimar custos com mais precisão.",
        ],
    },
    {
        code: "ARS",
        pair: "ARS-BRL",
        name: "Peso Argentino",
        shortName: "Peso Argentino",
        symbol: "ARS/BRL",
        route: "/peso-argentino",
        flag: "🇦🇷",
        priority: "high",
        heroAccent: "text-sky-500",
        heroGlow: "from-sky-500/5",
        introTitle: "O peso argentino e o turismo regional",
        introParagraphs: [
            "O Peso Argentino é uma moeda muito acompanhada por brasileiros por causa do turismo e do comércio regional. Sua volatilidade pode alterar bastante o custo de viagens para o país vizinho.",
            "Monitorar o ARS/BRL ajuda a entender quando o câmbio está mais favorável para gastos em hospedagem, alimentação e compras na Argentina.",
        ],
    },
    {
        code: "CAD",
        pair: "CAD-BRL",
        name: "Dólar Canadense",
        shortName: "Dólar Canadense",
        symbol: "CAD/BRL",
        route: "/dolar-canadense",
        flag: "🇨🇦",
        priority: "high",
        heroAccent: "text-rose-500",
        heroGlow: "from-rose-500/5",
        introTitle: "Câmbio para Canadá com mais contexto",
        introParagraphs: [
            "O Dólar Canadense é relevante para intercâmbio, turismo e planejamento de imigração. Sua cotação costuma responder a fatores como juros, commodities e atividade econômica no Canadá.",
            "Acompanhar o CAD/BRL ajuda a calcular melhor custos acadêmicos, viagens e remessas para quem tem planos ligados ao país.",
        ],
    },
    {
        code: "CHF",
        pair: "CHF-BRL",
        name: "Franco Suíço",
        shortName: "Franco Suíço",
        symbol: "CHF/BRL",
        route: "/franco-suico",
        flag: "🇨🇭",
        priority: "medium",
        heroAccent: "text-red-500",
        heroGlow: "from-red-500/5",
        introTitle: "A moeda de refúgio da Suíça",
        introParagraphs: [
            "O Franco Suíço é conhecido globalmente como uma moeda defensiva, frequentemente associada a estabilidade econômica e proteção em momentos de incerteza.",
            "Por isso, o CHF/BRL é acompanhado por investidores e por quem precisa enviar recursos para a Suíça ou custear despesas no país.",
        ],
    },
    {
        code: "JPY",
        pair: "JPY-BRL",
        name: "Iene Japonês",
        shortName: "Iene",
        symbol: "JPY/BRL",
        route: "/iene",
        flag: "🇯🇵",
        priority: "medium",
        heroAccent: "text-amber-500",
        heroGlow: "from-amber-500/5",
        introTitle: "O iene e a economia japonesa",
        introParagraphs: [
            "O Iene Japonês é uma das moedas mais negociadas do mundo e tem peso importante em comércio exterior, tecnologia e mercados financeiros globais.",
            "Acompanhar o JPY/BRL ajuda a estimar custos de viagens ao Japão, compras internacionais e variações cambiais ligadas ao mercado asiático.",
        ],
    },
    {
        code: "CNY",
        pair: "CNY-BRL",
        name: "Yuan Chinês",
        shortName: "Yuan",
        symbol: "CNY/BRL",
        route: "/yuan",
        flag: "🇨🇳",
        priority: "medium",
        heroAccent: "text-orange-500",
        heroGlow: "from-orange-500/5",
        introTitle: "O yuan no comércio global",
        introParagraphs: [
            "O Yuan Chinês ganhou relevância internacional com o crescimento econômico da China e o aumento do peso do país nas cadeias globais de produção.",
            "Para importadores, viajantes e empresas que negociam com a Ásia, acompanhar o CNY/BRL ajuda a planejar melhor preços e remessas.",
        ],
    },
];

export const supportedCurrencyCodes = currencyDefinitions.map((currency) => currency.code);

export const featuredCurrencyCodes: CurrencyCode[] = ["USD", "EUR", "GBP"];

export const currencyMap = Object.fromEntries(
    currencyDefinitions.map((currency) => [currency.code, currency]),
) as Record<CurrencyCode, CurrencyDefinition>;

export function getCurrencyDefinition(code: string): CurrencyDefinition | undefined {
    return currencyDefinitions.find((currency) => currency.code === code.toUpperCase());
}

export function getCurrencyByRoute(route: string): CurrencyDefinition | undefined {
    return currencyDefinitions.find((currency) => currency.route === route);
}

export const currencyPairs = currencyDefinitions
    .filter((currency) => currency.pair)
    .map((currency) => currency.pair as string);
