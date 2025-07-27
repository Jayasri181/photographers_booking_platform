import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  image: { type: String },
  photographerCount: { type: Number, default: 0 },
  startingPrice: { type: Number, default: 0 }
}, {
  timestamps: true
});

export default mongoose.model('Category', categorySchema); 