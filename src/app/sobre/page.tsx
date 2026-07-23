import ArticlePage from "@/components/ArticlePage";
import { buildStaticMetadata } from "@/lib/metadata";

const title = "Sobre o HoraJá Cambio";
const description = "Conheça o propósito do HoraJá Cambio: acompanhar cotações de moedas e criptoativos em tempo real com contexto útil para decisões do dia a dia.";

export const metadata = buildStaticMetadata("/sobre", title, description);

const sections = [
    {
        title: "O que é o HoraJá Cambio",
        paragraphs: [
            "O HoraJá Cambio é uma plataforma independente que reúne cotações de câmbio e criptomoedas atualizadas, histórico recente e conteúdo explicativo para ajudar brasileiros a entenderem melhor o mercado de moedas.",
            "O site nasceu da necessidade de ter, em um só lugar, cotações confiáveis, ferramentas de conversão e explicações claras sobre temas como IOF, spread e o momento de comprar ou enviar dinheiro para o exterior.",
        ],
    },
    {
        title: "De onde vêm os dados",
        paragraphs: [
            "As cotações de moedas exibidas no site são obtidas através da AwesomeAPI, um provedor de dados cambiais amplamente utilizado no mercado brasileiro. Os preços de criptoativos seguem lógica semelhante, com atualização periódica.",
            "Em caso de indisponibilidade temporária da fonte principal, o site utiliza fontes alternativas para manter a exibição de valores de referência, sinalizando quando os dados não são de tempo real.",
        ],
    },
    {
        title: "Como o site se sustenta",
        paragraphs: [
            "O HoraJá Cambio é financiado por publicidade exibida no site e por comissões de afiliados quando o usuário opta por contratar um dos serviços de parceiros indicados nas páginas de moeda. Essa relação comercial não influencia os valores de cotação exibidos.",
            "Nosso compromisso é manter o conteúdo informativo, claro e útil, independentemente de parcerias comerciais.",
        ],
    },
];

export default function SobrePage() {
    return <ArticlePage title={title} description={description} sections={sections} />;
}
