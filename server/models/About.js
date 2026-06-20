import mongoose from 'mongoose';

const aboutSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, default: 'Sparkles' },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('About', aboutSchema);
