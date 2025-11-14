import EventCard from "@/components/EventCard"
import ExploreBtn from "@/components/ExploreBtn"
import { IDevEvent } from '../database/devEvent.model'
import { Suspense } from "react"
import { cacheLife } from "next/cache"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

// Async component for fetching and rendering events
async function EventsList() {
  'use cache'
  cacheLife('hours') // cached for 1 hour
  const res = await fetch(`${BASE_URL}/api/events`)
  const { devEvents } = await res.json()
  
   return (
    <ul className="events">
      {devEvents?.map((devEvent: IDevEvent, idx: number) => (
        <EventCard key={devEvent.id || idx.toString()} devEvent={devEvent} />
      ))}
    </ul>
  )
}

EventsList()

const Page = () => {
  return (
    <section>
      <h1 className="text-center">The Hub for Every Dev <br /> Event You Can't Miss</h1>
      <p className="text-center mt-5">Hackathons, Meetups and Conferences, All in One Place</p>

      <ExploreBtn />

      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>

        <Suspense fallback={<div>Loading events...</div>}>
          {/* EventsList is async and will be streamed */}
          <EventsList />
        </Suspense>
      </div>
    </section>
  )
}

export default Page
