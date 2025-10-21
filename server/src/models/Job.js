const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    jobType: { type: String, enum: ['full-time', 'internship'], default: 'full-time' },
    location: String,
    stipend: Number,
    salary: Number,
    eligibleBranches: [String],
    minCgpa: { type: Number, default: 0 },
    graduationYears: [Number],
    applicationDeadline: { type: Date, required: true },
    status: { type: String, enum: ['draft', 'open', 'closed'], default: 'open' },
    attachments: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', JobSchema);
