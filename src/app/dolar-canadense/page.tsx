import CurrencyPageTemplate from "@/components/CurrencyPageTemplate";
import { getCurrencyByCode } from "@/lib/api";
import { buildCurrencyPageMetadata } from "@/lib/currency-pages";

export const revalidate = 600;

export async function generateMetadata() {
    return buildCurrencyPageMetadata("CAD");
}

export default async function DolarCanadensePage() {
    const data = await getCurrencyByCode("CAD");
    return <CurrencyPageTemplate code="CAD" data={data} />;
}
