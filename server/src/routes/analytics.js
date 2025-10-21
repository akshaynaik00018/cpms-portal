const router = require('express').Router();
const { auth, requireRoles } = require('../middleware/auth');
const analyticsController = require('../controllers/analyticsController');

router.get('/summary', auth(), requireRoles('tpo','admin'), analyticsController.summary);
router.get('/stats', auth(), requireRoles('tpo','admin'), analyticsController.placementStats);
router.get('/export-applications', auth(), requireRoles('tpo','admin'), analyticsController.exportApplicationsCsv);

module.exports = router;
