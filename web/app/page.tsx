"use client"
import { useState } from "react";
import VideoInput from "../components/VideoInput";
import StudyPack from "../components/StudyPack";

export default function HomePage() {
  const [pack, setPack] = useState<any | null>(null);

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">🎓 YouTube Learning Coordinator</h1>
      <VideoInput onResult={(data) => setPack({ id: data.id, notes: data.notes, flashcards: data.flashcards, quiz: data.quiz })} />
      {pack && <StudyPack pack={pack} />}
    </main>
  );
}
