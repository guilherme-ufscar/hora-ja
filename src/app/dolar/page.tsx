import CurrencyPageTemplate from "@/components/CurrencyPageTemplate";
import { getCurrencyByCode } from "@/lib/api";
import { buildCurrencyPageMetadata } from "@/lib/currency-pages";

export const revalidate = 600;

export async function generateMetadata() {
    return buildCurrencyPageMetadata("USD");
}

export default async function DolarPage() {
    const data = await getCurrencyByCode("USD");
    return <CurrencyPageTemplate code="USD" data={data} />;
}
