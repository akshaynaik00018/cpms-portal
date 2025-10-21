const Application = require('../models/Application');
const Job = require('../models/Job');
const { createNotification } = require('../utils/notify');

exports.apply = async (req, res) => {
  const job = await Job.findById(req.params.jobId);
  if (!job) return res.status(404).json({ message: 'Job not found' });
  const payload = {
    job: job._id,
    student: req.user._id,
    resumeUrl: req.body.resumeUrl || req.user.resumeUrl,
    coverLetter: req.body.coverLetter || '',
  };
  try {
    const app = await Application.create(payload);
    // Notify company and student
    await Promise.all([
      createNotification(job.company, 'application_created', 'New application', `${req.user.name} applied for ${job.title}`, { jobId: job._id, applicationId: app._id }),
      createNotification(req.user._id, 'application_submitted', 'Application submitted', `You applied for ${job.title}`, { jobId: job._id, applicationId: app._id })
    ]);
    res.status(201).json(app);
  } catch (e) {
    if (e.code === 11000) return res.status(400).json({ message: 'Already applied' });
    throw e;
  }
};

exports.listForJob = async (req, res) => {
  const apps = await Application.find({ job: req.params.jobId })
    .populate('student', 'name email rollNumber branch cgpa resumeUrl')
    .sort({ createdAt: -1 });
  res.json(apps);
};

exports.listMyApplications = async (req, res) => {
  const apps = await Application.find({ student: req.user._id }).populate('job');
  res.json(apps);
};

exports.updateStatus = async (req, res) => {
  const app = await Application.findById(req.params.id).populate('job');
  if (!app) return res.status(404).json({ message: 'Application not found' });
  const isOwner = app.job.company.toString() === req.user._id.toString();
  if (!isOwner && !['tpo','admin'].includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });
  const { status, feedback } = req.body;
  if (status) app.status = status;
  if (feedback !== undefined) app.feedback = feedback;
  await app.save();
  await createNotification(app.student, 'application_status', 'Application status updated', `Your application is now ${app.status}`, { applicationId: app._id, status: app.status });
  res.json(app);
};
