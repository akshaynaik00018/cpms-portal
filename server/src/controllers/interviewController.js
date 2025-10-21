const Interview = require('../models/Interview');
const Application = require('../models/Application');
const { createNotification } = require('../utils/notify');

exports.schedule = async (req, res) => {
  const application = await Application.findById(req.params.applicationId).populate('job');
  if (!application) return res.status(404).json({ message: 'Application not found' });
  const isOwner = application.job.company.toString() === req.user._id.toString();
  if (!isOwner && !['tpo','admin'].includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });

  const interview = await Interview.create({ ...req.body, application: application._id });
  await createNotification(application.student, 'interview_scheduled', 'Interview scheduled', 'Check your interview details', { applicationId: application._id, interviewId: interview._id });
  res.status(201).json(interview);
};

exports.listForApplication = async (req, res) => {
  const interviews = await Interview.find({ application: req.params.applicationId }).sort({ date: 1 });
  res.json(interviews);
};

exports.update = async (req, res) => {
  const interview = await Interview.findById(req.params.id).populate({ path: 'application', populate: 'job' });
  if (!interview) return res.status(404).json({ message: 'Interview not found' });
  const isOwner = interview.application.job.company.toString() === req.user._id.toString();
  if (!isOwner && !['tpo','admin'].includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });

  Object.assign(interview, req.body);
  await interview.save();
  await createNotification(interview.application.student, 'interview_updated', 'Interview updated', 'Your interview details changed', { interviewId: interview._id });
  res.json(interview);
};
