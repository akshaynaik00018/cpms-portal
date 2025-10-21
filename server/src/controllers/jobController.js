const Job = require('../models/Job');
const Application = require('../models/Application');

exports.createJob = async (req, res) => {
  const job = await Job.create({ ...req.body, company: req.user._id });
  res.status(201).json(job);
};

exports.listJobs = async (req, res) => {
  const { q, status, branch, minCgpa, type } = req.query;
  const filter = {};
  if (q) filter.title = { $regex: q, $options: 'i' };
  if (status) filter.status = status;
  if (type) filter.jobType = type;
  if (branch) filter.eligibleBranches = branch;
  if (minCgpa) filter.minCgpa = { $lte: Number(minCgpa) };
  const jobs = await Job.find(filter).populate('company', 'name companyName logoUrl');
  res.json(jobs);
};

exports.getJob = async (req, res) => {
  const job = await Job.findById(req.params.id).populate('company', 'name companyName logoUrl');
  if (!job) return res.status(404).json({ message: 'Job not found' });
  res.json(job);
};

exports.updateJob = async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ message: 'Job not found' });
  if (job.company.toString() !== req.user._id.toString() && !['tpo','admin'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  Object.assign(job, req.body);
  await job.save();
  res.json(job);
};

exports.deleteJob = async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ message: 'Job not found' });
  if (job.company.toString() !== req.user._id.toString() && !['tpo','admin'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  await Application.deleteMany({ job: job._id });
  await job.deleteOne();
  res.json({ success: true });
};
