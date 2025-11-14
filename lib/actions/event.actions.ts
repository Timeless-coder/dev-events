'use server'

import { DevEvent } from '@/database/devEvent.model'
import { connectToDatabase } from '../mongodb'

const mongoUri = process.env.MONGODB_URI

export const getSimilarEventsBySlug = async (slug: string) => {
  try {
    await connectToDatabase(mongoUri!);

    const devEvent = await DevEvent.findOne({ slug });
    if (!devEvent) return [];

    return await DevEvent.find({
      _id: { $ne: devEvent._id },
      tags: { $in: devEvent.tags }
    })
  } catch (error) {
    return [];
  }
};