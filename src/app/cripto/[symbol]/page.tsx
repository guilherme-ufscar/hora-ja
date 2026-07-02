import { Metadata } from "next";
import CryptoPageTemplate from "@/components/CryptoPageTemplate";

const CRYPTO_CONFIG: Record<string, { name: string; description: string }> = {
    btc: { name: "Bitcoin", description: "Acompanhe a cotação do Bitcoin em tempo real. Bitcoin é a primeira e mais valiosa criptomoeda do mundo." },
    eth: { name: "Ethereum", description: "Acompanhe a cotação do Ethereum em tempo real. Ethereum é uma plataforma descentralizada para contratos inteligentes." },
    sol: { name: "Solana", description: "Acompanhe a cotação do Solana em tempo real. Solana é um blockchain de alta performance." },
    xrp: { name: "Ripple", description: "Acompanhe a cotação do Ripple em tempo real. XRP é o token do protocolo Ripple para pagamentos." },
    ada: { name: "Cardano", description: "Acompanhe a cotação do Cardano em tempo real. Cardano é um blockchain baseado em pesquisa acadêmica." },
    dot: { name: "Polkadot", description: "Acompanhe a cotação do Polkadot em tempo real. Polkadot conecta diferentes blockchains." },
};

interface Props {
    params: Promise<{ symbol: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { symbol } = await params;
    const config = CRYPTO_CONFIG[symbol.toLowerCase()];

    if (!config) {
        return { title: "Criptomoeda não encontrada | HoraJá Cambio" };
    }

    return {
        title: `${config.name} (${symbol.toUpperCase()}) | HoraJá Cambio`,
        description: config.description,
    };
}

export default async function CryptoSymbolPage({ params }: Props) {
    const { symbol } = await params;
    const upperSymbol = symbol.toUpperCase();

    // Verificar se a cripto existe
    const validSymbols = ["BTC", "ETH", "SOL", "XRP", "ADA", "DOT"];
    if (!validSymbols.includes(upperSymbol)) {
        return (
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-foreground mb-4">Criptomoeda não encontrada</h1>
                    <p className="text-foreground/60 mb-6">A criptomoeda "{symbol}" não está disponível.</p>
                    <a href="/cripto" className="text-primary hover:underline">
                        ← Voltar para Criptomoedas
                    </a>
                </div>
            </div>
        );
    }

    return <CryptoPageTemplate symbol={upperSymbol} />;
}
