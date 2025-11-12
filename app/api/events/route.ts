import { DevEvent } from "@/database";
import { connectToDatabase } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            return NextResponse.json({ message: "MongoDB URI not configured" }, { status: 500 });
        }
        await connectToDatabase(mongoUri)
        let devEvent

        try {
            // Accept multipart form data
            const formData = await req.formData();
            devEvent = Object.fromEntries(formData.entries());
        }
        catch (err) {
            return NextResponse.json({ message: "Invalid form data"}, { status: 400 })
        }

        const createdEvent = await DevEvent.create(devEvent)
        return NextResponse.json({ message: "DevEvent created successfully", devEvent: createdEvent}, { status: 201 })
    }
    catch (err) {
        console.log(err)
        const msg = err instanceof Error ? err.message : "Unknown"
        return NextResponse.json({ message: "DevEvent Creation Failed", error: msg }, { status: 500 })
    }
}