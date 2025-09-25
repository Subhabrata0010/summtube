"use client";
import { useState } from "react";

export default function ChatBot({ packId }: { packId: string }) {
  const [q, setQ] = useState("");
  const [messages, setMessages] = useState<{ q: string; a: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ask = async () => {
    if (!q) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packId, question: q }),
      });

      const json = await res.json();
      if (json.error) setError(json.error);
      else if (json.answer) {
        setMessages((m) => [{ q, a: json.answer }, ...m]);
        setQ("");
      }
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Input */}
      <div className="flex gap-2">
        <input
          className="flex-1 border p-2 rounded"
          placeholder="Ask a question about the video..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && ask()}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={ask}
          disabled={loading || !q}
        >
          {loading ? "..." : "Ask"}
        </button>
      </div>

      {/* Error */}
      {error && <div className="text-red-600 text-sm">{error}</div>}

      {/* Messages */}
      <div className="mt-4 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className="border rounded p-3">
            <div className="text-sm text-gray-600">Q: {m.q}</div>
            <div className="mt-1">A: {m.a}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
