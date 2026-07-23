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
            "Historicamente, o USD/BRL reage a decisões de juros do Federal Reserve e do Banco Central brasileiro, ao fluxo de capital estrangeiro na bolsa e ao resultado da balança comercial. Períodos de aperto monetário nos Estados Unidos costumam pressionar o real, enquanto ciclos de corte de juros por lá tendem a aliviar a cotação por aqui.",
            "No dia a dia, o valor que você vê no mercado à vista raramente é o valor final pago numa operação. Bancos e casas de câmbio aplicam spread sobre a cotação, e o IOF incide sobre compra de espécie, cartão internacional e remessas, cada modalidade com alíquota própria.",
            "Antes de comprar dólar para uma viagem ou remessa, vale comparar a taxa efetiva entre diferentes prestadores — não apenas o valor anunciado — e observar a tendência dos últimos dias no histórico desta página para evitar entrar num pico isolado de alta.",
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
            "Criado em 1999 como moeda contábil e colocado em circulação física em 2002, o euro unificou o câmbio de dezenas de países e hoje é administrado pelo Banco Central Europeu (BCE). Decisões de juros do BCE, dados de inflação da zona do euro e a saúde econômica de países como Alemanha e França costumam mover a cotação frente ao real.",
            "Quem planeja um roteiro pela Europa precisa lembrar que vários países fora da zona do euro — como Reino Unido, Suíça e países do Leste Europeu — usam moedas próprias, então vale conferir a cotação específica de cada destino antes de estimar o orçamento da viagem.",
            "Assim como no dólar, o valor final de uma compra de euro em espécie ou cartão internacional soma spread da instituição financeira e IOF. Simular esse custo total antes de fechar a operação evita surpresas na fatura ou no caixa da viagem.",
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
            "A libra é considerada a moeda em circulação contínua mais antiga do mundo, e o Reino Unido optou por não adotar o euro, mantendo política monetária própria conduzida pelo Bank of England. Decisões de juros britânicas, dados de inflação local e movimentos ligados ao Brexit ainda influenciam a percepção de risco sobre a moeda.",
            "Por ser historicamente uma das divisas mais caras frente ao real, pequenas variações percentuais na libra representam valores absolutos maiores em reais do que o mesmo movimento no dólar ou no euro — um detalhe importante para quem monta orçamento de intercâmbio ou mestrado no Reino Unido.",
            "Para quem tem despesas recorrentes em libras, como aluguel ou mensalidade de curso, uma estratégia comum é dividir a compra de moeda em parcelas ao longo do tempo, reduzindo o risco de travar todo o orçamento numa única cotação desfavorável. Acompanhar o histórico desta página ajuda a identificar períodos de maior ou menor pressão sobre a moeda.",
            "Como em qualquer operação de câmbio, o valor exibido aqui é a cotação de mercado; o custo final de uma remessa ou compra em libras soma spread bancário e, dependendo da operação, IOF. Comparar prestadores antes de fechar o câmbio costuma gerar economia relevante em valores altos.",
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
            "O peso argentino passou por diversos processos de forte desvalorização e controle cambial nas últimas décadas, o que o torna uma das moedas latino-americanas mais voláteis. Além da cotação oficial, o país já conviveu com câmbios paralelos, o que pode gerar diferenças relevantes entre o valor de referência e o praticado em alguns estabelecimentos locais.",
            "Por causa dessa volatilidade, o planejamento de uma viagem à Argentina costuma se beneficiar de acompanhamento mais frequente da cotação do que moedas mais estáveis, especialmente em períodos próximos à data da viagem.",
            "Muitos brasileiros que visitam a Argentina acabam usando reais, dólares ou cartões internacionais em vez de comprar pesos com antecedência, justamente pela rapidez com que a moeda local pode se desvalorizar. Ainda assim, entender a cotação de referência do ARS/BRL ajuda a avaliar se os preços praticados em lojas, restaurantes e casas de câmbio locais estão razoáveis.",
            "Ao converter valores para reais, leve em conta que cartões internacionais e casas de câmbio podem aplicar spread e IOF de forma diferente sobre o peso argentino. Comparar a taxa efetiva de cada opção — e não só a cotação anunciada — ajuda a evitar custos escondidos na hora de fechar o câmbio.",
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
            "O Canadá é um grande exportador de petróleo, madeira e minérios, e por isso o dólar canadense costuma acompanhar de perto o preço internacional de commodities — quando os preços sobem, a moeda tende a se fortalecer, e o contrário também tende a ocorrer. Decisões de juros do Bank of Canada e a proximidade econômica com os Estados Unidos completam o quadro de fatores que movem o CAD.",
            "Para quem planeja intercâmbio, mestrado ou processo de imigração para o Canadá, o CAD/BRL costuma ser acompanhado por meses seguidos, já que mensalidades, aluguel e remessas recorrentes tornam pequenas variações cambiais relevantes no orçamento total.",
            "Processos de imigração como o Express Entry costumam exigir comprovação de fundos em dólares canadenses, o que faz com que muitas famílias precisem converter valores expressivos de uma só vez. Nesses casos, acompanhar a tendência do câmbio por algumas semanas e comparar diferentes prestadores pode representar uma diferença significativa no valor final em reais.",
            "Como nas demais moedas, o valor de mercado exibido aqui não inclui spread da instituição financeira nem o IOF que incide sobre remessas e compras internacionais — fatores que devem entrar na comparação antes de escolher onde fechar o câmbio.",
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
            "A Suíça mantém tradição de estabilidade política, baixa inflação e um Banco Nacional Suíço com histórico de política monetária conservadora, características que sustentam a fama do franco como 'moeda-porto seguro'. Em períodos de crise ou incerteza global, é comum ver fluxo de capital migrando para ativos em francos suíços, o que tende a valorizar a moeda.",
            "Essa característica defensiva também significa que o CHF pode se valorizar mesmo quando outras moedas de países desenvolvidos perdem força, tornando-o um contraponto interessante para quem acompanha câmbio como parte de uma estratégia mais ampla de proteção patrimonial.",
            "Entre 2011 e 2015, o Banco Nacional Suíço chegou a fixar um teto para a valorização do franco frente ao euro, e a retirada repentina dessa política provocou um dos movimentos cambiais mais bruscos da história recente. O episódio ilustra como até moedas consideradas estáveis podem ter oscilações fortes diante de mudanças de política monetária.",
            "Para viagens, estudos ou remessas à Suíça — um dos países com custo de vida mais alto do mundo — vale simular o custo total em reais incluindo spread e IOF, já que a cotação de mercado isolada tende a subestimar o valor final desembolsado.",
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
            "Uma particularidade do iene é que ele é cotado em valores nominais bem menores por unidade — por isso é comum ver preços no Japão na casa das centenas ou milhares de ienes para itens do dia a dia. O Banco do Japão manteve por anos uma política de juros extremamente baixos (ou negativos), o que historicamente pressionou a moeda e a tornou referência para operações de 'carry trade' no mercado internacional.",
            "O iene também costuma ser procurado como moeda defensiva em momentos de aversão a risco global, de forma parecida com o franco suíço, ainda que por razões estruturais diferentes ligadas ao papel do Japão como credor internacional.",
            "Períodos de iene mais fraco tornam o Japão um destino comparativamente mais barato para turistas brasileiros, já que hospedagem, alimentação e compras ficam mais acessíveis em reais. Por isso, quem planeja conhecer o país costuma acompanhar o JPY/BRL com atenção para identificar janelas mais favoráveis de compra da moeda.",
            "Para quem vai ao Japão ou importa produtos de lá, vale lembrar que, além do câmbio de mercado mostrado aqui, cartões internacionais e casas de câmbio aplicam spread e o IOF pode incidir conforme o tipo de operação — por isso comparar a taxa efetiva final é mais confiável do que olhar só a cotação bruta.",
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
            "Diferente da maioria das moedas desta lista, o yuan (ou renminbi) tem seu câmbio administrado dentro de bandas de flutuação controladas pelo Banco Popular da China, que fixa uma taxa de referência diária. Isso torna sua variação geralmente mais suave no curto prazo do que moedas de câmbio totalmente livre, mas decisões de política econômica chinesa ainda podem gerar movimentos relevantes.",
            "Como o Brasil é um dos principais parceiros comerciais da China — especialmente em commodities agrícolas e minério de ferro — o CNY/BRL tem peso direto sobre contratos de exportação, precificação de matérias-primas e negociações entre empresas dos dois países.",
            "Vale saber que existem duas cotações principais do yuan: a onshore (CNY), negociada dentro da China sob maior controle, e a offshore (CNH), negociada em mercados internacionais como Hong Kong. Pequenas diferenças entre as duas costumam refletir a percepção do mercado sobre a política econômica chinesa em determinado momento.",
            "Para quem importa produtos chineses ou faz pagamentos ligados à China, o valor final da operação em reais também depende de spread bancário e, conforme o caso, IOF sobre a remessa — por isso vale comparar a taxa efetiva entre diferentes prestadores antes de fechar negócio.",
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
