/**
 * Formata um valor numérico ou string para o formato de moeda Real (BRL).
 */
export function formatCurrency(value: string | number): string {
    const numericValue = typeof value === "string" ? parseFloat(value) : value;

    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(numericValue);
}

/**
 * Formata a variação percentual com sinal explícito e duas casas decimais.
 */
export function formatPercentage(pctChange: string | number): string {
    const numericValue = typeof pctChange === "string" ? parseFloat(pctChange) : pctChange;
    const isPositive = numericValue >= 0;

    return `${isPositive ? "+" : ""}${numericValue.toFixed(2)}%`;
}

/**
 * Formata um timestamp (ex: "2023-10-25 14:30:00") para um formato amigável.
 * O formato retornado será: "25 de outubro, às 14:30".
 */
export function formatLastUpdate(dateString: string): string {
    try {
        // Adicionar T e Z se não existirem para parsear corretamente no JS
        // A AwesomeAPI retorna o padrão "YYYY-MM-DD HH:MM:SS" local para BR.
        // Vamos converter o espaço em 'T' e forçar UTC-3 se quisermos extrema precisão,
        // mas o Date normal costuma lidar bem se o servidor estiver no mesmo fuso.
        // Para garantir (tratar no cliente):
        const normalizedDateString = dateString.replace(" ", "T") + "-03:00";

        const date = new Date(normalizedDateString);

        if (isNaN(date.getTime())) {
            return dateString; // fallback caso dê erro de parse
        }

        const formatter = new Intl.DateTimeFormat("pt-BR", {
            timeZone: "America/Sao_Paulo",
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
        });

        const parts = formatter.formatToParts(date);
        const day = parts.find(p => p.type === "day")?.value;
        const month = parts.find(p => p.type === "month")?.value;
        const hour = parts.find(p => p.type === "hour")?.value;
        const minute = parts.find(p => p.type === "minute")?.value;

        return `${day} de ${month}, às ${hour}:${minute}`;
    } catch (error) {
        return dateString;
    }
}
