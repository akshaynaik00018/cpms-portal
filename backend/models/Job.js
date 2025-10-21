const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  jobType: {
    type: String,
    enum: ['full-time', 'internship', 'part-time'],
    default: 'full-time'
  },
  package: {
    min: Number,
    max: Number
  },
  location: {
    type: String,
    required: true
  },
  eligibility: {
    minCGPA: {
      type: Number,
      default: 0
    },
    departments: [{
      type: String
    }],
    batches: [{
      type: String
    }],
    maxBacklogs: {
      type: Number,
      default: 0
    }
  },
  skillsRequired: [{
    type: String
  }],
  applicationDeadline: {
    type: Date,
    required: true
  },
  driveDate: {
    type: Date
  },
  totalPositions: {
    type: Number,
    default: 1
  },
  status: {
    type: String,
    enum: ['open', 'closed', 'cancelled'],
    default: 'open'
  },
  rounds: [{
    roundName: String,
    roundType: {
      type: String,
      enum: ['aptitude', 'technical', 'hr', 'coding', 'group_discussion']
    },
    date: Date
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Job', jobSchema);
