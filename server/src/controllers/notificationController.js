const Notification = require('../models/Notification');

exports.listMy = async (req, res) => {
  const list = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(100);
  res.json(list);
};

exports.markRead = async (req, res) => {
  const note = await Notification.findOne({ _id: req.params.id, user: req.user._id });
  if (!note) return res.status(404).json({ message: 'Not found' });
  note.read = true;
  await note.save();
  res.json(note);
};
