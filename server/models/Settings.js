import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  theme: { type: String, default: 'green', enum: ['green', 'cyan', 'maroon', 'orange', 'red', 'purple', 'pink', 'violet', 'blue', 'cyprus', 'burgundy', 'crayola-red', 'dracula', 'nord'] },
  font: { type: String, default: 'inter', enum: ['inter', 'source-code-pro'] },
  resume: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('Settings', settingsSchema);
