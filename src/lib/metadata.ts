import type { Metadata } from "next";
import { currencyMap, type CurrencyCode } from "@/lib/currencies";
import { buildCurrencyMetadataTitle } from "@/lib/site-content";

const SITE_URL = "https://horajacambio.com.br";

export function buildAbsoluteUrl(path: string): string {
    return new URL(path, SITE_URL).toString();
}

export function buildCurrencyMetadata(
    code: CurrencyCode,
    currentValue: string,
    description?: string,
): Metadata {
    const currency = currencyMap[code];
    const title = buildCurrencyMetadataTitle(code, currentValue);
    const finalDescription =
        description ?? `Acompanhe ${currency.name} em tempo real, histórico recente, comparação com IOF e conteúdo útil para câmbio.`;

    return {
        title,
        description: finalDescription,
        alternates: {
            canonical: buildAbsoluteUrl(currency.route),
        },
        openGraph: {
            title,
            description: finalDescription,
            url: buildAbsoluteUrl(currency.route),
            siteName: "HoraJá Cambio",
            locale: "pt_BR",
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description: finalDescription,
        },
    };
}

export function buildStaticMetadata(path: string, title: string, description: string): Metadata {
    return {
        title,
        description,
        alternates: {
            canonical: buildAbsoluteUrl(path),
        },
        openGraph: {
            title,
            description,
            url: buildAbsoluteUrl(path),
            siteName: "HoraJá Cambio",
            locale: "pt_BR",
            type: "article",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
    };
}

export { SITE_URL };
