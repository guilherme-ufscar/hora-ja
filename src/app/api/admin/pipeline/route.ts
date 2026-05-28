import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { runNewsPipeline } from "@/lib/news-pipeline";

async function isAuth() {
    const jar = await cookies();
    return jar.get("admin_auth")?.value === process.env.ADMIN_SECRET;
}

export const maxDuration = 300;

export async function POST() {
    if (!await isAuth()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    try {
        const result = await runNewsPipeline();
        return NextResponse.json({ ok: true, ...result });
    } catch (err) {
        return NextResponse.json({ error: String(err) }, { status: 500 });
    }
}
