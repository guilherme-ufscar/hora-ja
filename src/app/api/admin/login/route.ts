import { NextRequest, NextResponse } from "next/server";
import { runMigrations } from "@/lib/db";

export async function POST(req: NextRequest) {
    const { password } = await req.json();
    if (password !== process.env.ADMIN_PASSWORD) {
        return NextResponse.json({ error: "Senha incorreta" }, { status: 401 });
    }

    await runMigrations();

    const res = NextResponse.json({ ok: true });
    res.cookies.set("admin_auth", process.env.ADMIN_SECRET!, {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
        sameSite: "lax",
    });
    return res;
}
