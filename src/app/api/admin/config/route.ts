import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { cookies } from "next/headers";

async function isAuth() {
    const jar = await cookies();
    return jar.get("admin_auth")?.value === process.env.ADMIN_SECRET;
}

export async function GET() {
    if (!await isAuth()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const res = await pool.query("SELECT key, value FROM app_config");
    const config: Record<string, string> = {};
    for (const row of res.rows) config[row.key] = row.value;
    return NextResponse.json(config);
}

export async function POST(req: NextRequest) {
    if (!await isAuth()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await req.json() as Record<string, string>;
    for (const [key, value] of Object.entries(body)) {
        await pool.query(
            `INSERT INTO app_config (key, value, updated_at) VALUES ($1,$2,NOW())
             ON CONFLICT (key) DO UPDATE SET value=$2, updated_at=NOW()`,
            [key, value]
        );
    }
    return NextResponse.json({ ok: true });
}
