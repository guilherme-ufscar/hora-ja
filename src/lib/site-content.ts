import type { FAQItem } from "@/components/FAQ";
import { currencyMap, type CurrencyCode } from "@/lib/currencies";

export interface AffiliatePartner {
    name: string;
    description: string;
    href: string;
    cta: string;
    logoText: string;
    logoClassName: string;
}

export interface CurrencyPageContent {
    faq: FAQItem[];
    badgeLabel: string;
    sourceLabel: string;
}

export const homepageFaq: FAQItem[] = [
    {
        question: "Por que usar o Horário de Brasília como referência?",
        answer: "O Horário de Brasília segue como a base oficial do mercado brasileiro e ajuda a contextualizar a abertura da B3, bancos e atualizações relevantes para quem acompanha câmbio no país.",
    },
    {
        question: "Com que frequência as cotações são atualizadas?",
        answer: "O site utiliza AwesomeAPI como fonte oficial e renova os dados em janelas curtas para equilibrar atualização frequente e boa performance no carregamento das páginas.",
    },
    {
        question: "O valor exibido já inclui IOF e spread?",
        answer: "Não. A cotação principal representa o valor-base de mercado. No conversor e na calculadora de viagem você pode incluir IOF e visualizar o impacto estimado do spread no custo total em reais.",
    },
];

export const currencyPageContent: Record<Exclude<CurrencyCode, "BRL">, CurrencyPageContent> = {
    USD: {
        badgeLabel: "Atualizado a cada 10 min",
        sourceLabel: "Fonte: AwesomeAPI",
        faq: [
            {
                question: "Qual a diferença entre dólar comercial e turismo?",
                answer: "O dólar comercial é a referência do mercado financeiro. O turismo costuma ser mais caro porque inclui custos operacionais, disponibilidade de papel-moeda e margem da instituição que vende a moeda.",
            },
            {
                question: "Quando vale a pena acompanhar o dólar com mais frequência?",
                answer: "Em períodos de viagem, remessa internacional, compras no exterior ou maior volatilidade econômica, acompanhar o USD/BRL mais de perto ajuda a escolher melhor o momento da operação.",
            },
        ],
    },
    EUR: {
        badgeLabel: "Atualizado a cada 10 min",
        sourceLabel: "Fonte: AwesomeAPI",
        faq: [
            {
                question: "Por que o euro costuma ficar acima do dólar?",
                answer: "O nível da taxa de câmbio depende de vários fatores econômicos, monetários e de fluxo internacional. Em muitos momentos, o euro apresenta paridade mais alta frente ao real por refletir a força relativa da economia europeia e do bloco da moeda comum.",
            },
            {
                question: "O euro afeta só quem viaja para a Europa?",
                answer: "Não. A moeda também influencia importações, remessas, estudos, investimentos e custos de empresas brasileiras que têm operações ou fornecedores na região.",
            },
        ],
    },
    GBP: {
        badgeLabel: "Atualizado a cada 10 min",
        sourceLabel: "Fonte: AwesomeAPI",
        faq: [
            {
                question: "A Inglaterra usa euro?",
                answer: "Não. O Reino Unido mantém a Libra Esterlina como moeda oficial, e ela segue sendo uma das moedas mais tradicionais e valorizadas do mercado internacional.",
            },
            {
                question: "A libra é importante só para turismo?",
                answer: "Além de viagens, a libra impacta estudos, remessas, contratos internacionais e custos de quem faz negócios ou recebe pagamentos ligados ao Reino Unido.",
            },
        ],
    },
    ARS: {
        badgeLabel: "Atualizado a cada 10 min",
        sourceLabel: "Fonte: AwesomeAPI",
        faq: [
            {
                question: "Por que brasileiros acompanham tanto o peso argentino?",
                answer: "Porque ele influencia diretamente o custo de viagens para a Argentina, um dos destinos internacionais mais populares para brasileiros, além de afetar compras e serviços locais no país.",
            },
            {
                question: "O câmbio da Argentina pode mudar rápido?",
                answer: "Sim. O peso argentino pode ter períodos de volatilidade relevante, por isso acompanhar a cotação ajuda no planejamento financeiro de viagens e pagamentos.",
            },
        ],
    },
    CAD: {
        badgeLabel: "Atualizado a cada 10 min",
        sourceLabel: "Fonte: AwesomeAPI",
        faq: [
            {
                question: "O dólar canadense se comporta igual ao americano?",
                answer: "Não. Embora os dois usem o nome dólar, o CAD responde a fatores próprios, como economia canadense, commodities, política monetária local e fluxo comercial com os Estados Unidos.",
            },
            {
                question: "Quem costuma acompanhar o CAD/BRL?",
                answer: "Pessoas planejando intercâmbio, imigração, viagens ou remessas para o Canadá costumam monitorar essa cotação com frequência.",
            },
        ],
    },
    CHF: {
        badgeLabel: "Atualizado a cada 10 min",
        sourceLabel: "Fonte: AwesomeAPI",
        faq: [
            {
                question: "Por que o franco suíço é visto como moeda estável?",
                answer: "O franco suíço costuma ser associado à solidez financeira da Suíça e à busca por proteção em momentos de incerteza, o que faz dele uma referência defensiva em muitos cenários de mercado.",
            },
            {
                question: "Quando faz sentido acompanhar o CHF/BRL?",
                answer: "Ao planejar viagens, estudos, remessas, contratos internacionais ou acompanhar movimentos de mercado ligados a moedas de refúgio.",
            },
        ],
    },
    JPY: {
        badgeLabel: "Atualizado a cada 10 min",
        sourceLabel: "Fonte: AwesomeAPI",
        faq: [
            {
                question: "O iene é relevante fora do Japão?",
                answer: "Sim. O iene tem peso relevante no comércio internacional e nos mercados financeiros, sendo uma das moedas mais negociadas do mundo.",
            },
            {
                question: "Quem se beneficia de acompanhar o JPY/BRL?",
                answer: "Viajantes, estudantes, importadores e pessoas que acompanham o mercado asiático podem usar essa referência para planejar melhor custos e operações.",
            },
        ],
    },
    CNY: {
        badgeLabel: "Atualizado a cada 10 min",
        sourceLabel: "Fonte: AwesomeAPI",
        faq: [
            {
                question: "O yuan impacta o dia a dia no Brasil?",
                answer: "Sim. Como a China tem enorme peso no comércio global e na cadeia de produção de muitos produtos, a cotação do yuan pode influenciar importações, custos e negociações internacionais.",
            },
            {
                question: "Quem acompanha mais o CNY/BRL?",
                answer: "Empresas importadoras, profissionais do comércio exterior e pessoas que fazem pagamentos ou remessas ligados à China.",
            },
        ],
    },
};

