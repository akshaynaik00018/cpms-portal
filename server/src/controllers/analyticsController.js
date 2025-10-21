const Application = require('../models/Application');
const Job = require('../models/Job');
const Offer = require('../models/Offer');

exports.summary = async (req, res) => {
  const [studentsApplied, totalApplications, openJobs, offersMade] = await Promise.all([
    Application.distinct('student').then((arr) => arr.length),
    Application.countDocuments(),
    Job.countDocuments({ status: 'open' }),
    Offer.countDocuments(),
  ]);
  res.json({ studentsApplied, totalApplications, openJobs, offersMade });
};

exports.placementStats = async (req, res) => {
  const byBranch = await Application.aggregate([
    { $lookup: { from: 'users', localField: 'student', foreignField: '_id', as: 'student' } },
    { $unwind: '$student' },
    {
      $group: {
        _id: '$student.branch',
        applications: { $sum: 1 },
      },
    },
    { $project: { _id: 0, branch: '$_id', applications: 1 } },
  ]);

  const offersByCompany = await Offer.aggregate([
    { $lookup: { from: 'applications', localField: 'application', foreignField: '_id', as: 'app' } },
    { $unwind: '$app' },
    { $lookup: { from: 'jobs', localField: 'app.job', foreignField: '_id', as: 'job' } },
    { $unwind: '$job' },
    {
      $group: {
        _id: '$job.company',
        offers: { $sum: 1 },
      },
    },
  ]);

  res.json({ byBranch, offersByCompany });
};

exports.exportApplicationsCsv = async (req, res) => {
  const applications = await Application.find().populate('job').populate('student');
  const rows = applications.map((a) => ({
    jobTitle: a.job.title,
    company: a.job.company?.toString() || '',
    student: a.student.name,
    email: a.student.email,
    branch: a.student.branch || '',
    cgpa: a.student.cgpa || '',
    status: a.status,
    appliedAt: a.createdAt.toISOString(),
  }));
  const header = Object.keys(rows[0] || {}).join(',');
  const csv = [header, ...rows.map((r) => Object.values(r).join(','))].join('\n');
  res.header('Content-Type', 'text/csv');
  res.attachment('applications.csv');
  res.send(csv);
};
