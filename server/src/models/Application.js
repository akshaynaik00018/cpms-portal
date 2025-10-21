const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    resumeUrl: String,
    coverLetter: String,
    status: {
      type: String,
      enum: ['applied', 'shortlisted', 'rejected', 'interview_scheduled', 'offered', 'accepted', 'declined'],
      default: 'applied',
    },
    feedback: String,
  },
  { timestamps: true }
);

ApplicationSchema.index({ job: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('Application', ApplicationSchema);
