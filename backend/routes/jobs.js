const express = require('express');
const router = express.Router();
const {
  getJobs,
  getEligibleJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob
} = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, getJobs);
router.get('/eligible', protect, authorize('student'), getEligibleJobs);
router.get('/:id', protect, getJobById);
router.post('/', protect, authorize('company', 'admin'), createJob);
router.put('/:id', protect, authorize('company', 'admin'), updateJob);
router.delete('/:id', protect, authorize('company', 'admin'), deleteJob);

module.exports = router;
