"use client";
import { useState } from "react";

export default function VideoInput({ onResult }: { onResult: (data: any) => void }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleProcess = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url })
      });
      const json = await res.json();
      if (json.error) setError(json.error);
      else onResult(json);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <input
        className="border p-2 rounded w-full"
        placeholder="Paste YouTube or public video link..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <div className="flex items-center gap-3">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleProcess}
          disabled={loading}
        >
          {loading ? "Processing..." : "Generate Study Pack"}
        </button>
        <span className="text-sm text-gray-500">or upload a video below (not implemented ASR in MVP)</span>
      </div>
      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
}
