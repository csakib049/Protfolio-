import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  date: { type: String, default: '' },
  image: { type: String, default: '' },
  status: { type: String, default: '' },
  category: { type: String, default: '' },
  impactLevel: { type: Number, default: 0, min: 0, max: 5 },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Achievement', achievementSchema);
