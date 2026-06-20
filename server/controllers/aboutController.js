import About from '../models/About.js';

export const getAll = async (req, res) => {
  const items = await About.find().sort('order');
  res.json(items);
};

export const create = async (req, res) => {
  const item = await About.create(req.body);
  res.status(201).json(item);
};

export const update = async (req, res) => {
  const item = await About.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
};

export const remove = async (req, res) => {
  const item = await About.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'Deleted' });
};
