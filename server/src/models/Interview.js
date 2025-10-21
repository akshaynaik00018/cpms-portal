const mongoose = require('mongoose');

const InterviewSchema = new mongoose.Schema(
  {
    application: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true },
    interviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    mode: { type: String, enum: ['online', 'offline'], default: 'online' },
    date: { type: Date, required: true },
    location: String,
    meetingLink: String,
    notes: String,
    result: { type: String, enum: ['pending', 'pass', 'fail'], default: 'pending' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Interview', InterviewSchema);
