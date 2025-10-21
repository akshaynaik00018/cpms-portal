const router = require('express').Router();
const { auth, requireRoles } = require('../middleware/auth');
const User = require('../models/User');

router.get('/', auth(), requireRoles('tpo','admin'), async (req, res) => {
  const users = await User.find().select('-passwordHash');
  res.json(users);
});

router.get('/students', auth(), async (req, res) => {
  const filter = { role: 'student' };
  if (req.query.branch) filter.branch = req.query.branch;
  const users = await User.find(filter).select('-passwordHash');
  res.json(users);
});

router.put('/me', auth(), async (req, res) => {
  const allowed = [
    'name','phone','branch','graduationYear','cgpa','skills','resumeUrl','companyName','website','logoUrl','verified'
  ];
  const updates = {};
  for (const key of allowed) if (key in req.body) updates[key] = req.body[key];
  Object.assign(req.user, updates);
  await req.user.save();
  res.json(req.user);
});

module.exports = router;
