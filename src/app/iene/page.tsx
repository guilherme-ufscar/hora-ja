import CurrencyPageTemplate from "@/components/CurrencyPageTemplate";
import { getCurrencyByCode } from "@/lib/api";
import { buildCurrencyPageMetadata } from "@/lib/currency-pages";

export const revalidate = 600;

export async function generateMetadata() {
    return buildCurrencyPageMetadata("JPY");
}

export default async function IenePage() {
    const data = await getCurrencyByCode("JPY");
    return <CurrencyPageTemplate code="JPY" data={data} />;
}
