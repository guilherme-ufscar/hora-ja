export function formatCurrency(value: string | number): string {
    const numericValue = typeof value === "string" ? parseFloat(value) : value;

    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(numericValue);
}

export function formatCompactNumber(value: string | number, maximumFractionDigits = 2): string {
    const numericValue = typeof value === "string" ? parseFloat(value) : value;

    return new Intl.NumberFormat("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits,
    }).format(numericValue);
}

export function formatPercentage(pctChange: string | number): string {
    const numericValue = typeof pctChange === "string" ? parseFloat(pctChange) : pctChange;
    const isPositive = numericValue >= 0;

    return `${isPositive ? "+" : ""}${numericValue.toFixed(2)}%`;
}

export function formatLastUpdate(dateString: string): string {
    try {
        const normalizedDateString = dateString.includes("T")
            ? dateString
            : dateString.replace(" ", "T") + "-03:00";

        const date = new Date(normalizedDateString);

        if (isNaN(date.getTime())) {
            return dateString;
        }

        const formatter = new Intl.DateTimeFormat("pt-BR", {
            timeZone: "America/Sao_Paulo",
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
        });

        const parts = formatter.formatToParts(date);
        const day = parts.find((p) => p.type === "day")?.value;
        const month = parts.find((p) => p.type === "month")?.value;
        const hour = parts.find((p) => p.type === "hour")?.value;
        const minute = parts.find((p) => p.type === "minute")?.value;

        return `${day} de ${month}, às ${hour}:${minute}`;
    } catch {
        return dateString;
    }
}

export function formatHistoryDate(dateStr: string): string {
    const normalized = dateStr.includes("T") ? dateStr : `${dateStr}T00:00:00-03:00`;
    const date = new Date(normalized);

    return new Intl.DateTimeFormat("pt-BR", {
        timeZone: "America/Sao_Paulo",
        weekday: "short",
        day: "2-digit",
        month: "short",
    }).format(date);
}
