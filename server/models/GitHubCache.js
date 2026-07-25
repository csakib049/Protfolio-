import mongoose from 'mongoose';

const gitHubCacheSchema = new mongoose.Schema({
  key: { type: String, default: 'main', unique: true },
  data: mongoose.Schema.Types.Mixed,
  lastSynced: { type: Date, default: null },
}, { timestamps: true });

export default mongoose.model('GitHubCache', gitHubCacheSchema);