export const affiliatePartners: AffiliatePartner[] = [
    {
        name: "Wise",
        description: "Conta internacional e envio de dinheiro com boa transparência de custos e taxa efetiva.",
        href: "https://wise.com/invite/mic/diegosilasg",
        cta: "Ver condições",
        logoText: "Wise",
        logoClassName: "bg-emerald-500/10 text-emerald-600",
    },
    {
        name: "Remessa Online",
        description: "Solução popular para remessas internacionais com foco em praticidade no envio a partir do Brasil.",
        href: "https://remessaonline.com.br?utm_voucher=dg0608&utm_medium=mgm-share",
        cta: "Comparar remessa",
        logoText: "RO",
        logoClassName: "bg-sky-500/10 text-sky-600",
    },
    {
        name: "Nomad",
        description: "Conta global com foco em gastos e investimentos em dólar para quem viaja ou compra no exterior.",
        href: "https://nomad.onelink.me/wIQT/Account?code=9T7WDPPU37&n=Diego",
        cta: "Conhecer a conta",
        logoText: "Nomad",
        logoClassName: "bg-amber-500/10 text-amber-600",
    },
    {
        name: "Banco Inter",
        description: "Alternativa bancária com soluções de câmbio e serviços internacionais dentro de um ecossistema local.",
        href: "https://inter-co.onelink.me/Qyu7/ste2n6tb",
        cta: "Ver câmbio",
        logoText: "Inter",
        logoClassName: "bg-orange-500/10 text-orange-600",
    },
    {
        name: "Western Union",
        description: "Marca tradicional em transferências internacionais, útil para comparar opções de envio e retirada.",
        href: "https://ssqt.co/mQTW7gU",
        cta: "Ver opções",
        logoText: "WU",
        logoClassName: "bg-yellow-500/10 text-yellow-700",
    },
];

