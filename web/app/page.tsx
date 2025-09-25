"use client";
import { useState } from "react";
import VideoInput from "../components/VideoInput";
import StudyPack from "../components/StudyPack";

export default function HomePage() {
  const [pack, setPack] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const handleResult = async (data: any) => {
    setLoading(true);
    try {
      const transcript = data.transcript;

      // Optionally: generate notes & quiz via ai.ts here
      // import { getNotes, getQuiz } from "@/utils/ai";
      // const [notes, quiz] = await Promise.all([getNotes(transcript), getQuiz(transcript)]);

      setPack({
        id: data.id,
        transcript,
        notes: transcript, // fallback: show transcript until notes generated
        flashcards: "Flashcards will be generated later",
        quiz: "Quiz will be generated later",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">🎓 YouTube Learning Coordinator</h1>
      <VideoInput onResult={handleResult} />
      {loading && <p className="text-gray-500 mt-3">Processing video…</p>}
      {pack && <StudyPack pack={pack} />}
    </main>
  );
}
