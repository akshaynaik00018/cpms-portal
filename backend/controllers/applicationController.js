const Application = require('../models/Application');
const Student = require('../models/Student');
const Job = require('../models/Job');

// @desc    Apply for a job
// @route   POST /api/applications
// @access  Private/Student
const applyForJob = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    const { jobId, coverLetter } = req.body;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      student: student._id
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'Already applied for this job' });
    }

    // Check eligibility
    if (student.cgpa < job.eligibility.minCGPA) {
      return res.status(400).json({ message: 'CGPA requirement not met' });
    }

    if (student.backlogs > job.eligibility.maxBacklogs) {
      return res.status(400).json({ message: 'Backlog limit exceeded' });
    }

    // Create application
    const application = await Application.create({
      job: jobId,
      student: student._id,
      coverLetter,
      resumeUsed: student.resume
    });

    const populatedApplication = await Application.findById(application._id)
      .populate('job')
      .populate('student');

    res.status(201).json(populatedApplication);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all applications
// @route   GET /api/applications
// @access  Private
const getApplications = async (req, res) => {
  try {
    let filter = {};
    
    if (req.user.role === 'student') {
      const student = await Student.findOne({ user: req.user._id });
      filter.student = student._id;
    } else if (req.user.role === 'company') {
      const Company = require('../models/Company');
      const company = await Company.findOne({ user: req.user._id });
      const jobs = await Job.find({ company: company._id });
      filter.job = { $in: jobs.map(job => job._id) };
    }

    const { status, jobId } = req.query;
    if (status) filter.status = status;
    if (jobId) filter.job = jobId;

    const applications = await Application.find(filter)
      .populate({
        path: 'student',
        populate: { path: 'user', select: 'name email phone' }
      })
      .populate({
        path: 'job',
        populate: { path: 'company', select: 'companyName' }
      })
      .sort({ appliedDate: -1 });
    
    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get application by ID
// @route   GET /api/applications/:id
// @access  Private
const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate({
        path: 'student',
        populate: { path: 'user', select: 'name email phone' }
      })
      .populate({
        path: 'job',
        populate: { path: 'company', select: 'companyName industry location' }
      });
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    res.json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update application status
// @route   PUT /api/applications/:id
// @access  Private/Company/Admin
const updateApplicationStatus = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const { status, currentRound, roundResult, finalPackage } = req.body;

    if (status) application.status = status;
    if (currentRound !== undefined) application.currentRound = currentRound;
    if (finalPackage) application.finalPackage = finalPackage;
    
    if (roundResult) {
      application.roundResults.push(roundResult);
    }

    application.updatedAt = Date.now();
    await application.save();

    // If selected, update student placement status
    if (status === 'selected') {
      const job = await Job.findById(application.job).populate('company');
      await Student.findByIdAndUpdate(application.student, {
        placementStatus: 'placed',
        placedCompany: job.company.companyName,
        package: finalPackage || job.package.max
      });
    }

    const populatedApplication = await Application.findById(application._id)
      .populate('student')
      .populate('job');

    res.json(populatedApplication);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Withdraw application
// @route   DELETE /api/applications/:id
// @access  Private/Student
const withdrawApplication = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    const application = await Application.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.student.toString() !== student._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await application.deleteOne();
    res.json({ message: 'Application withdrawn' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  applyForJob,
  getApplications,
  getApplicationById,
  updateApplicationStatus,
  withdrawApplication
};
