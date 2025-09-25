"use client";
import { useState } from "react";

export default function Flashcards({ raw }: { raw: string }) {
  const [index, setIndex] = useState(0);

  // Try to parse JSON, otherwise split by newline pairs
  let cards: { q: string; a: string }[] = [];
  try {
    const maybe = JSON.parse(raw);
    if (Array.isArray(maybe)) {
      cards = maybe.map((c: any) => ({ q: c.q || c.question || c.Q || "", a: c.a || c.answer || c.A || "" }));
    }
  } catch {
    // fallback parse: lines of "Q: ... A: ..."
    const lines = raw.split("\n").filter(Boolean);
    for (let i = 0; i < lines.length; i += 2) {
      cards.push({ q: (lines[i] || "").replace(/^Q:\s*/i, ""), a: (lines[i + 1] || "").replace(/^A:\s*/i, "") });
    }
  }

  if (!cards.length) return <div>No flashcards available.</div>;

  const card = cards[index % cards.length];

  return (
    <div>
      <div className="border rounded p-4 shadow-sm">
        <div className="text-lg font-medium mb-2">Q: {card.q}</div>
        <details>
          <summary className="cursor-pointer text-blue-600">Show answer</summary>
          <div className="mt-2">A: {card.a}</div>
        </details>
      </div>
      <div className="flex gap-2 mt-3">
        <button className="px-3 py-1 border rounded" onClick={() => setIndex((i) => (i - 1 + cards.length) % cards.length)}>Prev</button>
        <button className="px-3 py-1 border rounded" onClick={() => setIndex((i) => (i + 1) % cards.length)}>Next</button>
      </div>
    </div>
  );
}
