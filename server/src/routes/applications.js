const router = require('express').Router();
const { auth, requireRoles } = require('../middleware/auth');
const applicationController = require('../controllers/applicationController');

router.get('/me', auth(), requireRoles('student'), applicationController.listMyApplications);
router.post('/:jobId', auth(), requireRoles('student'), applicationController.apply);
router.get('/job/:jobId', auth(), requireRoles('company','tpo','admin'), applicationController.listForJob);
router.put('/:id', auth(), requireRoles('company','tpo','admin'), applicationController.updateStatus);

module.exports = router;
