const Student = require('../models/Student');
const Company = require('../models/Company');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Interview = require('../models/Interview');
const User = require('../models/User');

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    // User statistics
    const totalStudents = await Student.countDocuments();
    const totalCompanies = await Company.countDocuments();
    const verifiedCompanies = await Company.countDocuments({ isVerified: true });
    const totalAdmins = await User.countDocuments({ role: 'admin' });

    // Placement statistics
    const placedStudents = await Student.countDocuments({ placementStatus: 'placed' });
    const inProcessStudents = await Student.countDocuments({ placementStatus: 'in_process' });
    const notPlacedStudents = await Student.countDocuments({ placementStatus: 'not_placed' });

    // Job statistics
    const totalJobs = await Job.countDocuments();
    const openJobs = await Job.countDocuments({ status: 'open' });
    const closedJobs = await Job.countDocuments({ status: 'closed' });

    // Application statistics
    const totalApplications = await Application.countDocuments();
    const appliedApplications = await Application.countDocuments({ status: 'applied' });
    const shortlistedApplications = await Application.countDocuments({ status: 'shortlisted' });
    const selectedApplications = await Application.countDocuments({ status: 'selected' });
    const rejectedApplications = await Application.countDocuments({ status: 'rejected' });

    // Interview statistics
    const totalInterviews = await Interview.countDocuments();
    const scheduledInterviews = await Interview.countDocuments({ status: 'scheduled' });
    const completedInterviews = await Interview.countDocuments({ status: 'completed' });

    // Placement rate
    const placementRate = totalStudents > 0 
      ? ((placedStudents / totalStudents) * 100).toFixed(2) 
      : 0;

    // Recent placements
    const recentPlacements = await Student.find({ placementStatus: 'placed' })
      .populate('user', 'name email')
      .sort({ updatedAt: -1 })
      .limit(10);

    // Department-wise placement
    const departmentStats = await Student.aggregate([
      {
        $group: {
          _id: '$department',
          total: { $sum: 1 },
          placed: {
            $sum: { $cond: [{ $eq: ['$placementStatus', 'placed'] }, 1, 0] }
          }
        }
      }
    ]);

    // Top recruiters
    const topRecruiters = await Application.aggregate([
      { $match: { status: 'selected' } },
      {
        $lookup: {
          from: 'jobs',
          localField: 'job',
          foreignField: '_id',
          as: 'jobDetails'
        }
      },
      { $unwind: '$jobDetails' },
      {
        $lookup: {
          from: 'companies',
          localField: 'jobDetails.company',
          foreignField: '_id',
          as: 'companyDetails'
        }
      },
      { $unwind: '$companyDetails' },
      {
        $group: {
          _id: '$companyDetails.companyName',
          selections: { $sum: 1 }
        }
      },
      { $sort: { selections: -1 } },
      { $limit: 5 }
    ]);

    // Package statistics
    const packageStats = await Student.aggregate([
      { $match: { placementStatus: 'placed', package: { $exists: true } } },
      {
        $group: {
          _id: null,
          avgPackage: { $avg: '$package' },
          maxPackage: { $max: '$package' },
          minPackage: { $min: '$package' }
        }
      }
    ]);

    res.json({
      users: {
        totalStudents,
        totalCompanies,
        verifiedCompanies,
        totalAdmins
      },
      placements: {
        placedStudents,
        inProcessStudents,
        notPlacedStudents,
        placementRate
      },
      jobs: {
        totalJobs,
        openJobs,
        closedJobs
      },
      applications: {
        totalApplications,
        appliedApplications,
        shortlistedApplications,
        selectedApplications,
        rejectedApplications
      },
      interviews: {
        totalInterviews,
        scheduledInterviews,
        completedInterviews
      },
      recentPlacements,
      departmentStats,
      topRecruiters,
      packageStats: packageStats[0] || { avgPackage: 0, maxPackage: 0, minPackage: 0 }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const { role, isActive } = req.query;
    let filter = {};
    
    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Toggle user status
// @route   PUT /api/admin/users/:id/toggle-status
// @access  Private/Admin
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete associated profile
    if (user.role === 'student') {
      await Student.deleteOne({ user: user._id });
      await Application.deleteMany({ student: user._id });
      await Interview.deleteMany({ student: user._id });
    } else if (user.role === 'company') {
      const company = await Company.findOne({ user: user._id });
      if (company) {
        await Job.deleteMany({ company: company._id });
      }
      await Company.deleteOne({ user: user._id });
    }

    await user.deleteOne();

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  toggleUserStatus,
  deleteUser
};
