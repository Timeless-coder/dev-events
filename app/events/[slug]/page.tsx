import Image from "next/image"
import { notFound } from "next/navigation"
import { BASE_URL } from '@/utils/urlValidator'
import BookEvent from "@/components/BookEvent"
import { IEvent } from "@/database"
import { getSimilarEventsBySlug } from "@/lib/actions/event.actions"
import EventCard from "@/components/EventCard"

type DetailsProps = {
	params: Promise<{slug: string}>
}

type ItemProps = {
	icon: string
	alt: string
	label: string
}

type AgendaProps = {
	agendaItems: string[]
}

type TagsProps = {
	tags: string[]
}

const EventDetailsItem = ({ icon, alt, label}: ItemProps) => (
	<div className="flex-row-gap-2 items-center">
		<Image src={icon} alt={alt} width={17} height={17} />
		<p>{label}</p>
	</div>
)

const EventAgenda = ({ agendaItems }: AgendaProps) => (
	<div className="agenda">
		<h2>Agenda</h2>
		<ul>
			{agendaItems.map(item => <li key={item}>{item}</li>)}
		</ul>
	</div>
)

const EventTags = ({ tags }: TagsProps) => (
	<div className="flex flex-row gap-1.5 flex-wrap">
		{tags.map(tag => <div className="pill" key={tag}>{tag}</div>)}
	</div>
)

const EventDetailsPage = async({ params }: DetailsProps) => {
	const { slug } = await params
	let event
	
	try {
		const controller = new AbortController()
		const timeoutId = setTimeout(() => controller.abort(), 10_000) // 10s timeout
		const request = await fetch(`${BASE_URL}/api/events/${slug}`, {
			next: { revalidate: 60 },
			signal: controller.signal
		})
		clearTimeout(timeoutId)

		if (!request.ok) {
			if (request.status === 404) return notFound()
			throw new Error(`Failed to fetch event: ${request.statusText}`)
		}

		const response = await request.json()
		event = response.event
		if (!event) return notFound()

	} catch (err) {
		if (err instanceof Error && err.name === 'AbortError') console.error('Request timed out')
		else console.error(`Error fetching event: ${err}`)
		return notFound()
	}
	
	const { description, image, overview, date, time, location, mode, agenda, audience, organizer, tags } = event
	if (!description) return notFound()
	const bookingCount = 10
	
	const similarEvents: IEvent[] = await getSimilarEventsBySlug(slug)

	return (
		<section id="event">
			<div className="header">
				<h1>Event Description:</h1>
				<p>{description}</p>
			</div>

			<div className="details">
				<div className="content">
					<Image src={image} alt="Event Banner" width={800} height={800} className="banner" />

					<section className="flex-col-gap-2">
						<h2>Overview</h2>
						<p>{overview}</p>
					</section>

					<section className="flex-col-gap-2">
						<h2>Event Details</h2>
						<EventDetailsItem icon="/icons/calendar.svg" alt="calendar" label={date} />
						<EventDetailsItem icon="/icons/clock.svg" alt="time" label={time} />
						<EventDetailsItem icon="/icons/pin.svg" alt="location" label={location} />
						<EventDetailsItem icon="/icons/mode.svg" alt="mode" label={mode} />
						<EventDetailsItem icon="/icons/audience.svg" alt="audience" label={audience} />
					</section>

					<EventAgenda agendaItems={agenda} />

					<section className="flex-col-gap-2">
						<h2>About the Organizer</h2>
						<p>{organizer}</p>
					</section>

					<EventTags tags={tags} />

				</div>

				<aside className="booking">
					<div className="signup-card">
						<h2>Book Your Spot</h2>
						{bookingCount > 0
							? <p className="text-sm">Join {bookingCount} people who have already booked!</p>
							: <p className="text-sm">Be the first to book your spot!</p>
						}

						<BookEvent />
					</div>
				</aside>
			</div>
			<div className="flex w-full flex-col gap-4 pt-20">
				{similarEvents && similarEvents.length > 0 && (
					<>
						<h2>Similar Events</h2>
						{similarEvents.map((evt: IEvent) => <EventCard key={evt._id?.toString?.() ?? evt._id} {...evt} />)}
					</>
				)}
			</div>
		</section>
	)
}

export default EventDetailsPage