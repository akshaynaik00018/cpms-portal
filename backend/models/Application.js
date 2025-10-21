const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  status: {
    type: String,
    enum: ['applied', 'shortlisted', 'rejected', 'selected', 'on_hold'],
    default: 'applied'
  },
  appliedDate: {
    type: Date,
    default: Date.now
  },
  resumeUsed: {
    type: String
  },
  coverLetter: {
    type: String
  },
  currentRound: {
    type: Number,
    default: 0
  },
  roundResults: [{
    round: Number,
    status: {
      type: String,
      enum: ['pending', 'cleared', 'failed']
    },
    score: Number,
    feedback: String,
    date: Date
  }],
  finalPackage: {
    type: Number
  },
  offerLetterUrl: {
    type: String
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create compound index to ensure a student can apply to a job only once
applicationSchema.index({ job: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
