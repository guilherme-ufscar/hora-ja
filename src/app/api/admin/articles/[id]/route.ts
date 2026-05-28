import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { cookies } from "next/headers";

async function isAuth() {
    const jar = await cookies();
    return jar.get("admin_auth")?.value === process.env.ADMIN_SECRET;
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    if (!await isAuth()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    const res = await pool.query("SELECT * FROM articles WHERE id = $1", [id]);
    if (!res.rows[0]) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(res.rows[0]);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    if (!await isAuth()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    const body = await req.json();
    const { title, summary, content, chart_data, category, status } = body;

    await pool.query(
        `UPDATE articles SET title=$1, summary=$2, content=$3, chart_data=$4, category=$5, status=$6
         WHERE id=$7`,
        [title, summary, content, chart_data ? JSON.stringify(chart_data) : null, category, status, id]
    );
    return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    if (!await isAuth()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    await pool.query("DELETE FROM articles WHERE id = $1", [id]);
    return NextResponse.json({ ok: true });
}
