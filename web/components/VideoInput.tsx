"use client";
import { useState } from "react";

export default function VideoInput({ onResult }: { onResult: (data: any) => void }) {
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Process YouTube URL
  const handleUrlProcess = async () => {
    if (!url) return setError("Please enter a URL");
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
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

  // Process uploaded file
  const handleFileProcess = async () => {
    if (!file) return setError("Please select a file");
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/process", {
        method: "POST",
        body: formData,
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
      {/* URL input */}
      <input
        className="border p-2 rounded w-full"
        placeholder="Paste YouTube or public video link..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <div className="flex items-center gap-3">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleUrlProcess}
          disabled={loading}
        >
          {loading ? "Processing..." : "Generate Study Pack from URL"}
        </button>
      </div>

      {/* File upload */}
      <div className="mt-3">
        <input
          type="file"
          accept="video/*,audio/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <button
          className="bg-green-600 text-white px-4 py-2 rounded mt-2"
          onClick={handleFileProcess}
          disabled={loading || !file}
        >
          {loading ? "Processing..." : "Generate Study Pack from File"}
        </button>
      </div>

      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
}
