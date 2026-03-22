import { useState, useCallback, useRef } from "react";
import { useLocation } from "wouter";
import { getEnrichedPageContext } from "@/lib/chatContext";
import { buildSystemPrompt } from "@/lib/chatPrompt";
import { searchFaq, formatFaqResponse } from "@/lib/faqSearch";
import { useChatHistory } from "./useChatHistory";
import { useChatSettings } from "./useChatSettings";

export type ChatMode = "ai" | "faq";

export function useChatApi() {
  const { messages, addMessage, updateLastMessage, clearHistory } =
    useChatHistory();
  const chatSettings = useChatSettings();
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<ChatMode>("ai");
  const [location] = useLocation();
  const abortRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isStreaming) return;

      setError(null);
      addMessage("user", text);

      const ctx = getEnrichedPageContext(location);

      try {
        setIsStreaming(true);

        const controller = new AbortController();
        abortRef.current = controller;

        // 会話履歴を組み立て（直近10件まで）
        const recentMessages = [
          ...messages,
          { role: "user" as const, content: text },
        ]
          .slice(-10)
          .map((m) => ({ role: m.role, content: m.content }));

        const { selectedModel, userApiKey } = chatSettings;

        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: recentMessages,
            systemPrompt: buildSystemPrompt(ctx),
            model: selectedModel.id,
            provider: selectedModel.provider,
            ...(userApiKey ? { userApiKey } : {}),
          }),
          signal: controller.signal,
        });

        // APIキー未設定 → FAQ フォールバック
        if (response.status === 503) {
          setMode("faq");
          const faqResult = searchFaq(text, ctx.manualId);
          if (faqResult) {
            addMessage("assistant", formatFaqResponse(faqResult));
          } else {
            addMessage(
              "assistant",
              "この質問にはお答えできません。サイドバーから関連ページをお探しください。",
            );
          }
          setIsStreaming(false);
          return;
        }

        // ユーザーキー必須モデルでキー未設定
        if (response.status === 403) {
          const data = await response.json();
          addMessage(
            "assistant",
            data.error ||
              "このモデルには API キーが必要です。設定画面からキーを入力してください。",
          );
          setIsStreaming(false);
          return;
        }

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        setMode("ai");

        // ストリーミング受信
        const reader = response.body?.getReader();
        if (!reader) throw new Error("No response body");

        const decoder = new TextDecoder();
        let accumulated = "";
        addMessage("assistant", "");

        let buffer = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith("data: ")) continue;
            const data = trimmed.slice(6);
            if (data === "[DONE]") continue;

            try {
              const parsed = JSON.parse(data);
              if (parsed.error) {
                throw new Error(parsed.error);
              }
              if (parsed.text) {
                accumulated += parsed.text;
                updateLastMessage(accumulated);
              }
            } catch {
              // JSON パースエラーは無視
            }
          }
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }

        // API 接続失敗 → FAQ フォールバック
        setMode("faq");
        const faqResult = searchFaq(text, ctx.manualId);
        if (faqResult) {
          addMessage("assistant", formatFaqResponse(faqResult));
        } else {
          const message =
            err instanceof Error ? err.message : "エラーが発生しました";
          setError(message);
          addMessage(
            "assistant",
            "接続エラーが発生しました。しばらく経ってからもう一度お試しください。",
          );
        }
      } finally {
        setIsStreaming(false);
        abortRef.current = null;
      }
    },
    [
      isStreaming,
      messages,
      location,
      addMessage,
      updateLastMessage,
      chatSettings,
    ],
  );

  const cancelStream = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  return {
    messages,
    sendMessage,
    cancelStream,
    clearHistory,
    isStreaming,
    error,
    mode,
    chatSettings,
  };
}
