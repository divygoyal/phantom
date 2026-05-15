import { runReelFromUrl } from "@/lib/reel";

export const dynamic = "force-dynamic";
export const maxDuration = 600; // Allow long-running reel generation

export async function POST(request: Request) {
  let url: string | undefined;
  try {
    const body = await request.json();
    url = body.url;
  } catch {
    return new Response("Invalid JSON body", { status: 400 });
  }
  if (!url || typeof url !== "string") {
    return new Response("Missing url in body", { status: 400 });
  }
  try {
    new URL(url);
  } catch {
    return new Response("Invalid url", { status: 400 });
  }

  const targetUrl = url;
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of runReelFromUrl(targetUrl)) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
        }
        controller.enqueue(encoder.encode(`event: done\ndata: {}\n\n`));
      } catch (err) {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              step: "error",
              tool: "system",
              label: "Reel pipeline failed",
              status: "failed",
              output: String(err instanceof Error ? err.message : err),
            })}\n\n`
          )
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
      Connection: "keep-alive",
    },
  });
}
