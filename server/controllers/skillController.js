import Skill from '../models/Skill.js';

export const getAll = async (req, res) => {
  const items = await Skill.find().sort('order');
  res.json(items);
};

export const create = async (req, res) => {
  const data = { ...req.body };
  if (req.file) data.logo = `/uploads/${req.file.filename}`;
  const item = await Skill.create(data);
  res.status(201).json(item);
};

export const update = async (req, res) => {
  const data = { ...req.body };
  if (req.file) data.logo = `/uploads/${req.file.filename}`;
  const item = await Skill.findByIdAndUpdate(req.params.id, data, { new: true });
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
};

export const remove = async (req, res) => {
  const item = await Skill.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'Deleted' });
};

export const syncLogos = async (req, res) => {
  const nameToFile = {
    'HTML': 'html.png',
    'CSS': 'CSS.png',
    'JavaScript': 'JS.png',
    'JS': 'JS.png',
    'TypeScript': 'TS.png',
    'TS': 'TS.png',
    'React': 'React.png',
    'Tailwind CSS': 'Tailwind.png',
    'Tailwind': 'Tailwind.png',
    'Node.js': 'NodeJS.png',
    'NodeJS': 'NodeJS.png',
    'Express': 'express.png',
    'Express.js': 'express.png',
    'MongoDB': 'Mongo.png',
    'Mongo': 'Mongo.png',
    'SQL': 'SQL.png',
    'Python': 'python.png',
    'Java': 'java.png',
    'C': 'c.png',
    'C++': 'cpp.png',
    'Cpp': 'cpp.png',
    'Docker': 'docker.png',
    'Git': 'git.png',
    'GitHub': 'github.png',
  };
  const skills = await Skill.find();
  let updated = 0;
  for (const skill of skills) {
    const file = nameToFile[skill.name];
    if (file) {
      skill.logo = `/uploads/${file}`;
      await skill.save();
      updated++;
    }
  }
  res.json({ message: `Updated ${updated} of ${skills.length} skills` });
};
