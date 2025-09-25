"use client";
import { useState } from "react";

export default function Quiz({ raw }: { raw: string }) {
  const [answers, setAnswers] = useState<Record<number, string>>({});

  let items: any[] = [];
  try {
    // Try parsing JSON
    const parsed = JSON.parse(raw.trim());
    if (Array.isArray(parsed)) items = parsed;
  } catch {
    // fallback: raw text (Gemini might return plain text)
    return (
      <div className="prose whitespace-pre-wrap max-w-none">
        {raw}
      </div>
    );
  }

  if (!items.length) return <div>No quiz available</div>;

  const handleSelect = (i: number, opt: string) => {
    setAnswers((s) => ({ ...s, [i]: opt }));
  };

  return (
    <div className="space-y-4">
      {items.map((it, i) => (
        <div key={i} className="border rounded p-3">
          <div className="font-medium">
            {i + 1}. {it.question}
          </div>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {it.options?.map((opt: string, idx: number) => (
              <button
                key={idx}
                onClick={() => handleSelect(i, opt)}
                className={`p-2 border rounded text-left ${
                  answers[i] === opt ? "bg-blue-50 border-blue-400" : ""
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
          {answers[i] && (
            <div className="mt-2 text-sm">
              Your answer: <strong>{answers[i]}</strong>. Correct: <strong>{it.answer}</strong>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
