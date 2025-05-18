// models/Event.js
import mongoose from 'mongoose';

const ticketTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  sold: {
    type: Number,
    default: 0
  }
});

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['tech', 'business', 'design', 'marketing', 'health', 'education', 'entertainment', 'food']
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true,
    match: /^([01]\d|2[0-3]):([0-5]\d)$/ // HH:MM format
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  meetingUrl: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        // Only validate if it's an online event
        return !this.isOnline || /^https?:\/\/.+\..+/.test(v);
      },
      message: props => `${props.value} is not a valid URL!`
    }
  },
  location: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        // Only validate if it's an in-person event
        return this.isOnline || v.length > 0;
      },
      message: 'Location is required for in-person events'
    }
  },
  imageUrl: {
    type: String,
    trim: true,
    required: false,
  },
  organizer: {
    type: String,
    required: true,
    trim: true
  },
  organizerDescription: {
    type: String,
    trim: true
  },
  contactEmail: {
    type: String,
    required: true,
    trim: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ // Basic email validation
  },
  contactPhone: {
    type: String,
    trim: true
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  ticketTypes: [ticketTypeSchema],
  maxAttendees: {
    type: Number,
    min: 1
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'cancelled', 'completed'],
    default: 'draft'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Add indexes for better query performance
eventSchema.index({ title: 'text', description: 'text' });
eventSchema.index({ date: 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ creator: 1 });
eventSchema.index({ status: 1 });

// Update the updatedAt field before saving
eventSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Event = mongoose.model('Event', eventSchema);

export default Event;