const express = require('express');
const router = express.Router();
const {
  scheduleInterview,
  getInterviews,
  getInterviewById,
  updateInterview,
  cancelInterview
} = require('../controllers/interviewController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, getInterviews);
router.post('/', protect, authorize('company', 'admin'), scheduleInterview);
router.get('/:id', protect, getInterviewById);
router.put('/:id', protect, authorize('company', 'admin'), updateInterview);
router.delete('/:id', protect, authorize('company', 'admin'), cancelInterview);

module.exports = router;
