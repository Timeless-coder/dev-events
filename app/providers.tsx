// app/providers.tsx
'use client'

import { PostHogProvider as PHProvider } from 'posthog-js/react'
import posthog from 'posthog-js'
import { useEffect } from 'react'

// Guard to avoid re-init in Fast Refresh or HMR
let posthogInitialized = false

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (posthogInitialized) return
    if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.warn('PostHog key missing: set NEXT_PUBLIC_POSTHOG_KEY in .env')
      }
      return
    }
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: '/ingest', // uses Next rewrites -> next.config.ts
      // ui_host only needed if you link to PostHog UI programmatically
      capture_pageview: true,
      capture_pageleave: true,
      persistence: 'localStorage+cookie',
      debug: process.env.NODE_ENV === 'development',
    })
    posthogInitialized = true
    // Fire a test event so you can see something immediately
    posthog.capture('dev_events_app_loaded')
  }, [])

  return <PHProvider client={posthog}>{children}</PHProvider>
}
