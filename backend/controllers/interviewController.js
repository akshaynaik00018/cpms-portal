const Interview = require('../models/Interview');
const Application = require('../models/Application');
const Student = require('../models/Student');
const Company = require('../models/Company');

// @desc    Schedule interview
// @route   POST /api/interviews
// @access  Private/Company/Admin
const scheduleInterview = async (req, res) => {
  try {
    const {
      applicationId,
      round,
      roundType,
      scheduledDate,
      scheduledTime,
      venue,
      meetingLink,
      mode
    } = req.body;

    const application = await Application.findById(applicationId)
      .populate('job')
      .populate('student');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const interview = await Interview.create({
      application: application._id,
      job: application.job._id,
      student: application.student._id,
      company: application.job.company,
      round,
      roundType,
      scheduledDate,
      scheduledTime,
      venue,
      meetingLink,
      mode
    });

    const populatedInterview = await Interview.findById(interview._id)
      .populate('student', 'rollNumber')
      .populate({
        path: 'student',
        populate: { path: 'user', select: 'name email phone' }
      })
      .populate('job', 'title')
      .populate('company', 'companyName');

    res.status(201).json(populatedInterview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all interviews
// @route   GET /api/interviews
// @access  Private
const getInterviews = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === 'student') {
      const student = await Student.findOne({ user: req.user._id });
      filter.student = student._id;
    } else if (req.user.role === 'company') {
      const company = await Company.findOne({ user: req.user._id });
      filter.company = company._id;
    }

    const { status, date } = req.query;
    if (status) filter.status = status;
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      filter.scheduledDate = { $gte: startDate, $lt: endDate };
    }

    const interviews = await Interview.find(filter)
      .populate({
        path: 'student',
        populate: { path: 'user', select: 'name email phone' }
      })
      .populate('job', 'title')
      .populate('company', 'companyName')
      .sort({ scheduledDate: 1 });

    res.json(interviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get interview by ID
// @route   GET /api/interviews/:id
// @access  Private
const getInterviewById = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id)
      .populate({
        path: 'student',
        populate: { path: 'user', select: 'name email phone' }
      })
      .populate('job', 'title description')
      .populate('company', 'companyName location');

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    res.json(interview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update interview
// @route   PUT /api/interviews/:id
// @access  Private/Company/Admin
const updateInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    const updatedInterview = await Interview.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate({
        path: 'student',
        populate: { path: 'user', select: 'name email phone' }
      })
      .populate('job', 'title')
      .populate('company', 'companyName');

    // If result is updated, update application
    if (req.body.result && req.body.result !== 'pending') {
      const application = await Application.findById(interview.application);
      if (application) {
        application.roundResults.push({
          round: interview.round,
          status: req.body.result === 'passed' ? 'cleared' : 'failed',
          score: req.body.score,
          feedback: req.body.feedback,
          date: new Date()
        });

        if (req.body.result === 'passed') {
          application.currentRound = interview.round + 1;
        } else {
          application.status = 'rejected';
        }

        await application.save();
      }
    }

    res.json(updatedInterview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Cancel interview
// @route   DELETE /api/interviews/:id
// @access  Private/Company/Admin
const cancelInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    interview.status = 'cancelled';
    await interview.save();

    res.json({ message: 'Interview cancelled', interview });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  scheduleInterview,
  getInterviews,
  getInterviewById,
  updateInterview,
  cancelInterview
};
