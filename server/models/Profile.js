import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  bio: { type: String, default: '' },
  photo: { type: String, default: '' },
  smallLabel: { type: String, default: 'ABOUT ME' },
  heading: { type: String, default: 'Building Software That Solves Problems' },
  education: [{ degree: String, institution: String }],
  experienceRole: { type: String, default: '' },
  experienceCompany: { type: String, default: '' },
  interests: [{ type: String }],
  techStack: [{ type: String }],
  highlights: [{ type: String }],
}, { timestamps: true });

export default mongoose.model('Profile', profileSchema);
