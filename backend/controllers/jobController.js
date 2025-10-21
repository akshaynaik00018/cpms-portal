const Job = require('../models/Job');
const Company = require('../models/Company');
const Student = require('../models/Student');
const Application = require('../models/Application');

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Private
const getJobs = async (req, res) => {
  try {
    const { status, jobType, department, batch } = req.query;
    let filter = {};
    
    if (status) filter.status = status;
    if (jobType) filter.jobType = jobType;
    if (department) filter['eligibility.departments'] = department;
    if (batch) filter['eligibility.batches'] = batch;

    const jobs = await Job.find(filter)
      .populate('company', 'companyName industry location logo')
      .sort({ createdAt: -1 });
    
    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get eligible jobs for student
// @route   GET /api/jobs/eligible
// @access  Private/Student
const getEligibleJobs = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    const jobs = await Job.find({
      status: 'open',
      applicationDeadline: { $gte: new Date() },
      'eligibility.minCGPA': { $lte: student.cgpa },
      'eligibility.maxBacklogs': { $gte: student.backlogs },
      $or: [
        { 'eligibility.departments': { $in: [student.department] } },
        { 'eligibility.departments': { $size: 0 } }
      ],
      $or: [
        { 'eligibility.batches': { $in: [student.batch] } },
        { 'eligibility.batches': { $size: 0 } }
      ]
    })
      .populate('company', 'companyName industry location logo')
      .sort({ createdAt: -1 });
    
    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get job by ID
// @route   GET /api/jobs/:id
// @access  Private
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('company', 'companyName industry location logo website hrName hrEmail');
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    res.json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create new job
// @route   POST /api/jobs
// @access  Private/Company
const createJob = async (req, res) => {
  try {
    const company = await Company.findOne({ user: req.user._id });
    
    if (!company) {
      return res.status(404).json({ message: 'Company profile not found' });
    }

    if (!company.isVerified) {
      return res.status(403).json({ message: 'Company must be verified to post jobs' });
    }

    const job = await Job.create({
      ...req.body,
      company: company._id
    });

    const populatedJob = await Job.findById(job._id)
      .populate('company', 'companyName industry location');
    
    res.status(201).json(populatedJob);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private/Company/Admin
const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check authorization
    if (req.user.role === 'company') {
      const company = await Company.findOne({ user: req.user._id });
      if (!company || job.company.toString() !== company._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to update this job' });
      }
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('company', 'companyName industry location');
    
    res.json(updatedJob);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private/Company/Admin
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check authorization
    if (req.user.role === 'company') {
      const company = await Company.findOne({ user: req.user._id });
      if (!company || job.company.toString() !== company._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to delete this job' });
      }
    }

    await job.deleteOne();
    
    res.json({ message: 'Job removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getJobs,
  getEligibleJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob
};
