import mongoose from 'mongoose';

const mediaCoverageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  link: { type: String, required: true },
  image: { type: String, default: '' },
  date: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('MediaCoverage', mediaCoverageSchema);
