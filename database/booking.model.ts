import mongoose, { Document, Schema, Model, Types } from 'mongoose';
import { Event } from './event.model';

// Booking interface with strong types
 export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event ID is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      validate: {
        validator: function (email: string) {
          // RFC 5322 compliant email validation regex
          const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
          return emailRegex.test(email);
        },
        message: 'Please provide a valid email address',
      },
    },
  },
  {
    timestamps: true, // Auto-generate createdAt and updatedAt
  }
);

// Pre-save hook: ensure eventId references an existing Event
BookingSchema.pre<IBooking>('save', async function () {
  // Check if referenced Event exists
  const eventExists = await Event.exists({ _id: this.eventId });
  if (!eventExists) {
    throw new Error('Referenced event does not exist.');
  }
});

/**
 * Booking model: references Event, validates email, and ensures event existence before saving.
 * Index on eventId for performance. Timestamps enabled for createdAt/updatedAt.
 */
export const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);
