import { NextResponse } from "next/server";
import { connectToDatabase } from "@/utils/db";
import formidable from "formidable";
import fs from "fs";
import { callASR } from "@/utils/ai";
import { YouTubeTranscriptApi } from "youtube-transcript-ts";
import { ObjectId } from "mongodb";

export const runtime = "nodejs"; // Needed for file uploads

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let transcriptText = "";

    if (contentType.includes("application/json")) {
      // YouTube/public video URL
      const { url } = await req.json();
      if (!url) return NextResponse.json({ error: "URL is required" }, { status: 400 });

      try {
        const api = new YouTubeTranscriptApi();
        const response = await api.fetchTranscript(url);
        transcriptText = response.transcript.snippets.map(s => s.text).join(" ");
        console.log(response.transcript.snippets);
      } catch (err: any) {
        console.error("YouTube transcript error:", err);
      }

    } else if (contentType.includes("multipart/form-data")) {
      // File upload
      const form = new formidable.IncomingForm({ multiples: false });
      const { files } = await new Promise<{ files: formidable.Files }>((resolve, reject) => {
        form.parse(req as any, (err, fields, files) => (err ? reject(err) : resolve({ files })));
      });

      const file = files?.file;
      if (!file) return NextResponse.json({ error: "File is required" }, { status: 400 });

      const filePath = (file as any).filepath || (file as any).path;

      // Read file and convert to base64 URL for HF ASR
      const buffer = fs.readFileSync(filePath);
      const base64 = `data:audio/wav;base64,${buffer.toString("base64")}`;
      const asrRes = await callASR(base64);
      transcriptText = asrRes?.data?.[0]?.text || "";
    } else {
      return NextResponse.json({ error: "Unsupported content type" }, { status: 400 });
    }

    // Save transcript to MongoDB
    const { db } = await connectToDatabase();
    const doc = {
      source: "process",
      transcript: transcriptText,
      createdAt: new Date(),
    };
    const result = await db.collection("studyPacks").insertOne(doc);

    return NextResponse.json({ id: result.insertedId.toString(), transcript: transcriptText });

  } catch (err: any) {
    console.error("process error", err);
    return NextResponse.json({ error: err.message || "Internal error" }, { status: 500 });
  }
}
