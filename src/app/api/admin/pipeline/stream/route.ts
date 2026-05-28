import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { runNewsPipeline, type PipelineEvent } from "@/lib/news-pipeline";

export const maxDuration = 300;

export async function GET() {
    const jar = await cookies();
    if (jar.get("admin_auth")?.value !== process.env.ADMIN_SECRET) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const stream = new ReadableStream({
        async start(controller) {
            const send = (event: PipelineEvent) => {
                controller.enqueue(`data: ${JSON.stringify(event)}\n\n`);
            };

            try {
                await runNewsPipeline(send);
            } catch (err) {
                controller.enqueue(`data: ${JSON.stringify({ type: "error", message: String(err) })}\n\n`);
            } finally {
                controller.close();
            }
        },
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
        },
    });
}
