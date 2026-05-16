import CurrencyPageTemplate from "@/components/CurrencyPageTemplate";
import { getCurrencyByCode } from "@/lib/api";
import { buildCurrencyPageMetadata } from "@/lib/currency-pages";

export const revalidate = 600;

export async function generateMetadata() {
    return buildCurrencyPageMetadata("CHF");
}

export default async function FrancoSuicoPage() {
    const data = await getCurrencyByCode("CHF");
    return <CurrencyPageTemplate code="CHF" data={data} />;
}
