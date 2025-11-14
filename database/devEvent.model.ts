// DevEvent Mongoose model
import mongoose, { Schema, Document, Model } from 'mongoose'

// TypeScript interface for DevEvent
export interface IDevEvent extends Document {
  title: string
  slug: string
  description: string
  overview: string
  image: string
  venue: string
  location: string
  url: string
  date: string
  time: string
  mode: string
  audience: string
  agenda: string[]
  organizer: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

// DevEvent schema definition
const DevEventSchema = new Schema<IDevEvent>({
  title: { type: String, required: [true, 'Title is required'], trim: true, maxLength: [100, 'Title cannot exceed 100 characters'] },
  slug: { type: String, unique: true, trim: true },
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
  image: { type: String, trim: true },
  venue: { type: String, required: [true, 'Venue is required'], trim: true },
  url: { type: String, required: [true, 'URL is required'], trim: true },
  location: { type: String, required: [true, 'Location is required'], trim: true },
  date: { type: String, required: [true, 'Date is required'] },
  time: { type: String, required: [true, 'Time is required'] },
  mode: {
    type: String,
    required: [true, 'Mode is required'],
    trim: true,
    enum: {
      values: ['online', 'offline', 'hybrid'],
      message: "Mode must be 'online', 'offline', or 'hybrid'"
    }
  },
  audience: { type: String, required: [true, 'Audience is required'], trim: true },
  agenda: {
    type: [String],
    required: [true, 'Agenda is required'],
    validate: {
      validator: (arr: string[]) => Array.isArray(arr) && arr.length > 0,
      message: 'At least one agenda item is required',
    },
  },
  organizer: { type: String, required: [true, 'Organizer is required'], trim: true },
  tags: {
    type: [String],
    required: [true, 'Tags are required'],
    validate: {
      validator: (arr: string[]) => Array.isArray(arr) && arr.length > 0,
      message: 'At least one tag is required',
    },
  },
}, {
  timestamps: true,
  strict: true,
})

// Pre-save hook for slug generation, date normalization, and validation
DevEventSchema.pre<IDevEvent>('save', function (next) {
  // Generate slug only if title changed
  if (this.isModified('title')) {
    const baseSlug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    // Add timestamp to ensure uniqueness
    this.slug = `${baseSlug}-${Date.now()}`
  }
  // Normalize date to ISO format
  if (this.isModified('date')) {
    const d = new Date(this.date)
    if (isNaN(d.getTime())) {
      return next(new Error('Invalid date format'))
    }
    this.date = d.toISOString().split('T')[0]
  }
  // Normalize time to HH:mm format
  if (this.isModified('time')) {
    const timeMatch = /^([01]\d|2[0-3]):[0-5]\d$/.test(this.time)
    if (!timeMatch) {
      return next(new Error('Time must be in HH:mm format'))
    }
  }
  next()
})

// Unique index for slug
DevEventSchema.index({ slug: 1 }, { unique: true })

export const DevEvent: Model<IDevEvent> = mongoose.models.DevEvent || mongoose.model<IDevEvent>('DevEvent', DevEventSchema)
