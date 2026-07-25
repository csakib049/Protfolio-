import mongoose from 'mongoose';

const newsletterSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  images: [{ type: String }],
  image: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('Newsletter', newsletterSchema);
