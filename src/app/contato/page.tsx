import ArticlePage from "@/components/ArticlePage";
import { buildStaticMetadata } from "@/lib/metadata";

const title = "Contato";
const description = "Fale com a equipe do HoraJá Cambio para dúvidas, sugestões, correções de conteúdo ou parcerias.";

export const metadata = buildStaticMetadata("/contato", title, description);

const sections = [
    {
        title: "Como falar conosco",
        paragraphs: [
            "Encontrou uma cotação incorreta, um erro de conteúdo ou tem uma sugestão para o site? Envie uma mensagem para contato@horajacambio.com.br descrevendo o que encontrou, incluindo a página em que ocorreu, quando possível.",
            "Respondemos prioritariamente dúvidas sobre funcionamento do site, correções de conteúdo e propostas de parceria. Não prestamos consultoria financeira ou recomendação de investimento individualizada.",
        ],
    },
    {
        title: "Parcerias e imprensa",
        paragraphs: [
            "Empresas do setor financeiro interessadas em parcerias de conteúdo ou divulgação podem entrar em contato pelo mesmo e-mail, identificando o assunto como 'Parceria' no título da mensagem.",
        ],
    },
];

export default function ContatoPage() {
    return <ArticlePage title={title} description={description} sections={sections} />;
}
