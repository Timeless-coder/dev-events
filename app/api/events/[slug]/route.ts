import { NextRequest, NextResponse } from "next/server";
import { DevEvent } from "@/database";
import { connectToDatabase } from "@/lib/mongodb";

type Props = {
	params: Promise<{slug: string}>
}

export async function GET( req: NextRequest, { params }: Props) {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      return NextResponse.json({ message: "MongoDB URI not configured" }, { status: 500 });
    }
    await connectToDatabase(mongoUri);

    const { slug } = await params
    if (!slug || typeof slug !== "string" || slug.trim() === "") {
      return NextResponse.json({ message: "Missing or invalid slug parameter" }, { status: 400 });
    }

    const event = await DevEvent.findOne({ slug }).lean() // lean basically converts a Mongo object to a JS object.
    if (!event) {
      return NextResponse.json({ message: `No event found for slug '${slug}'` }, { status: 404 });
    }

    return NextResponse.json({ event }, { status: 200 });
  } catch (err) {
    console.error(err);
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ message: "Failed to fetch event", error: msg }, { status: 500 });
  }
}
