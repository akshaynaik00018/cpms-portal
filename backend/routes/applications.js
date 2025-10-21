const express = require('express');
const router = express.Router();
const {
  applyForJob,
  getApplications,
  getApplicationById,
  updateApplicationStatus,
  withdrawApplication
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, getApplications);
router.post('/', protect, authorize('student'), applyForJob);
router.get('/:id', protect, getApplicationById);
router.put('/:id', protect, authorize('company', 'admin'), updateApplicationStatus);
router.delete('/:id', protect, authorize('student'), withdrawApplication);

module.exports = router;