export const articleContent = {
    iof: {
        slug: "/o-que-e-iof",
        title: "O que é IOF e como ele afeta o câmbio",
        description: "Entenda o que é IOF, quando ele aparece no câmbio e como impacta compras internacionais, espécie e transferências.",
        sections: [
            {
                title: "O que significa IOF",
                paragraphs: [
                    "IOF é o Imposto sobre Operações Financeiras. No câmbio, ele aparece em operações como compra de moeda, uso de cartão internacional e transferências para o exterior.",
                    "A alíquota muda de acordo com o tipo de operação. Por isso, duas compras com a mesma cotação-base podem gerar custos finais bem diferentes em reais.",
                ],
            },
            {
                title: "Por que considerar o IOF no planejamento",
                paragraphs: [
                    "Quem olha apenas para a cotação comercial corre o risco de subestimar o custo real da operação. IOF e spread alteram o valor final pago e devem entrar na conta desde o início.",
                    "No HoraJá Cambio, o conversor e a calculadora de viagem ajudam a simular esse impacto para decisões mais realistas.",
                ],
            },
        ],
    },
    exterior: {
        slug: "/como-enviar-dinheiro-exterior",
        title: "Como enviar dinheiro para o exterior com mais clareza",
        description: "Veja os principais fatores para comparar remessas internacionais, da taxa efetiva ao prazo de entrega e ao custo total em reais.",
        sections: [
            {
                title: "Olhe além da cotação exibida",
                paragraphs: [
                    "O valor anunciado nem sempre reflete o custo total. Para comparar serviços de remessa, observe a cotação usada, o spread, as tarifas fixas e o IOF aplicado.",
                    "A taxa efetiva costuma ser o melhor indicador para entender quanto realmente sai do seu bolso em reais.",
                ],
            },
            {
                title: "Prazo, conveniência e objetivo também pesam",
                paragraphs: [
                    "Uma remessa para manutenção, estudo ou pagamento urgente pode exigir prioridades diferentes. Em alguns casos vale pagar um pouco mais por prazo menor ou melhor experiência operacional.",
                    "O ideal é comparar cenários antes de fechar a operação, especialmente em momentos de maior oscilação cambial.",
                ],
            },
        ],
    },
    dolar: {
        slug: "/melhor-hora-comprar-dolar",
        title: "Existe melhor hora para comprar dólar?",
        description: "Saiba como pensar o momento de compra do dólar sem depender só de chute, acompanhando tendência, objetivo e custo total da operação.",
        sections: [
            {
                title: "Não existe resposta única",
                paragraphs: [
                    "O melhor momento depende do objetivo: viagem próxima, reserva de valor, remessa urgente ou compras parceladas no exterior exigem estratégias diferentes.",
                    "Tentar acertar o fundo exato do câmbio é difícil. Em muitos casos, acompanhar tendência e fazer compras graduais reduz o risco de entrar num único ponto ruim.",
                ],
            },
            {
                title: "O custo final é mais importante que o número isolado",
                paragraphs: [
                    "Mesmo quando a cotação melhora um pouco, spread, IOF e tarifas podem anular a vantagem. A melhor decisão costuma vir da comparação entre taxa efetiva, necessidade e timing da operação.",
                    "Por isso, acompanhar histórico, variação e simulações práticas costuma ser mais útil do que reagir a um único preço momentâneo.",
                ],
            },
        ],
    },
};

export function buildCurrencyPageFaq(code: CurrencyCode): FAQItem[] {
    return currencyPageContent[code as Exclude<CurrencyCode, "BRL">]?.faq ?? [];
}

export function buildCurrencyMetadataTitle(code: CurrencyCode, currentValue: string) {
    const currency = currencyMap[code];
    return `${currency.shortName} hoje: ${currentValue} — HoraJá`;
}
