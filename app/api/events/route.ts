import { Event } from "@/database";
import { connectDB } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary'

export const POST = async (req: NextRequest) => {
	try {
		await connectDB()
		
		const formData = await req.formData()
		let event

		try {
			event = Object.fromEntries(formData.entries()) as Record<string, any>		
		}
		catch (e) {
			return NextResponse.json({ message: "Invalid JSON data format"}, { status: 400 } )
		}

		const file = formData.get('image') as File
		if (!file) {
			return NextResponse.json({ message: "Image file is required" }, { status: 400 })
		}
		const arrayBuffer = await file.arrayBuffer()
		const buffer = Buffer.from(arrayBuffer)
		const uploadResult = await new Promise((resolve, reject) => {
			cloudinary.uploader.upload_stream({ resource_type: 'image', folder: 'devevents'}, (err, results) => {
				if (err) return reject(err)
				
				resolve(results)
			})
			.end(buffer)
		})
		event.image = (uploadResult as { secure_url: string }).secure_url

		event.tags = formData.getAll('tags') as string[]
		event.agenda = formData.getAll('agenda') as string[]

		const createdEvent = await Event.create(event)
		return NextResponse.json({ message: `Event Successfully Created`, event: createdEvent}, { status: 201 })

	}
	catch (e) {
		console.error("Full error:", e); // Add this line
		return NextResponse.json({
			message: "Event Creation Failed",
			error: e instanceof Error || (e && typeof e === "object" && "message" in e) ? e.message : "Unknown"
		}, { status: 500 });
	}
}

export const GET = async() => {
	try {
		await connectDB()
		const events = await Event.find().sort({ createdAt: -1 }) // sort by newest first.
		return NextResponse.json({ message: "Events fetched successfully", events }, { status: 200 })

	} catch (e) {
		return NextResponse.json({ message: "Event fetching failed", error: e }, { status: 500 })
	}
}

