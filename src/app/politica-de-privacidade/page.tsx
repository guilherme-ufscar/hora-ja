import ArticlePage from "@/components/ArticlePage";
import { buildStaticMetadata } from "@/lib/metadata";

const title = "Política de Privacidade";
const description = "Entenda quais dados o HoraJá Cambio coleta, como são usados e quais direitos você tem sobre suas informações.";

export const metadata = buildStaticMetadata("/politica-de-privacidade", title, description);

const sections = [
    {
        title: "Quais dados coletamos",
        paragraphs: [
            "Quando você se cadastra para receber alertas de cotação ou notificações por e-mail, coletamos o endereço de e-mail informado e, quando aplicável, a moeda e a condição de alerta escolhidas.",
            "Também coletamos dados técnicos de navegação de forma automática, como endereço IP, tipo de navegador e páginas visitadas, usados para segurança, prevenção de abuso e melhoria da experiência do site.",
        ],
    },
    {
        title: "Cookies e publicidade",
        paragraphs: [
            "O site utiliza o Google AdSense para exibição de anúncios. O Google e seus parceiros podem usar cookies para exibir anúncios com base em visitas anteriores do usuário a este e a outros sites.",
            "Você pode desativar a personalização de anúncios nas configurações de anúncios do Google ou através das ferramentas de opt-out disponibilizadas pela Network Advertising Initiative.",
        ],
    },
    {
        title: "Como usamos os dados",
        paragraphs: [
            "O e-mail cadastrado é usado exclusivamente para envio dos alertas de cotação solicitados pelo usuário e comunicações relacionadas ao funcionamento do serviço. Não vendemos dados pessoais a terceiros.",
            "Você pode solicitar a exclusão do seu cadastro e dos dados associados a qualquer momento entrando em contato pelo e-mail informado na página de Contato.",
        ],
    },
    {
        title: "Links de parceiros",
        paragraphs: [
            "Algumas páginas contêm links de afiliados para serviços financeiros de terceiros. Ao clicar nesses links, você sai do HoraJá Cambio e passa a estar sujeito à política de privacidade do site de destino.",
        ],
    },
];

export default function PoliticaDePrivacidadePage() {
    return <ArticlePage title={title} description={description} sections={sections} />;
}
