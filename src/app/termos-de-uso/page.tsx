import ArticlePage from "@/components/ArticlePage";
import { buildStaticMetadata } from "@/lib/metadata";

const title = "Termos de Uso";
const description = "Condições de uso do HoraJá Cambio, incluindo limites de responsabilidade sobre as cotações exibidas e o uso de links de parceiros.";

export const metadata = buildStaticMetadata("/termos-de-uso", title, description);

const sections = [
    {
        title: "Natureza informativa do conteúdo",
        paragraphs: [
            "O HoraJá Cambio exibe cotações de moedas e criptoativos com finalidade exclusivamente informativa. Os valores apresentados têm caráter referencial e podem apresentar pequena defasagem em relação ao mercado em tempo real.",
            "O conteúdo do site não constitui recomendação de investimento, consultoria financeira ou aconselhamento fiscal. Decisões de compra, venda ou remessa de moeda são de responsabilidade exclusiva do usuário.",
        ],
    },
    {
        title: "Uso do site",
        paragraphs: [
            "É permitido o uso do site para consulta pessoal de cotações e conteúdo. Não é permitida a reprodução integral do conteúdo publicado sem autorização prévia, extração automatizada em massa (scraping) ou uso que sobrecarregue a infraestrutura do site.",
        ],
    },
    {
        title: "Links de parceiros e publicidade",
        paragraphs: [
            "O site exibe anúncios de terceiros através do Google AdSense e links de afiliados para serviços financeiros parceiros. O HoraJá Cambio pode receber comissão por indicações feitas através desses links, sem custo adicional para o usuário.",
            "A inclusão de um parceiro não representa endosso de sua qualidade de serviço; recomendamos sempre comparar taxas e condições antes de contratar qualquer serviço financeiro.",
        ],
    },
    {
        title: "Limitação de responsabilidade",
        paragraphs: [
            "O HoraJá Cambio não se responsabiliza por perdas financeiras decorrentes do uso das cotações exibidas no site, incluindo eventuais indisponibilidades temporárias das fontes de dados utilizadas.",
        ],
    },
];

export default function TermosDeUsoPage() {
    return <ArticlePage title={title} description={description} sections={sections} />;
}
