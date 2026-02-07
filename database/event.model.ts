import mongoose, { Document, Schema, Model } from 'mongoose';
import slugify from 'slugify';

export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string; // ISO string
  time: string; // HH:mm format
  mode: 'online' | 'offline' | 'hybrid' | string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// const EventSchema = new Schema<IEvent>(
//   {
//     title: { type: String, required: true, trim: true },
//     slug: { type: String, unique: true, required: true, trim: true },
//     description: { type: String, required: true, trim: true },
//     overview: { type: String, required: true, trim: true },
//     image: { type: String, required: true, trim: true },
//     venue: { type: String, required: true, trim: true },
//     location: { type: String, required: true, trim: true },
//     date: { type: String, required: true },
//     time: { type: String, required: true },
//     mode: { type: String, required: true, enum: ['online', 'offline', 'hybrid'] },
//     audience: { type: String, required: true, trim: true },
//     agenda: { type: [String], required: true, validate: (v: unknown) => Array.isArray(v) && v.length > 0 },
//     organizer: { type: String, required: true, trim: true },
//     tags: { type: [String], required: true, validate: (v: unknown) => Array.isArray(v) && v.length > 0 },
//   },
//   {
//     timestamps: true,
//     strict: true,
//   }
// );

const EventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    overview: {
      type: String,
      required: [true, 'Overview is required'],
      trim: true,
      maxlength: [500, 'Overview cannot exceed 500 characters'],
    },
    image: {
      type: String,
      required: [true, 'Image URL is required'],
      trim: true,
    },
    venue: {
      type: String,
      required: [true, 'Venue is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    date: {
      type: String,
      required: [true, 'Date is required'],
    },
    time: {
      type: String,
      required: [true, 'Time is required'],
    },
    mode: {
      type: String,
      required: [true, 'Mode is required'],
      enum: {
        values: ['online', 'offline', 'hybrid'],
        message: 'Mode must be either online, offline, or hybrid',
      },
    },
    audience: {
      type: String,
      required: [true, 'Audience is required'],
      trim: true,
    },
    agenda: {
      type: [String],
      required: [true, 'Agenda is required'],
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: 'At least one agenda item is required',
      },
    },
    organizer: {
      type: String,
      required: [true, 'Organizer is required'],
      trim: true,
    },
    tags: {
      type: [String],
      required: [true, 'Tags are required'],
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: 'At least one tag is required',
      },
    },
  },
  {
    timestamps: true, // Auto-generate createdAt and updatedAt
  }
);

EventSchema.pre<IEvent>('save', async function (this: IEvent) {
  // Only generate slug if title is new or modified
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }

  // Normalize date to ISO string
  if (this.isModified('date')) {
    const dateObj = new Date(this.date);
    if (isNaN(dateObj.getTime())) {
      throw new Error('Invalid date format.');
    }
    this.date = dateObj.toISOString().split('T')[0]; // YYYY-MM-DD
  }

  // Normalize time to HH:mm (24h)
  if (this.isModified('time')) {
    const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timePattern.test(this.time)) {
      throw new Error('Time must be in HH:mm format.');
    }
    // Already normalized
  }

  // Validate required fields are non-empty
  const requiredFields: (keyof IEvent)[] = [
    'title', 'description', 'overview', 'image', 'venue', 'location', 'date', 'time', 'mode', 'audience', 'agenda', 'organizer', 'tags'
  ];
  for (const field of requiredFields) {
    const value = this[field];
    if (
      value === undefined ||
      value === null ||
      (typeof value === 'string' && value.trim() === '') ||
      (Array.isArray(value) && value.length === 0)
    ) {
      throw new Error(`${field} is required and cannot be empty.`);
    }
  }
});

export const Event: Model<IEvent> =
  mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);
