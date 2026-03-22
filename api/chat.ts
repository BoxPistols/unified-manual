import type { VercelRequest, VercelResponse } from "@vercel/node";
import OpenAI from "openai";

interface ChatRequestBody {
  messages: { role: "user" | "assistant"; content: string }[];
  systemPrompt: string;
  model?: string;
  provider?: "openai" | "gemini";
  userApiKey?: string;
}

// ユーザーキー必須のモデル
const PREMIUM_MODELS = ["gpt-5.4-mini", "gpt-5.4"];

// プロバイダー別設定
function getClient(
  provider: string,
  userApiKey?: string,
): { client: OpenAI; defaultModel: string } | null {
  if (provider === "gemini") {
    const apiKey = userApiKey || process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    return {
      client: new OpenAI({
        apiKey,
        baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
      }),
      defaultModel: "gemini-2.5-flash",
    };
  }

  // OpenAI（デフォルト）
  const apiKey = userApiKey || process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  return {
    client: new OpenAI({ apiKey }),
    defaultModel: "gpt-5.4-nano",
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { messages, systemPrompt, model, provider, userApiKey } =
    req.body as ChatRequestBody;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "messages is required" });
  }

  const resolvedProvider = provider || "openai";

  // プレミアムモデルはユーザーキー必須
  if (model && PREMIUM_MODELS.includes(model) && !userApiKey) {
    return res
      .status(403)
      .json({ error: "このモデルの利用には API キーの設定が必要です" });
  }

  const config = getClient(resolvedProvider, userApiKey);
  if (!config) {
    return res.status(503).json({ error: "API key not configured" });
  }

  const resolvedModel = model || config.defaultModel;

  // SSE ヘッダー
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    const stream = await config.client.chat.completions.create({
      model: resolvedModel,
      max_completion_tokens: 1024,
      stream: true,
      messages: [
        { role: "system", content: systemPrompt || "" },
        ...messages.map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
      ],
    });

    for await (const chunk of stream) {
      const text = chunk.choices[0]?.delta?.content;
      if (text) {
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
      }
    }

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";

    if (res.headersSent) {
      res.write(`data: ${JSON.stringify({ error: message })}\n\n`);
      res.end();
    } else {
      res.status(500).json({ error: message });
    }
  }
}
