import StudyPack from "@/components/StudyPack";
import { connectToDatabase } from "../../../utils/db";
import { ObjectId } from "mongodb";

export default async function VideoPage({ params }: { params: { id: string } }) {
  const { db } = await connectToDatabase();
  const doc = await db.collection("studyPacks").findOne({ _id: new ObjectId(params.id) });
  if (!doc) return <div className="p-6">Not found</div>;

  // Convert _id to id string for client components
  const pack = {
    id: doc._id.toString(),
    notes: doc.notes,
    flashcards: doc.flashcards,
    quiz: doc.quiz,
    transcript: doc.transcript
  };

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Study Pack</h1>
      <StudyPack pack={pack} />
    </main>
  );
}
