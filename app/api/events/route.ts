
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary'

import { DevEvent } from "../../../database/devEvent.model"
import { connectToDatabase } from "@/lib/mongodb";

const mongoUri = process.env.MONGODB_URI;

export async function POST(req: NextRequest) {
    try {        
        if (!mongoUri) {
            return NextResponse.json({ message: "MongoDB URI not configured" }, { status: 500 });
        }
        await connectToDatabase(mongoUri)

        const formData = await req.formData()
        let devEvent: Record<string, any>

        try {
            devEvent = {};
            for (const [key, value] of formData.entries()) {
                if (key === "agenda" || key === "tags") {
                    if (!devEvent[key]) devEvent[key] = [];
                    devEvent[key].push(value);
                } else {
                    devEvent[key] = value;
                }
            }
        }
        catch (err) {
            return NextResponse.json({ message: "Invalid form data"}, { status: 400 })
        }

        const file = formData.get('image') as File
        if (!file) return NextResponse.json({ mesage: 'Image file is required'}, { status: 400 })

        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        const uploadResult = await new Promise<UploadApiResponse>((resolve, reject) => {
            cloudinary.uploader.upload_stream({ resource_type: "image", folder: "DevEvent" }, (error, results) => {
                if (error || !results) return reject(error || new Error('No result from Cloudinary'));
                resolve(results);
            }).end(buffer);
        });

        devEvent.image = uploadResult.secure_url

        const createdEvent = await DevEvent.create(devEvent)
        console.log(`***** ${createdEvent} *****`)
        return NextResponse.json({ message: "DevEvent created successfully", devEvent: createdEvent}, { status: 201 })
    }
    catch (err) {
        console.log(err)
        const msg = err instanceof Error ? err.message : "Unknown"
        return NextResponse.json({ message: "DevEvent Creation Failed", error: msg }, { status: 500 })
    }
}

export async function GET() {
    try {
        if (!mongoUri) {
            return NextResponse.json({ message: "MongoDB URI not configured" }, { status: 500 });
        }
        await connectToDatabase(mongoUri)

        const devEvents = await DevEvent.find().sort({ createdAt: -1 })

        return NextResponse.json({ message: "DevEvents fetched successfully", devEvents }, { status: 200 })
        
    } catch (e) {
        return NextResponse.json({ message: "Event fetching failed", error: e }, { status: 500 })
    }
}

