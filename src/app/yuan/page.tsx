import CurrencyPageTemplate from "@/components/CurrencyPageTemplate";
import { getCurrencyByCode } from "@/lib/api";
import { buildCurrencyPageMetadata } from "@/lib/currency-pages";

export const revalidate = 600;

export async function generateMetadata() {
    return buildCurrencyPageMetadata("CNY");
}

export default async function YuanPage() {
    const data = await getCurrencyByCode("CNY");
    return <CurrencyPageTemplate code="CNY" data={data} />;
}
