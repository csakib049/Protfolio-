import Profile from '../models/Profile.js';

export const getProfile = async (req, res) => {
  let profile = await Profile.findOne();
  if (!profile) {
    profile = await Profile.create({ bio: '', photo: '' });
  }
  res.json(profile);
};

export const updateBio = async (req, res) => {
  let profile = await Profile.findOne();
  if (!profile) {
    profile = await Profile.create({ bio: req.body.bio || '', photo: '' });
  } else {
    profile.bio = req.body.bio || profile.bio;
    await profile.save();
  }
  res.json(profile);
};

export const uploadPhoto = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  const photoUrl = `/uploads/${req.file.filename}`;
  let profile = await Profile.findOne();
  if (!profile) {
    profile = await Profile.create({ bio: '', photo: photoUrl });
  } else {
    profile.photo = photoUrl;
    await profile.save();
  }
  res.json(profile);
};
