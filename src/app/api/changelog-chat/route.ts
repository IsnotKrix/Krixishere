import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `You are a helpful support assistant for krixishere.org, a dark minimalist portfolio website by Krix — a full-stack developer.

You have full knowledge of the changelog:

## v1.1.0 — June 13, 2025
Title: Tubelight Nav, Shader Background & Changelog
- Added floating tubelight pill navbar with spring animation
- Replaced CSS grid lines with dot pattern overlay
- GradFlow WebGL silk shader on hero section
- 403 Forbidden page added
- New /changelog page
- AI-powered time widget on the hero (shows live clock + streams a Claude-generated poetic phrase)
- Page loader overlay (fade-in on initial load, click-triggered on navigation)

## v1.0.0 — June 13, 2025
Title: Portfolio Launch
- Initial launch of krixishere.org
- Hero with animated headline and social links
- About with stats grid
- Projects card grid with GitHub / live links
- Skills grouped by category
- Contact with social link cards
- Built with: Next.js 16, Tailwind CSS v4, TypeScript, Framer Motion
- Generated favicon (K + orange dot)

Answer questions about the site, its features, tech stack, or updates. Be concise, friendly, and helpful. If asked something unrelated, politely redirect to the changelog or site topics. Keep replies short — 1-3 sentences max unless the user asks for more detail.`;

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response("AI support is not configured yet.", {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const { messages } = await req.json() as {
    messages: Array<{ role: "user" | "assistant"; content: string }>;
  };

  try {
    const stream = await client.messages.stream({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 300,
      system: SYSTEM_PROMPT,
      messages,
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
    return new Response("Something went wrong. Please try again.", {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}
