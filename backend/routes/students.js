const express = require('express');
const router = express.Router();
const {
  getStudents,
  getStudentById,
  updateStudent,
  getStudentDashboard
} = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, authorize('admin'), getStudents);
router.get('/dashboard/my', protect, authorize('student'), getStudentDashboard);
router.get('/:id', protect, getStudentById);
router.put('/:id', protect, updateStudent);

module.exports = router;
