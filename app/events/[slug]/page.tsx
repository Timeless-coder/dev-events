
import Image from "next/image"
import { notFound } from "next/navigation"
import { Suspense } from "react"

import BookEvent from "@/components/BookEvent"
import { getSimilarEventsBySlug } from "@/lib/actions/event.actions"
import EventCard from "@/components/EventCard"

type Props = {
  params: Promise<{ slug: string }>
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
  tagItems: string[]
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

const EventDetailsItem = ({ icon, alt, label }: ItemProps) => (
  <div className="flex-row-gap-2 items-center">
    <Image src={icon} alt={alt} width={17} height={17} />
    <p>{label}</p>
  </div>
)

const EventAgenda = ({ agendaItems }: AgendaProps) => (
  <div className="agenda">
    <h2>Agenda:</h2>
    <ul>
      {agendaItems.map(i => <li key={i}>{i}</li>)}
    </ul>
  </div>
)

const EventTags = ({ tagItems }: TagsProps) => (
  <div className="flex flex-row gap-1.5 flex-wrap">
    {tagItems.map(i => <div className="pill" key={i}>{i}</div>)}
  </div>
)

// Async component for fetching and displaying event details
const EventDetails = async ({ params }: Props) => {
  const { slug } = await params
  const req = await fetch(`${BASE_URL}/api/events/${slug}`)
  const { event } = await req.json()

  if (!event) return notFound()

  const bookings = 10

  const similarEvents = await getSimilarEventsBySlug(slug)

  return (
    <section id="event">
      <div className="header">
        <h1>Event Description:</h1>
        <p>{event.description}</p>
      </div>

      <div className="details">

        <div className="content">
          <Image className="banner" src={event.image} alt={event.title} width={800} height={800} />

          <section className="flex-col-gap-2">
            <h2>Overview:</h2>
            <p>{event.overview}</p>
          </section>
            
          <section className="flex-col-gap-2">
            <h2>Details:</h2>
            <EventDetailsItem icon="/icons/calendar.svg" alt="calendar" label={event.date} />
            <EventDetailsItem icon="/icons/clock.svg" alt="time" label={event.time} />
            <EventDetailsItem icon="/icons/pin.svg" alt="location" label={event.location} />
            <EventDetailsItem icon="/icons/mode.svg" alt="mode" label={event.mode} />
            <EventDetailsItem icon="/icons/audience.svg" alt="audience" label={event.audience} />
          </section>

          <EventAgenda agendaItems={event.agenda} />

          <section className="flex-col-gap-2">
            <h2>About the Organizer</h2>
            <p>{event.organizer}</p>
          </section>

          <EventTags tagItems={event.tags} />
        </div>

        <aside className="booking">
          <div className="signup-card">
            <h2>Book Your Spot</h2>
            {bookings > 0
              ? (<p className="text-sm">Join {bookings} people who have already booked their spot!</p> )
              : (<p className="text-sm">Be the first to book your spot!</p> )
            }
            <BookEvent />
          </div>
        </aside>

      </div>

      <div className="flex w-full flex-col gap-4 pt-20">
        <h2>Similar Events</h2>
        <div className="events">
          {similarEvents?.length > 0 && similarEvents.map(similarEvent => <EventCard key={similarEvent.id} devEvent={similarEvent} />)}
        </div>
      </div>
    </section>
  )
}

// Synchronous page component with Suspense boundary
const EventDetailsPage = (props: Props) => (
  <Suspense fallback={<div>Loading event...</div>}>
    <EventDetails {...props } />
  </Suspense>
)

export default EventDetailsPage