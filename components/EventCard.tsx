import Image from "next/image"
import Link from "next/link"

type Props = {
	id: string;
	title: string;
	date: string;
	location: string;
	description: string;
	image: string;
	url: string;
	time: string;
}

const EventCard = ({ id, title, date, location, description, image, url, time }: Props) => {
		return (
			<Link href={url} id="event-card">
				<Image src={image} alt={title} width={410} height={300} className="poster" />

				<div style={{ display: "flex", flexDirection: "row", gap: 2 }}>
					<Image src="/icons/pin.svg" alt="location" width={14} height={14} />
					<p>{location}</p>
				</div>

				<p className="title">{title}</p>

				<div className="datetime">
					<div>
						<Image src="/icons/calendar.svg" alt="date" width={14} height={14} />
						<p>{date}</p>
					</div>
					<div>
						<Image src="/icons/clock.svg" alt="time" width={14} height={14} />
						<p>{time}</p>
					</div>
				</div>
			</Link>
		)
}

export default EventCard