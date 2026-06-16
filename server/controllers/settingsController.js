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
