import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../utils/db";
import { answerQuestion } from "../../../utils/ai";

export async function POST(req: Request) {
  try {
    const { packId, question } = await req.json();
    if (!packId || !question) return NextResponse.json({ error: "packId and question required" }, { status: 400 });

    const { db } = await connectToDatabase();
    const pack = await db.collection("studyPacks").findOne({ _id: new (require("mongodb").ObjectId)(packId) });
    if (!pack) return NextResponse.json({ error: "Study pack not found" }, { status: 404 });

    const transcript = pack.transcript || "";
    const answer = await answerQuestion(transcript, question);

    // Optionally save chat history
    await db.collection("chats").insertOne({
      packId: pack._id,
      question,
      answer,
      createdAt: new Date()
    });

    return NextResponse.json({ answer });
  } catch (err: any) {
    console.error("chat error", err);
    return NextResponse.json({ error: String(err.message || err) }, { status: 500 });
  }
}
