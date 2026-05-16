import { NextResponse } from "next/server";

export async function POST() {
    return NextResponse.json({ ok: false, message: "Alertas server-side foram removidos. Use alertas locais no navegador." }, { status: 410 });
}

export async function DELETE() {
    return NextResponse.json({ ok: false, message: "Alertas server-side foram removidos. Use alertas locais no navegador." }, { status: 410 });
}
