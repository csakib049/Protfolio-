import Achievement from '../models/Achievement.js';

export const getAll = async (req, res) => {
  const items = await Achievement.find().sort('order');
  for (const item of items) {
    if ((!item.images || item.images.length === 0) && item.image) {
      await Achievement.findByIdAndUpdate(item._id, { images: [item.image] });
    }
  }
  const result = await Achievement.find().sort('order');
  res.json(result);
};

export const create = async (req, res) => {
  const data = { ...req.body };
  const uploaded = (req.files || []).map(f => `/uploads/${f.filename}`);
  if (uploaded.length) data.images = uploaded;
  const item = await Achievement.create(data);
  res.status(201).json(item);
};

export const update = async (req, res) => {
  const data = { ...req.body };
  const uploaded = (req.files || []).map(f => `/uploads/${f.filename}`);
  let existingImages = [];
  if (req.body.existingImages) {
    try {
      existingImages = JSON.parse(req.body.existingImages);
    } catch {
      existingImages = req.body.existingImages.split(',').filter(Boolean);
    }
  }
  data.images = [...existingImages, ...uploaded];
  delete data.image;
  const item = await Achievement.findByIdAndUpdate(req.params.id, data, { new: true });
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
};

export const remove = async (req, res) => {
  const item = await Achievement.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'Deleted' });
};
