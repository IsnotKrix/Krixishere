import Anthropic from "@anthropic-ai/sdk";

export async function GET(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response("time flows quietly", {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const { searchParams } = new URL(req.url);
  const hour = parseInt(searchParams.get("hour") ?? "12", 10);
  const minute = parseInt(searchParams.get("minute") ?? "0", 10);

  const period =
    hour < 6
      ? "late night"
      : hour < 12
        ? "morning"
        : hour < 17
          ? "afternoon"
          : hour < 21
            ? "evening"
            : "night";

  const timeStr = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;

  try {
    const stream = await client.messages.stream({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 40,
      messages: [
        {
          role: "user",
          content: `It is ${timeStr} (${period}). Write exactly one short poetic phrase about this moment in time. Max 8 words. No punctuation at the end. No quotes.`,
        },
      ],
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          if (
            chunk.type === "content_block_delta" &&
            chunk.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(chunk.delta.text));
          }
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch {
    return new Response("time flows quietly", {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}
