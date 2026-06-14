import Testimonial from '../models/Testimonial.js';

export const getAll = async (req, res) => {
  const items = await Testimonial.find().sort('order');
  res.json(items);
};

export const create = async (req, res) => {
  const data = { ...req.body };
  if (req.file) data.avatar = `/uploads/${req.file.filename}`;
  const item = await Testimonial.create(data);
  res.status(201).json(item);
};

export const update = async (req, res) => {
  const data = { ...req.body };
  if (req.file) data.avatar = `/uploads/${req.file.filename}`;
  const item = await Testimonial.findByIdAndUpdate(req.params.id, data, { new: true });
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
};

export const remove = async (req, res) => {
  const item = await Testimonial.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'Deleted' });
};
