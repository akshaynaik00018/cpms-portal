const path = require('path');

exports.uploadResume = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  const url = `/uploads/resumes/${req.file.filename}`;
  res.json({ url });
};

exports.uploadLogo = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  const url = `/uploads/logos/${req.file.filename}`;
  res.json({ url });
};
