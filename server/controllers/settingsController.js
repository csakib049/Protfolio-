import Settings from '../models/Settings.js';

export const get = async (req, res) => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({ theme: 'green' });
  }
  res.json(settings);
};

export const update = async (req, res) => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create(req.body);
  } else {
    Object.assign(settings, req.body);
    await settings.save();
  }
  res.json(settings);
};

export const uploadResume = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({ resume: `/uploads/${req.file.filename}` });
  } else {
    settings.resume = `/uploads/${req.file.filename}`;
    await settings.save();
  }
  res.json(settings);
};
