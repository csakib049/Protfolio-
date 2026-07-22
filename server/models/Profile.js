import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  bio: { type: String, default: '' },
  photo: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('Profile', profileSchema);
