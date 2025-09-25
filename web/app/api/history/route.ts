import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../utils/db";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  // Save metadata or fetch single by id
  try {
    const body = await req.json();
    const { action, pack } = body;

    const { db } = await connectToDatabase();

    if (action === "list") {
      const rows = await db.collection("studyPacks").find({}).sort({ createdAt: -1 }).limit(50).toArray();
      return NextResponse.json({ rows });
    }

    if (action === "get" && body.id) {
      const row = await db.collection("studyPacks").findOne({ _id: new ObjectId(body.id) });
      return NextResponse.json({ row });
    }

    return NextResponse.json({ error: "invalid action" }, { status: 400 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: String(err.message || err) }, { status: 500 });
  }
}
