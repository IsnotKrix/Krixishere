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
  const apiKey = process.env.TOMDACAT_API_KEY;
  if (!apiKey) {
    return new Response("AI support is not configured yet.", {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const MODEL_MAP: Record<string, string> = {
    sonnet:          "claude-sonnet-4-6",
    haiku:           "claude-haiku-4-5-20251001",
    "gpt-5-mini":    "gpt-5-mini",
    "gemini-3-flash": "gemini-3-flash",
  };

  const { messages, model: modelId = "sonnet" } = (await req.json()) as {
    messages: Array<{ role: "user" | "assistant"; content: string }>;
    model?: string;
  };

  const model = MODEL_MAP[modelId] ?? MODEL_MAP.sonnet;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };
  if (process.env.TOMDACAT_API_KEY_PASSWORD) {
    headers["X-Api-Key-Password"] = process.env.TOMDACAT_API_KEY_PASSWORD;
  }

  try {
    const upstream = await fetch("https://ai.tomdacat.com/api/chat", {
      method: "POST",
      headers,
      body: JSON.stringify({
        model,
        stream: true,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
      }),
    });

    if (!upstream.ok || !upstream.body) {
      return new Response("Something went wrong. Please try again.", {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }

    // Parse OpenAI-compatible SSE and forward only the text deltas
    const encoder = new TextEncoder();
    const reader = upstream.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    const readable = new ReadableStream({
      async start(controller) {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });

            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";

            for (const line of lines) {
              if (!line.startsWith("data: ")) continue;
              const data = line.slice(6).trim();
              if (data === "[DONE]") continue;
              try {
                const json = JSON.parse(data) as {
                  choices?: Array<{ delta?: { content?: string } }>;
                };
                const text = json.choices?.[0]?.delta?.content;
                if (text) controller.enqueue(encoder.encode(text));
              } catch {
                // malformed SSE chunk — skip
              }
            }
          }
        } finally {
          controller.close();
        }
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
