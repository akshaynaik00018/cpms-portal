const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllUsers,
  toggleUserStatus,
  deleteUser
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.get('/dashboard', protect, authorize('admin'), getDashboardStats);
router.get('/users', protect, authorize('admin'), getAllUsers);
router.put('/users/:id/toggle-status', protect, authorize('admin'), toggleUserStatus);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);

module.exports = router;
