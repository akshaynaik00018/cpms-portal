const router = require('express').Router();
const { auth, requireRoles } = require('../middleware/auth');
const jobController = require('../controllers/jobController');

router.get('/', auth(false), jobController.listJobs);
router.get('/:id', auth(false), jobController.getJob);
router.post('/', auth(), requireRoles('company','tpo','admin'), jobController.createJob);
router.put('/:id', auth(), requireRoles('company','tpo','admin'), jobController.updateJob);
router.delete('/:id', auth(), requireRoles('company','tpo','admin'), jobController.deleteJob);

module.exports = router;
