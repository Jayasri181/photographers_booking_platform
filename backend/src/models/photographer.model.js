const mongoose = require('mongoose');

const photographerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bio: { type: String },
  location: { type: String },
  experience: { type: Number },
  portfolio: [{ type: String }],
  priceRange: { type: String },
  availability: [{ type: Date }],
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Photographer', photographerSchema);
