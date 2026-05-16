import type { CurrencyCode } from "@/lib/currencies";

export type PaymentType = "card" | "cash" | "transfer";

export const iofRates: Record<PaymentType, number> = {
    card: 0.0638,
    cash: 0.0038,
    transfer: 0.0038,
};

export interface CurrencyQuoteLike {
    bid: number;
    ask?: number;
}

export interface ConversionResult {
    amount: number;
    valueInBrl: number;
    convertedAmount: number;
}

export interface TravelEstimate {
    paymentType: PaymentType;
    baseInBrl: number;
    spreadInBrl: number;
    iofInBrl: number;
    totalInBrl: number;
    effectiveRate: number;
}

export interface ConversionWithIofResult extends ConversionResult {
    iofInBrl: number;
    totalInBrl: number;
}

export function parseNumericInput(value: string | number): number {
    if (typeof value === "number") {
        return Number.isFinite(value) ? value : 0;
    }

    const normalized = value.replace(/\./g, "").replace(",", ".").replace(/[^\d.-]/g, "");
    const parsed = Number.parseFloat(normalized);
    return Number.isFinite(parsed) ? parsed : 0;
}

export function convertAmount(
    amount: number,
    fromRateInBrl: number,
    toRateInBrl: number,
): ConversionResult {
    const safeAmount = Number.isFinite(amount) ? amount : 0;
    const safeFromRate = fromRateInBrl > 0 ? fromRateInBrl : 1;
    const safeToRate = toRateInBrl > 0 ? toRateInBrl : 1;
    const valueInBrl = safeAmount * safeFromRate;
    const convertedAmount = valueInBrl / safeToRate;

    return {
        amount: safeAmount,
        valueInBrl,
        convertedAmount,
    };
}

export function applyIof(valueInBrl: number, paymentType: PaymentType): number {
    return valueInBrl * iofRates[paymentType];
}

export function convertAmountWithIof(
    amount: number,
    fromRateInBrl: number,
    toRateInBrl: number,
    paymentType: PaymentType,
    includeIof: boolean,
): ConversionWithIofResult {
    const base = convertAmount(amount, fromRateInBrl, toRateInBrl);
    const iofInBrl = includeIof ? applyIof(base.valueInBrl, paymentType) : 0;
    const totalInBrl = base.valueInBrl + iofInBrl;
    const convertedAmount = toRateInBrl > 0 ? totalInBrl / toRateInBrl : base.convertedAmount;

    return {
        ...base,
        convertedAmount,
        iofInBrl,
        totalInBrl,
    };
}

export function calculateTravelTotal(
    amount: number,
    quote: CurrencyQuoteLike,
    paymentType: PaymentType,
): TravelEstimate {
    const commercialRate = quote.bid > 0 ? quote.bid : 0;
    const consumerRate = quote.ask && quote.ask > 0 ? quote.ask : commercialRate;
    const baseInBrl = amount * commercialRate;
    const spreadInBrl = Math.max(consumerRate - commercialRate, 0) * amount;
    const subtotal = baseInBrl + spreadInBrl;
    const iofInBrl = applyIof(subtotal, paymentType);
    const totalInBrl = subtotal + iofInBrl;

    return {
        paymentType,
        baseInBrl,
        spreadInBrl,
        iofInBrl,
        totalInBrl,
        effectiveRate: amount > 0 ? totalInBrl / amount : 0,
    };
}

export function formatDecimalInput(value: string): string {
    const normalized = value.replace(/,/g, ".").replace(/[^\d.]/g, "");
    const [integerPart, decimalPart = ""] = normalized.split(".");

    if (normalized.endsWith(".") && decimalPart.length === 0) {
        return `${integerPart}.`;
    }

    return decimalPart.length > 0 ? `${integerPart}.${decimalPart.slice(0, 4)}` : integerPart;
}

export function formatMaskedMoney(value: string, locale = "pt-BR"): string {
    const amount = parseNumericInput(value);

    return new Intl.NumberFormat(locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
}

export function getPaymentLabel(paymentType: PaymentType): string {
    switch (paymentType) {
        case "card":
            return "Cartão";
        case "cash":
            return "Espécie";
        case "transfer":
            return "Transferência";
        default:
            return "Pagamento";
    }
}

export function inferCurrencyCodeFromCountry(countryCode: string): CurrencyCode {
    switch (countryCode) {
        case "AR":
            return "ARS";
        case "CA":
            return "CAD";
        case "CH":
            return "CHF";
        case "JP":
            return "JPY";
        case "CN":
            return "CNY";
        case "GB":
            return "GBP";
        case "US":
            return "USD";
        default:
            return "EUR";
    }
}

export const travelDestinations = [
    { countryCode: "US", label: "Estados Unidos", currencyCode: "USD" as CurrencyCode },
    { countryCode: "EU", label: "Zona do Euro", currencyCode: "EUR" as CurrencyCode },
    { countryCode: "GB", label: "Reino Unido", currencyCode: "GBP" as CurrencyCode },
    { countryCode: "AR", label: "Argentina", currencyCode: "ARS" as CurrencyCode },
    { countryCode: "CA", label: "Canadá", currencyCode: "CAD" as CurrencyCode },
    { countryCode: "CH", label: "Suíça", currencyCode: "CHF" as CurrencyCode },
    { countryCode: "JP", label: "Japão", currencyCode: "JPY" as CurrencyCode },
    { countryCode: "CN", label: "China", currencyCode: "CNY" as CurrencyCode },
];
