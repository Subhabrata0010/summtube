"use client";
import { useState } from "react";
import Flashcards from "./Flashcards";
import Quiz from "./Quiz";
import ChatBot from "./ChatBot";

export default function StudyPack({ pack }: { pack: any }) {
  return (
    <div className="mt-6 space-y-6">
      <section>
        <h2 className="text-xl font-semibold">📒 Notes</h2>
        <div className="prose max-w-none">
          <pre className="whitespace-pre-wrap">{pack.notes}</pre>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold">🃏 Flashcards</h2>
        <Flashcards raw={pack.flashcards} />
      </section>

      <section>
        <h2 className="text-xl font-semibold">📝 Quiz</h2>
        <Quiz raw={pack.quiz} />
      </section>

      <section>
        <h2 className="text-xl font-semibold">🤖 Chat about this video</h2>
        <ChatBot packId={pack.id || pack._id} />
      </section>
    </div>
  );
}
