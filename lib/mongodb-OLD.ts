import mongoose, { Connection } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;
if (!MONGODB_URI) {
	throw new Error('Please define the MONGODB_URI environment variable inside .env');
}
interface MongooseCache {
	conn: Connection | null;
	promise: Promise<Connection> | null;
}
declare global {
	// eslint-disable-next-line no-var
	var mongooseCache: MongooseCache | undefined;
}
let cache: MongooseCache;
if (typeof global !== 'undefined') {
	cache = global.mongooseCache ||= { conn: null, promise: null };
} else {
	cache = { conn: null, promise: null };
}
export async function connectToDatabase(): Promise<Connection> {
	if (cache.conn) return cache.conn;
	else console.log(`cache: ${cache}`)
	if (!cache.promise) {
		cache.promise = mongoose.connect(MONGODB_URI, {
			dbName: 'dev-events',
			bufferCommands: false,
		}).then((mongooseInstance) => mongooseInstance.connection);
	}
	cache.conn = await cache.promise;
	return cache.conn;
}
