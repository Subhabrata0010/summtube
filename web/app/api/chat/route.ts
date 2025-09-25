import { NextResponse } from "next/server";
import { connectToDatabase } from "@/utils/db";
import { ObjectId } from "mongodb";
import { askChatbot } from "@/utils/ai";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { packId, question } = await req.json();
    if (!packId || !question)
      return NextResponse.json({ error: "packId and question are required" }, { status: 400 });

    // Fetch transcript from DB
    const { db } = await connectToDatabase();
    const doc = await db.collection("studyPacks").findOne({ _id: new ObjectId(packId) });
    if (!doc) return NextResponse.json({ error: "Study pack not found" }, { status: 404 });

    const transcript = doc.transcript || "";

    // Call Gemini via ai.ts
    const answer = await askChatbot(transcript, question);

    return NextResponse.json({ answer });
  } catch (err: any) {
    console.error("chat error", err);
    return NextResponse.json({ error: err.message || "Internal error" }, { status: 500 });
  }
}
