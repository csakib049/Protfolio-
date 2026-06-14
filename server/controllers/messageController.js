import Message from '../models/Message.js';

export const getAll = async (req, res) => {
  const items = await Message.find().sort('-createdAt');
  res.json(items);
};

export const create = async (req, res) => {
  const item = await Message.create(req.body);
  res.status(201).json(item);
};

export const markRead = async (req, res) => {
  const item = await Message.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
};

export const remove = async (req, res) => {
  const item = await Message.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'Deleted' });
};
