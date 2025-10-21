const router = require('express').Router();
const { auth, requireRoles } = require('../middleware/auth');
const offerController = require('../controllers/offerController');

router.post('/:applicationId', auth(), requireRoles('company','tpo','admin'), offerController.create);
router.put('/:id', auth(), requireRoles('company','tpo','admin'), offerController.update);
router.get('/application/:applicationId', auth(), offerController.listForApplication);

module.exports = router;
