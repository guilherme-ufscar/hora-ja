import CurrencyPageTemplate from "@/components/CurrencyPageTemplate";
import { getCurrencyByCode } from "@/lib/api";
import { buildCurrencyPageMetadata } from "@/lib/currency-pages";

export const revalidate = 600;

export async function generateMetadata() {
    return buildCurrencyPageMetadata("GBP");
}

export default async function LibraPage() {
    const data = await getCurrencyByCode("GBP");
    return <CurrencyPageTemplate code="GBP" data={data} />;
}
