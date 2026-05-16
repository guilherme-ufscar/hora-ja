import CurrencyPageTemplate from "@/components/CurrencyPageTemplate";
import { getCurrencyByCode } from "@/lib/api";
import { buildCurrencyPageMetadata } from "@/lib/currency-pages";

export const revalidate = 600;

export async function generateMetadata() {
    return buildCurrencyPageMetadata("ARS");
}

export default async function PesoArgentinoPage() {
    const data = await getCurrencyByCode("ARS");
    return <CurrencyPageTemplate code="ARS" data={data} />;
}
