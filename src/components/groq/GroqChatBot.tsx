"use client";

import { useState, useRef } from "react";

type Message = { role: "user" | "assistant"; text: string };

export default function GroqChatbot() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<Message[]>([
    {
      role: "assistant",
      text: "Hi there! I'm your Groq assistant. Ask me anything about our products or how to use them.",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const sendMessage = async () => {
    const trimmed = message.trim();
    if (!trimmed || loading) return;

    setChat((prev) => [...prev, { role: "user", text: trimmed }]);
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/groq-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });
      const data = await res.json();
      setChat((prev) => [
        ...prev,
        {
          role: "assistant",
          text: res.ok ? data.reply : data.error || "Something went wrong.",
        },
      ]);
    } catch {
      setChat((prev) => [
        ...prev,
        { role: "assistant", text: "Network error. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const botIcon = (
    <div className="size-7 rounded-full bg-primary/10 text-primary/90 border border-primary/20 flex items-center justify-center shrink-0 text-sm font-semibold">
      AI
    </div>
  );

  return (
    <div className="w-full space-y-4">
      {/* Chat messages */}
      <div className="-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4 space-y-4">
      
        {chat.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
          >
            {msg.role === "assistant" && botIcon}
            <div
              className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-primary text-white rounded-tr-none"
                  : "bg-foreground/5 text-foreground/80 border border-foreground/10 rounded-tl-none"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {/* Loading indicator */}

        {loading && (
          <div className="flex gap-2">
            {botIcon}
            <div className="bg-foreground/5 text-foreground/80 border border-foreground/10 rounded-2xl rounded-tl-none px-4 py-2.5 flex gap-1 items-center">
              <span className="size-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:0ms]" />
              <span className="size-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:150ms]" />
              <span className="size-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Chat input */}
      <div className="px-3 py-3 border-t border-foreground/10 flex items-center gap-2">
      {/* Textarea with auto-resize */}
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ask about products..."
          className="input"
        />
        {/* Send button */}
        <button
          onClick={sendMessage}
          disabled={!message.trim() || loading}
          className="btn btn-primary"
        >
          {loading ? (
            <span className="size-1.5 bg-primary/60 rounded-full animate-bounce" />
          ) : (
            "Send"
          )}
        </button>
      </div>
    </div>
  );
}
