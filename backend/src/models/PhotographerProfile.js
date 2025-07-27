import mongoose from 'mongoose';

const photographerProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bio: {
    type: String,
    trim: true,
    max: 500
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  services: [{
    type: String,
    enum: ['wedding', 'portrait', 'landscape', 'event', 'commercial']
  }],
  experienceYears: {
    type: Number,
    min: 0
  },
  portfolio: [{
    imageUrl: String,
    description: String
  }],
  availability: [{
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    startTime: String,
    endTime: String
  }],
  hourlyRate: {
    type: Number,
    required: true,
    min: 0
  },
  totalBookings: {
    type: Number,
    default: 0
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('PhotographerProfile', photographerProfileSchema);
