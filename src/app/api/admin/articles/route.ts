import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { cookies } from "next/headers";

async function isAuth() {
    const jar = await cookies();
    return jar.get("admin_auth")?.value === process.env.ADMIN_SECRET;
}

export async function GET(req: NextRequest) {
    if (!await isAuth()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 10);
    const limit = 20;
    const offset = (page - 1) * limit;
    const search = req.nextUrl.searchParams.get("q") || "";

    const countRes = await pool.query(
        `SELECT COUNT(*) FROM articles WHERE title ILIKE $1`,
        [`%${search}%`]
    );
    const total = parseInt(countRes.rows[0].count, 10);

    const res = await pool.query(
        `SELECT id, slug, title, summary, category, status, source_name, published_at
         FROM articles WHERE title ILIKE $1
         ORDER BY published_at DESC LIMIT $2 OFFSET $3`,
        [`%${search}%`, limit, offset]
    );

    return NextResponse.json({ articles: res.rows, total, page, limit });
}

export async function POST(req: NextRequest) {
    if (!await isAuth()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { slug, title, summary, content, chart_data, source_url, source_name, category, status } = body;

    const finalSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 80) + "-" + Date.now().toString(36);

    const res = await pool.query(
        `INSERT INTO articles (slug, title, summary, content, chart_data, source_url, source_name, category, status, published_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,NOW())
         RETURNING id, slug`,
        [finalSlug, title, summary, content, chart_data ? JSON.stringify(chart_data) : null, source_url, source_name, category || "economia", status || "published"]
    );

    return NextResponse.json({ ok: true, ...res.rows[0] });
}
