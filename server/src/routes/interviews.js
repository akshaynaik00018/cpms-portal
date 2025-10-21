const router = require('express').Router();
const { auth, requireRoles } = require('../middleware/auth');
const interviewController = require('../controllers/interviewController');

router.post('/:applicationId', auth(), requireRoles('company','tpo','admin'), interviewController.schedule);
router.get('/:applicationId', auth(), interviewController.listForApplication);
router.put('/update/:id', auth(), requireRoles('company','tpo','admin'), interviewController.update);

module.exports = router;
