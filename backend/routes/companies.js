const express = require('express');
const router = express.Router();
const {
  getCompanies,
  getCompanyById,
  updateCompany,
  verifyCompany,
  getCompanyDashboard
} = require('../controllers/companyController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, getCompanies);
router.get('/dashboard/my', protect, authorize('company'), getCompanyDashboard);
router.get('/:id', protect, getCompanyById);
router.put('/:id', protect, updateCompany);
router.put('/:id/verify', protect, authorize('admin'), verifyCompany);

module.exports = router;
