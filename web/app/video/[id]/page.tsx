import StudyPack from "@/components/StudyPack";
import { connectToDatabase } from "../../../utils/db";
import { ObjectId } from "mongodb";

export default async function VideoPage({ params }: { params: { id: string } }) {
  const { db } = await connectToDatabase();
  const doc = await db.collection("studyPacks").findOne({ _id: new ObjectId(params.id) });

  if (!doc) return <div className="p-6">Not found</div>;

  // Convert _id to id string and pick only relevant fields
  const pack = {
    id: doc._id.toString(),
    transcript: doc.transcript,
    notes: doc.notes,
    quiz: doc.quiz,
    // flashcards may be missing depending on backend
    flashcards: doc.flashcards ?? null
  };

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Study Pack</h1>
      <StudyPack pack={pack} />
    </main>
  );
}
