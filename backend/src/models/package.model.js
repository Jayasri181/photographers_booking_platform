const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  features: [{ type: String }],
  duration: { type: String },
  photos: { type: String },
  image: { type: String },
  images: [{ type: String }],
  popular: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Package', packageSchema); 