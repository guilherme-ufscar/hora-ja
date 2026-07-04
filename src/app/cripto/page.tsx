import { Metadata } from "next";
import CryptoConverter from "@/components/CryptoConverter";
import AffiliateSection from "@/components/AffiliateSection";
import { cryptoAffiliatePartners } from "@/lib/site-content";
import { buildStaticMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildStaticMetadata(
    "/cripto",
    "Criptomoedas | HoraJá Cambio",
    "Acompanhe cotações de Bitcoin, Ethereum e outras criptomoedas. Converta entre criptos e moedas fiduciárias."
);

export default function CryptoPage() {
    return (
        <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <div className="mb-12">
                <span className="inline-flex rounded-full bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-primary">
                    Criptoativos
                </span>
                <h1 className="mt-4 text-4xl sm:text-5xl font-black tracking-tight text-foreground">
                    Criptomoedas
                </h1>
                <p className="mt-4 text-lg text-foreground/60 max-w-2xl">
                    Acompanhe as principais criptomoedas em tempo real e faça conversões entre criptos e moedas tradicionais.
                </p>
            </div>

            <div className="space-y-16">
                <CryptoConverter />

                <AffiliateSection
                    partners={cryptoAffiliatePartners}
                    eyebrow="Onde comprar cripto"
                    title="Exchanges para comparar antes de fechar a operação"
                    description="Compare taxas e recursos entre as principais exchanges antes de comprar ou vender."
                />
            </div>
        </div>
    );
}
