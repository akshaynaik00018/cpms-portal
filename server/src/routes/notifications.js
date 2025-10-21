const router = require('express').Router();
const { auth } = require('../middleware/auth');
const controller = require('../controllers/notificationController');

router.get('/me', auth(), controller.listMy);
router.put('/:id/read', auth(), controller.markRead);

module.exports = router;
