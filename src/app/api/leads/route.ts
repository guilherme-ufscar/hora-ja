import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, name } = body;

        if (!email || !email.includes("@")) {
            return NextResponse.json({ error: "Email inválido" }, { status: 400 });
        }

        // Verificar se já existe
        const existing = await pool.query(
            "SELECT id FROM leads WHERE email = $1",
            [email.toLowerCase().trim()]
        );

        if (existing.rows.length > 0) {
            return NextResponse.json({ error: "Este email já está cadastrado" }, { status: 409 });
        }

        // Salvar no banco
        const result = await pool.query(
            `INSERT INTO leads (email, name, ip_address, user_agent)
             VALUES ($1, $2, $3, $4)
             RETURNING id, email, created_at`,
            [
                email.toLowerCase().trim(),
                name?.trim() || null,
                request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || null,
                request.headers.get("user-agent") || null,
            ]
        );

        // Enviar notificação por email (opcional - requer SMTP configurado)
        const lead = result.rows[0];
        await sendNotificationEmail(lead.email, lead.name);

        return NextResponse.json({
            success: true,
            message: "Email cadastrado com sucesso",
            lead,
        });
    } catch (error) {
        console.error("Erro ao salvar lead:", error);
        return NextResponse.json({ error: "Erro interno ao processar" }, { status: 500 });
    }
}

async function sendNotificationEmail(email: string, name: string | null) {
    // Esta função pode ser implementada com um serviço de email como:
    // - Resend (resend.com)
    // - SendGrid
    // - AWS SES
    // - Nodemailer com SMTP

    // Por enquanto, apenas logamos (em produção, descomente e configure)
    console.log("📧 Novo lead cadastrado:", {
        email,
        name: name || "Não informado",
        timestamp: new Date().toISOString(),
    });

    /* Exemplo com Resend:
    import { Resend } from "resend";
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
        from: "Leads <leads@horajacambio.com.br>",
        to: "contato@horajacambio.com.br",
        subject: "🎯 Novo lead cadastrado no HoraJá Cambio",
        html: `
            <h2>Novo Lead</h2>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Nome:</strong> ${name || "Não informado"}</p>
            <p><strong>Data:</strong> ${new Date().toLocaleString("pt-BR")}</p>
        `,
    });
    */
}

export async function GET() {
    try {
        const res = await pool.query(
            `SELECT id, email, name, ip_address, created_at
             FROM leads
             ORDER BY created_at DESC`
        );

        return NextResponse.json({ leads: res.rows });
    } catch (error) {
        console.error("Erro ao buscar leads:", error);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}
