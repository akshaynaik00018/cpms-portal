const Company = require('../models/Company');
const Job = require('../models/Job');
const Application = require('../models/Application');

// @desc    Get all companies
// @route   GET /api/companies
// @access  Private
const getCompanies = async (req, res) => {
  try {
    const { isVerified, industry } = req.query;
    let filter = {};
    
    if (isVerified !== undefined) filter.isVerified = isVerified === 'true';
    if (industry) filter.industry = industry;

    const companies = await Company.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(companies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get company by ID
// @route   GET /api/companies/:id
// @access  Private
const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id)
      .populate('user', 'name email');
    
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    
    // Get jobs posted by this company
    const jobs = await Job.find({ company: company._id })
      .sort({ createdAt: -1 });
    
    res.json({ company, jobs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update company profile
// @route   PUT /api/companies/:id
// @access  Private/Company
const updateCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Check if user owns this profile or is admin
    if (company.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this profile' });
    }

    const updatedCompany = await Company.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('user', 'name email');
    
    res.json(updatedCompany);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Verify company (Admin only)
// @route   PUT /api/companies/:id/verify
// @access  Private/Admin
const verifyCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    company.isVerified = true;
    await company.save();
    
    res.json(company);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get company dashboard
// @route   GET /api/companies/dashboard/my
// @access  Private/Company
const getCompanyDashboard = async (req, res) => {
  try {
    const company = await Company.findOne({ user: req.user._id })
      .populate('user', 'name email');
    
    if (!company) {
      return res.status(404).json({ message: 'Company profile not found' });
    }

    // Get jobs posted
    const jobs = await Job.find({ company: company._id })
      .sort({ createdAt: -1 });

    // Get applications for all jobs
    const jobIds = jobs.map(job => job._id);
    const applications = await Application.find({ job: { $in: jobIds } })
      .populate('student')
      .populate('job', 'title')
      .sort({ appliedDate: -1 })
      .limit(20);

    // Statistics
    const totalJobs = jobs.length;
    const openJobs = jobs.filter(job => job.status === 'open').length;
    const totalApplications = await Application.countDocuments({ job: { $in: jobIds } });
    const shortlisted = await Application.countDocuments({ 
      job: { $in: jobIds }, 
      status: 'shortlisted' 
    });

    res.json({
      company,
      jobs,
      applications,
      statistics: {
        totalJobs,
        openJobs,
        totalApplications,
        shortlisted
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getCompanies,
  getCompanyById,
  updateCompany,
  verifyCompany,
  getCompanyDashboard
};
