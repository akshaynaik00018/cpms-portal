const Student = require('../models/Student');
const User = require('../models/User');
const Application = require('../models/Application');
const Interview = require('../models/Interview');

// @desc    Get all students
// @route   GET /api/students
// @access  Private/Admin
const getStudents = async (req, res) => {
  try {
    const { department, batch, placementStatus } = req.query;
    let filter = {};
    
    if (department) filter.department = department;
    if (batch) filter.batch = batch;
    if (placementStatus) filter.placementStatus = placementStatus;

    const students = await Student.find(filter)
      .populate('user', 'name email phone')
      .sort({ cgpa: -1 });
    
    res.json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get student profile
// @route   GET /api/students/:id
// @access  Private
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('user', 'name email phone');
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    res.json(student);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update student profile
// @route   PUT /api/students/:id
// @access  Private/Student
const updateStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check if user owns this profile or is admin
    if (student.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this profile' });
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('user', 'name email phone');
    
    res.json(updatedStudent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get student dashboard data
// @route   GET /api/students/dashboard/my
// @access  Private/Student
const getStudentDashboard = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id })
      .populate('user', 'name email phone');
    
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    // Get applications
    const applications = await Application.find({ student: student._id })
      .populate({
        path: 'job',
        populate: { path: 'company', select: 'companyName industry' }
      })
      .sort({ appliedDate: -1 })
      .limit(10);

    // Get upcoming interviews
    const upcomingInterviews = await Interview.find({
      student: student._id,
      scheduledDate: { $gte: new Date() },
      status: 'scheduled'
    })
      .populate('job', 'title')
      .populate('company', 'companyName')
      .sort({ scheduledDate: 1 })
      .limit(5);

    // Get statistics
    const totalApplications = await Application.countDocuments({ student: student._id });
    const shortlisted = await Application.countDocuments({ 
      student: student._id, 
      status: 'shortlisted' 
    });
    const selected = await Application.countDocuments({ 
      student: student._id, 
      status: 'selected' 
    });

    res.json({
      student,
      applications,
      upcomingInterviews,
      statistics: {
        totalApplications,
        shortlisted,
        selected
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getStudents,
  getStudentById,
  updateStudent,
  getStudentDashboard
};
