import pool from "./db";

interface NotificationRule {
    id: number;
    type: "email" | "whatsapp";
    value: string;
    currency_code: string;
    condition_type: "price_above" | "price_below" | "change_percent";
    condition_value: number;
    name: string | null;
}

interface CurrencyData {
    code: string;
    price: number;
    change24h?: number;
}

export async function checkAndSendNotifications() {
    try {
        // Buscar todas as regras ativas
        const rules = await pool.query(
            `SELECT * FROM notification_rules WHERE active = true`
        );

        if (rules.rows.length === 0) {
            console.log("Nenhuma notificação para verificar");
            return;
        }

        console.log(`Verificando ${rules.rows.length} regras de notificação...`);

        // Buscar cotações atuais (simulado - em produção buscar da API)
        const currencies = await getCurrentPrices();

        for (const rule of rules.rows) {
            const currency = currencies[rule.currency_code];
            if (!currency) continue;

            const shouldNotify = evaluateCondition(rule, currency);

            if (shouldNotify) {
                await sendNotification(rule, currency);

                // Marcar como enviada (desativar ou registrar envio)
                await pool.query(
                    `UPDATE notification_rules SET active = false WHERE id = $1`,
                    [rule.id]
                );
            }
        }
    } catch (error) {
        console.error("Erro ao verificar notificações:", error);
    }
}

function getCurrentPrices(): Record<string, CurrencyData> {
    // Em produção, buscar da API real
    // Por ora, retorna dados simulados
    return {
        USD: { code: "USD", price: 5.22, change24h: 0.89 },
        EUR: { code: "EUR", price: 5.94, change24h: 0.59 },
        GBP: { code: "GBP", price: 6.93, change24h: -0.03 },
        ARS: { code: "ARS", price: 0.0058, change24h: 0.2 },
        CAD: { code: "CAD", price: 3.85, change24h: 0.45 },
        CHF: { code: "CHF", price: 6.12, change24h: 0.3 },
        JPY: { code: "JPY", price: 0.033, change24h: -0.15 },
        CNY: { code: "CNY", price: 0.72, change24h: 0.1 },
        BTC: { code: "BTC", price: 635000, change24h: 2.5 },
        ETH: { code: "ETH", price: 18500, change24h: 1.8 },
        SOL: { code: "SOL", price: 145, change24h: 3.2 },
        XRP: { code: "XRP", price: 3.5, change24h: -1.2 },
        ADA: { code: "ADA", price: 2.85, change24h: 0.9 },
        DOT: { code: "DOT", price: 42, change24h: 1.1 },
    };
}

function evaluateCondition(rule: NotificationRule, currency: CurrencyData): boolean {
    const { condition_type, condition_value } = rule;

    switch (condition_type) {
        case "price_above":
            return currency.price >= condition_value;
        case "price_below":
            return currency.price <= condition_value;
        case "change_percent":
            return Math.abs(currency.change24h || 0) >= Math.abs(condition_value);
        default:
            return false;
    }
}

async function sendNotification(rule: NotificationRule, currency: CurrencyData) {
    const { type, value, currency_code, condition_type, condition_value } = rule;

    const conditionLabels: Record<string, string> = {
        price_above: "subiu acima de",
        price_below: "caiu abaixo de",
        change_percent: "variou",
    };

    const prefix = condition_type === "change_percent" ? "" : "R$ ";
    const suffix = condition_type === "change_percent" ? "%" : "";

    const message = `🔔 *HoraJá Cambio*\n\n` +
        `A moeda ${currency_code} ${conditionLabels[condition_type]} ${prefix}${condition_value}${suffix}!\n\n` +
        `Valor atual: R$ ${currency.price.toLocaleString("pt-BR")}\n` +
        `Variação: ${currency.change24h?.toFixed(2) || 0}%`;

    if (type === "email") {
        await sendEmail(value, `Alerta: ${currency_code}`, message);
    } else if (type === "whatsapp") {
        await sendWhatsApp(value, message);
    }
}

export async function sendEmail(to: string, subject: string, text: string) {
    // Implementar com Resend, SendGrid, AWS SES, etc.
    console.log(`📧 Enviando email para ${to}:`, subject);

    /* Exemplo com Resend:
    import { Resend } from "resend";
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
        from: "Alertas <alertas@horajacambio.com.br>",
        to: to,
        subject: subject,
        text: text.replace(/[*_]/g, ""), // Remove formatação markdown
    });
    */
}

export async function sendWhatsApp(phoneNumber: string, message: string) {
    // Implementar com Twilio WhatsApp Business API
    console.log(`💬 Enviando WhatsApp para ${phoneNumber}:`, message);

    /* Exemplo com Twilio:
    const twilio = require("twilio");

    const client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
    );

    // Formatar número para WhatsApp (remover caracteres não numéricos)
    const cleanNumber = phoneNumber.replace(/\D/g, "");

    await client.messages.create({
        body: message.replace(/[*_]/g, ""), // Remove formatação markdown
        from: `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`, // Ex: "whatsapp:+14155238886"
        to: `whatsapp:+55${cleanNumber}`,
    });

    /* Alternativa com Twilio usando template:
    await client.messages.create({
        contentSid: process.env.TWILIO_CONTENT_SID, // Template pré-aprovado
        from: `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`,
        to: `whatsapp:+55${cleanNumber}`,
        contentVariables: JSON.stringify({
            "1": currency_code,
            "2": currency.price.toString()
        })
    });
    */
}

export async function runNotificationCheck() {
    await checkAndSendNotifications();
}
