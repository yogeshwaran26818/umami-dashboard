import mongoose from 'mongoose';

const websiteSchema = new mongoose.Schema({
  websiteId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  domain: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const eventSchema = new mongoose.Schema({
  websiteId: {
    type: String,
    required: true,
    index: true
  },
  visitorId: {
    type: String,
    required: true,
    index: true
  },
  url: {
    type: String,
    required: true
  },
  eventType: {
    type: String,
    required: true,
    enum: ['pageview', 'click', 'custom']
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  duration: {
    type: Number,
    default: 0
  }
});

eventSchema.index({ websiteId: 1, timestamp: -1 });
eventSchema.index({ websiteId: 1, visitorId: 1 });

export const Website = mongoose.models.Website || mongoose.model('Website', websiteSchema);
export const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);