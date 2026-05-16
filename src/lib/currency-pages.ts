import { getCurrencyByCode } from "@/lib/api";
import { buildCurrencyMetadata } from "@/lib/metadata";
import { formatCurrency } from "@/lib/formatters";
import type { CurrencyCode } from "@/lib/currencies";

export async function buildCurrencyPageMetadata(code: Exclude<CurrencyCode, "BRL">) {
    const currency = await getCurrencyByCode(code);
    const currentValue = currency ? formatCurrency(currency.bid) : "R$ --,--";
    return buildCurrencyMetadata(code, currentValue);
}
