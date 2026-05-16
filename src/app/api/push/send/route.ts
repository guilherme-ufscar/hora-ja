import { NextResponse } from "next/server";

export async function POST() {
    return NextResponse.json({ ok: false, message: "Alertas push em background foram desativados. Use alertas locais no navegador." }, { status: 410 });
}
