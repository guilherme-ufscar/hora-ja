import { NextRequest, NextResponse } from "next/server";
import { runMigrations } from "@/lib/db";
import { runNewsPipeline } from "@/lib/news-pipeline";

export const maxDuration = 300;

export async function POST(req: NextRequest) {
    const secret = req.headers.get("x-pipeline-secret") || req.nextUrl.searchParams.get("secret");
    if (secret !== process.env.PIPELINE_SECRET) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await runMigrations();
        const result = await runNewsPipeline();
        return NextResponse.json({ ok: true, ...result });
    } catch (err) {
        return NextResponse.json({ error: String(err) }, { status: 500 });
    }
}
