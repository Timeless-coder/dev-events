// Booking Mongoose model
import mongoose, { Schema, Document, Model, Types } from 'mongoose'
import { DevEvent } from './devEvent.model'

// TypeScript interface for Booking
export interface IBooking extends Document {
  devEventId: Types.ObjectId
  email: string
  createdAt: Date
  updatedAt: Date
}

const BookingSchema = new Schema<IBooking>({
  devEventId: { type: Schema.Types.ObjectId, ref: 'DevEvent', required: [true, 'DevEventId is required'] },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address']
  },
}, {
  timestamps: true,
  strict: true,
})

// Pre-save hook for reference and email validation
BookingSchema.pre<IBooking>('save', async function (next) {
  // Validate referenced DevEvent exists
  const eventExists = await DevEvent.exists({ _id: this.devEventId })
  if (!eventExists) {
    return next(new Error('Referenced DevEvent does not exist'))
  }
  // Email format is validated by schema
  next()
})

// Index for faster queries on devEventId
BookingSchema.index({ devEventId: 1 })

export const Booking: Model<IBooking> = mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema)
