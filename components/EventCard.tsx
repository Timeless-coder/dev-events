import { IDevEvent } from "@/database/devEvent.model"
import Image from "next/image"
import Link from "next/link"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

type Props = {
	devEvent: IDevEvent
}

const EventCard = ({devEvent}: Props) => {
	return (
		<Link href={`${BASE_URL}/events/${devEvent.slug}`} id="event-card">
			<Image src={devEvent.image} alt={devEvent.title} width={410} height={300} className="poster" />

			<div style={{ display: "flex", flexDirection: "row", gap: 2 }}>
				<Image src="/icons/pin.svg" alt="location" width={14} height={14} />
				<p>{devEvent.location}</p>
			</div>

			<p className="title">{devEvent.title}</p>

			<div className="datetime">
				<div>
					<Image src="/icons/calendar.svg" alt="date" width={14} height={14} />
					<p>{devEvent.date}</p>
				</div>
				<div>
					<Image src="/icons/clock.svg" alt="time" width={14} height={14} />
					<p>{devEvent.time}</p>
				</div>
			</div>
		</Link>
	)
}

export default EventCard