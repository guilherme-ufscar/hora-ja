import { NextResponse } from "next/server";

export async function POST() {
    return NextResponse.json({ ok: false, message: "Checagem server-side removida. Os alertas agora são locais no navegador." }, { status: 410 });
}
