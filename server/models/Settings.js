import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  theme: { type: String, default: 'green', enum: ['green', 'cyan', 'maroon', 'orange', 'red', 'purple', 'pink', 'violet', 'blue', 'cyprus', 'burgundy', 'crayola-red', 'dracula', 'nord'] },
}, { timestamps: true });

export default mongoose.model('Settings', settingsSchema);
