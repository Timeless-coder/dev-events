import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ExploreBtn";
import { IEvent } from "@/database";
import { BASE_URL } from '@/utils/urlValidator'
import { cacheLife } from "next/cache";
import { notFound } from "next/navigation";

export default async function Home () {
  let events

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10_000) // 10s timeout
    const request = await fetch(`${BASE_URL}/api/events`, {
      next: { revalidate: 60},
      signal: controller.signal
    })
    clearTimeout(timeoutId)

    if (!request.ok) {
      if (request.status === 404) return notFound()
      const errorBody = await request.text()
      console.error(`API error ${request.status}: ${errorBody}`)
      throw new Error(`Failed to fetch events: ${request.status} ${request.statusText}`)
    }

    const response = await request.json()
    events = response.events
    if (!Array.isArray(events)) {
      console.error('Invalid response: events is not an array')
      return notFound()
    }
  }
  catch (err) {
   if (err instanceof Error && err.name === 'AbortError') {
      console.error('Request timed out')
    } else {
      console.error(`Error fetching events: ${err}`)
    }
    return notFound()
  }

  return (
     <section>
      <h1 className="text-center">The Hub for Every Dev <br /> Event You Can't Miss</h1>
      <p className="text-center mt-5">Hackathons, Meetups, and Conferences, All in One Place</p>

      <ExploreBtn />

      <div className="mt-20 space-y-7">
        <h3>{!events || events.length === 0 ? "No " : "Featured "}Events</h3>

        <ul className="events">          
          {events && events.length > 0 && events.map((evt: IEvent) => (
            <li key={evt.title} >
              <EventCard {...evt } />
            </li>
          ))}
        </ul>

      </div>
    </section>
  );
}
