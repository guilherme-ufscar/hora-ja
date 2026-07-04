import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { sendEmail } from "@/lib/notifications";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get("type"); // 'email'
        const value = searchParams.get("value");

        if (!type || !value) {
            return NextResponse.json({ rules: [] });
        }

        const res = await pool.query(
            `SELECT id, type, value, currency_code, condition_type, condition_value, created_at
             FROM notification_rules
             WHERE type = $1 AND value = $2 AND active = true
             ORDER BY created_at DESC`,
            [type, value]
        );

        return NextResponse.json({ rules: res.rows });
    } catch (error) {
        console.error("Erro ao buscar inscrições:", error);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            type,           // 'email'
            value,          // email address
            currency_code,   // Moeda/cripto para monitorar
            condition_type,  // 'price_above', 'price_below', 'change_percent'
            condition_value, // Valor ou percentual
            name            // Nome opcional
        } = body;

        // Validar campos obrigatórios
        if (!type || !value || !currency_code || !condition_type || condition_value === undefined) {
            return NextResponse.json({ error: "Campos obrigatórios faltando" }, { status: 400 });
        }

        // Validar tipo de contato
        if (type !== "email") {
            return NextResponse.json({ error: "Tipo inválido" }, { status: 400 });
        }

        // Validar email
        if (!value.includes("@")) {
            return NextResponse.json({ error: "Email inválido" }, { status: 400 });
        }

        // Verificar se já existe uma regra igual
        const existing = await pool.query(
            `SELECT id FROM notification_rules
             WHERE type = $1 AND value = $2 AND currency_code = $3
             AND condition_type = $4 AND condition_value = $5 AND active = true`,
            [type, value, currency_code, condition_type, condition_value]
        );

        if (existing.rows.length > 0) {
            return NextResponse.json({ error: "Esta regra já está ativa" }, { status: 409 });
        }

        // Salvar inscrição
        const result = await pool.query(
            `INSERT INTO notification_rules
             (type, value, currency_code, condition_type, condition_value, name, active)
             VALUES ($1, $2, $3, $4, $5, $6, true)
             RETURNING id, type, value, currency_code, condition_type, condition_value, created_at`,
            [type, value, currency_code, condition_type, condition_value, name || null]
        );

        return NextResponse.json({
            success: true,
            message: "Notificação configurada com sucesso!",
            rule: result.rows[0]
        });
    } catch (error) {
        console.error("Erro ao salvar regra:", error);
        return NextResponse.json({ error: "Erro interno ao processar" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        const type = searchParams.get("type");
        const value = searchParams.get("value");

        if (!id && !(type && value)) {
            return NextResponse.json({ error: "ID ou tipo+valor requeridos" }, { status: 400 });
        }

        if (id) {
            await pool.query("DELETE FROM notification_rules WHERE id = $1", [id]);
        } else {
            await pool.query(
                "DELETE FROM notification_rules WHERE type = $1 AND value = $2",
                [type, value]
            );
        }

        return NextResponse.json({ success: true, message: "Inscrição cancelada" });
    } catch (error) {
        console.error("Erro ao deletar regra:", error);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}
