import { useState, useEffect, useRef, useCallback } from "react";
import {
  MessageCircle,
  X,
  Send,
  Trash2,
  Settings,
  Eye,
  EyeOff,
} from "lucide-react";
import Markdown from "react-markdown";
import { useChatApi } from "@/hooks/useChatApi";
import { MODEL_OPTIONS } from "@/hooks/useChatSettings";
import { getPageContext } from "@/lib/chatContext";
import { useLocation } from "wouter";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [confirmClear, setConfirmClear] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [location] = useLocation();
  const {
    messages,
    sendMessage,
    cancelStream,
    clearHistory,
    isStreaming,
    mode,
    chatSettings,
  } = useChatApi();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const pageContext = getPageContext(location);

  // メッセージ追加時に自動スクロール
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // パネルを開いたときにinputにフォーカス
  useEffect(() => {
    if (open && !showSettings) {
      const timer = setTimeout(() => inputRef.current?.focus(), 250);
      return () => clearTimeout(timer);
    }
  }, [open, showSettings]);

  // Escape でパネルを閉じる
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === "Escape" && open) {
        if (showSettings) {
          setShowSettings(false);
        } else {
          setOpen(false);
          setConfirmClear(false);
        }
      }
    }
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, showSettings]);

  // Cmd/Ctrl+Shift+C でトグル
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (
        (e.metaKey || e.ctrlKey) &&
        e.shiftKey &&
        (e.key === "c" || e.key === "C")
      ) {
        const selection = window.getSelection();
        if (selection && selection.toString().length > 0) return;
        e.preventDefault();
        setOpen((v) => !v);
      }
    }
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  // メッセージ送信
  const handleSend = useCallback(() => {
    const text = input.trim();
    if (!text || isStreaming) return;
    setInput("");
    sendMessage(text);
  }, [input, isStreaming, sendMessage]);

  // Enter で送信
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  // 履歴クリア
  const handleClear = useCallback(() => {
    if (isStreaming) {
      cancelStream();
      return;
    }
    if (confirmClear) {
      clearHistory();
      setConfirmClear(false);
    } else {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 3000);
    }
  }, [confirmClear, clearHistory, isStreaming, cancelStream]);

  return (
    <>
      {/* チャットパネル */}
      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="AI チャットサポート"
          className="fixed bottom-20 right-6 z-40 w-80 md:w-96 max-h-[60vh] max-sm:left-4 max-sm:right-4 max-sm:w-auto bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-chat-panel-in"
        >
          {/* ヘッダー */}
          <div className="px-4 py-3 border-b border-border bg-card flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-sm font-semibold text-foreground">
                AI サポート
              </span>
              <span
                className={`w-1.5 h-1.5 rounded-full ${mode === "ai" ? "bg-green-500" : "bg-zinc-400"}`}
                title={mode === "ai" ? "AI 接続中" : "FAQ モード"}
              />
              {pageContext.title && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground truncate max-w-[140px]">
                  {pageContext.title}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowSettings((v) => !v)}
                className={`p-1.5 rounded-lg transition-colors ${showSettings ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
                aria-label="設定"
                title="モデル設定"
              >
                <Settings size={14} />
              </button>
              {messages.length > 0 && (
                <button
                  onClick={handleClear}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  title={
                    isStreaming
                      ? "応答を中止"
                      : confirmClear
                        ? "もう一度押して確認"
                        : "履歴をクリア"
                  }
                  aria-label={
                    isStreaming ? "応答を中止" : "チャット履歴をクリア"
                  }
                >
                  <Trash2
                    size={14}
                    className={confirmClear ? "text-red-500" : ""}
                  />
                </button>
              )}
              <button
                onClick={() => {
                  setOpen(false);
                  setConfirmClear(false);
                  setShowSettings(false);
                }}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label="チャットを閉じる"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* 設定パネル */}
          {showSettings && (
            <div className="px-4 py-3 border-b border-border bg-muted/50 space-y-3">
              {/* モデル選択 */}
              <div>
                <label className="text-[11px] text-muted-foreground block mb-1">
                  モデル
                </label>
                <select
                  value={chatSettings.modelId}
                  onChange={(e) => chatSettings.setModelId(e.target.value)}
                  className="w-full px-2 py-1.5 rounded-lg border border-border bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {MODEL_OPTIONS.map((opt) => (
                    <option
                      key={opt.id}
                      value={opt.id}
                      disabled={opt.requiresUserKey && !chatSettings.userApiKey}
                    >
                      {opt.label}
                      {opt.requiresUserKey ? " (要キー)" : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* API キー入力 */}
              <div>
                <label className="text-[11px] text-muted-foreground block mb-1">
                  API キー（GPT-5.4 Mini 利用時）
                </label>
                <div className="flex gap-1">
                  <input
                    type={showApiKey ? "text" : "password"}
                    value={chatSettings.userApiKey}
                    onChange={(e) => chatSettings.setUserApiKey(e.target.value)}
                    placeholder="sk-..."
                    className="flex-1 px-2 py-1.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                  />
                  <button
                    onClick={() => setShowApiKey((v) => !v)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    aria-label={showApiKey ? "キーを隠す" : "キーを表示"}
                  >
                    {showApiKey ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">
                  キーはブラウザにのみ保存されます
                </p>
              </div>
            </div>
          )}

          {/* メッセージエリア */}
          <div
            className="flex-1 overflow-y-auto p-4 space-y-3"
            aria-live="polite"
          >
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">
                質問を入力してください
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-2xl rounded-br-sm px-4 py-2 ml-8 text-sm"
                      : "bg-muted text-foreground rounded-2xl rounded-bl-sm px-4 py-2 mr-8 text-sm"
                  }
                >
                  {msg.role === "assistant" ? (
                    <Markdown
                      components={{
                        a: ({ href, children }) => (
                          <a
                            href={href}
                            className="text-primary underline underline-offset-2"
                          >
                            {children}
                          </a>
                        ),
                        code: ({ children, className }) => {
                          const isBlock = className?.includes("language-");
                          return isBlock ? (
                            <pre className="bg-background/50 rounded-lg p-2 my-1 overflow-x-auto text-xs">
                              <code>{children}</code>
                            </pre>
                          ) : (
                            <code className="bg-background/50 rounded px-1 py-0.5 text-xs">
                              {children}
                            </code>
                          );
                        },
                        p: ({ children }) => (
                          <p className="mb-1 last:mb-0">{children}</p>
                        ),
                        ul: ({ children }) => (
                          <ul className="list-disc pl-4 mb-1">{children}</ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="list-decimal pl-4 mb-1">{children}</ol>
                        ),
                      }}
                    >
                      {msg.content}
                    </Markdown>
                  ) : (
                    msg.content
                  )}
                </div>
              ))
            )}
            {isStreaming &&
              messages.length > 0 &&
              messages[messages.length - 1]?.content === "" && (
                <div className="bg-muted text-muted-foreground rounded-2xl rounded-bl-sm px-4 py-2 mr-8 text-sm">
                  <span className="inline-flex gap-1">
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </span>
                </div>
              )}
            <div ref={messagesEndRef} />
          </div>

          {/* 入力エリア */}
          <div className="px-4 py-3 border-t border-border flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="質問を入力..."
              className="flex-1 px-3 py-2 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              disabled={isStreaming}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isStreaming}
              className="p-2 rounded-xl bg-primary text-primary-foreground disabled:opacity-50 transition-colors"
              aria-label="送信"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      {/* フローティングボタン */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
        aria-label={
          open ? "チャットサポートを閉じる" : "チャットサポートを開く"
        }
      >
        {open ? <X size={20} /> : <MessageCircle size={20} />}
      </button>

      {/* アニメーション用スタイル */}
      <style>{`
        @keyframes chat-panel-in {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-chat-panel-in {
          animation: chat-panel-in 0.2s ease-out;
        }
      `}</style>
    </>
  );
}
