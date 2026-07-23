import MediaCoverage from '../models/MediaCoverage.js';

export const getAll = async (req, res) => {
  const items = await MediaCoverage.find().sort({ createdAt: -1 });
  res.json(items);
};

export const create = async (req, res) => {
  const data = { ...req.body };
  if (req.file) data.image = `/uploads/${req.file.filename}`;
  const item = await MediaCoverage.create(data);
  res.status(201).json(item);
};

export const update = async (req, res) => {
  const data = { ...req.body };
  if (req.file) data.image = `/uploads/${req.file.filename}`;
  const item = await MediaCoverage.findByIdAndUpdate(req.params.id, data, { new: true });
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
};

export const remove = async (req, res) => {
  const item = await MediaCoverage.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'Deleted' });
};
