const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: true
  },
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
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  round: {
    type: Number,
    required: true
  },
  roundType: {
    type: String,
    enum: ['aptitude', 'technical', 'hr', 'coding', 'group_discussion'],
    required: true
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  scheduledTime: {
    type: String
  },
  venue: {
    type: String
  },
  meetingLink: {
    type: String
  },
  mode: {
    type: String,
    enum: ['online', 'offline'],
    default: 'offline'
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled', 'rescheduled'],
    default: 'scheduled'
  },
  result: {
    type: String,
    enum: ['pending', 'passed', 'failed'],
    default: 'pending'
  },
  feedback: {
    type: String
  },
  score: {
    type: Number
  },
  notes: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Interview', interviewSchema);
