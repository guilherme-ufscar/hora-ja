import { quoteCache } from '@/lib/quote-cache';
import type { AppCurrencyData } from '@/lib/api';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
    quoteCache.start();

    const encoder = new TextEncoder();
    let cleanup: (() => void) | null = null;

    const stream = new ReadableStream({
        start(controller) {
            // Envia snapshot atual imediatamente se já estiver populado
            const snap = quoteCache.get();
            if (Object.keys(snap).length > 0) {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify(snap)}\n\n`));
            }

            const handler = (data: Record<string, AppCurrencyData>) => {
                try {
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
                } catch {
                    // cliente desconectou
                }
            };

            quoteCache.on('update', handler);
            cleanup = () => quoteCache.off('update', handler);
        },
        cancel() {
            cleanup?.();
        },
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-transform',
            'Connection': 'keep-alive',
            'X-Accel-Buffering': 'no',
        },
    });
}
