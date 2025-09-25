import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../utils/db";
import { generateNotes, generateFlashcards, generateQuiz } from "../../../utils/ai";
import { YoutubeTranscript } from "youtube-transcript";
import formidable from "formidable";
import fs from "fs";

export const runtime = "edge" in process.env ? "edge" : "nodejs";

export async function POST(req: Request) {
  try {
    // Expect JSON { url?: string } OR multipart/form-data with file field 'file'
    const contentType = req.headers.get("content-type") || "";

    let transcriptText = "";

    if (contentType.includes("application/json")) {
      const body = await req.json();
      const { url } = body;
      if (!url) return NextResponse.json({ error: "url is required" }, { status: 400 });

      // Use youtube-transcript to fetch transcript
      // library expects id or full url
      const transcript = await YoutubeTranscript.fetchTranscript(url);
      transcriptText = transcript.map((t: any) => t.text).join(" ");
    } else {
      // handle multipart upload using formidable
      // NOTE: this route runs under Node.js runtime (not edge)
      const form = formidable({ multiples: false });
      const { fields, files } = await new Promise<{ fields: formidable.Fields; files: formidable.Files }>((resolve, reject) => {
        form.parse(req as any, (err: Error | null, fields: formidable.Fields, files: formidable.Files) => 
          (err ? reject(err) : resolve({ fields, files }))
        );
      });

      const file = (files as any)?.file;
      if (!file) return NextResponse.json({ error: "file is required" }, { status: 400 });

      // For MVP: we store the file temporarily and call HuggingFace ASR in a later step.
      // Here we'll just record file name and return a message (or you can call HF speech-to-text).
      transcriptText = `Uploaded file: ${(file as any).originalFilename}. Please run ASR on server to transcribe (not implemented in this MVP).`;
    }

    // Generate study assets
    const [notes, flashcards, quiz] = await Promise.all([
      generateNotes(transcriptText),
      generateFlashcards(transcriptText),
      generateQuiz(transcriptText)
    ]);

    // Save to DB: collection 'studyPacks'
    const { db } = await connectToDatabase();
    const doc = {
      source: "youtube",
      url: (await (req.json?.() || {})).url || null,
      transcript: transcriptText,
      notes,
      flashcards,
      quiz,
      createdAt: new Date()
    };
    const result = await db.collection("studyPacks").insertOne(doc);
    const id = result.insertedId.toString();

    return NextResponse.json({ id, notes, flashcards, quiz });
  } catch (err: any) {
    console.error("process error", err);
    return NextResponse.json({ error: String(err.message || err) }, { status: 500 });
  }
}
