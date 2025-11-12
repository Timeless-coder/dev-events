import mongoose, { Connection } from 'mongoose'

// Type for cached connection object
interface MongooseConnectionCache {
  conn: Connection | null
  promise: Promise<Connection> | null
}

// Global cache to prevent multiple connections in dev (Next.js hot reload)
declare global {
  // eslint-disable-next-line no-var
  var mongooseConnectionCache: MongooseConnectionCache | undefined
}

let cache: MongooseConnectionCache
if (!global.mongooseConnectionCache) {
  global.mongooseConnectionCache = { conn: null, promise: null }
}
cache = global.mongooseConnectionCache

/**
 * Connects to MongoDB using Mongoose, caching the connection to avoid
 * creating multiple connections during development (hot reload).
 * @param uri MongoDB connection string
 * @returns Mongoose Connection
 */
export async function connectToDatabase(uri: string): Promise<Connection> {
  if (cache.conn) {
    // Return cached connection if available
    return cache.conn
  }
  if (!cache.promise) {
    // Create new connection promise if not already started
    cache.promise = mongoose.connect(uri, {
      // Add options here if needed
    }).then(m => m.connection)
  }
  // Await the connection and cache it
  cache.conn = await cache.promise
  return cache.conn
}

/**
 * Usage example:
 * import { connectToDatabase } from '@/lib/mongodb'
 * const conn = await connectToDatabase(process.env.MONGODB_URI!)
 */
