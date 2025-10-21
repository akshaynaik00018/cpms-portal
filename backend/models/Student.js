const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rollNumber: {
    type: String,
    required: true,
    unique: true
  },
  department: {
    type: String,
    required: true
  },
  batch: {
    type: String,
    required: true
  },
  cgpa: {
    type: Number,
    required: true,
    min: 0,
    max: 10
  },
  skills: [{
    type: String
  }],
  resume: {
    type: String, // URL to resume file
  },
  linkedIn: {
    type: String
  },
  github: {
    type: String
  },
  portfolio: {
    type: String
  },
  tenthMarks: {
    type: Number,
    min: 0,
    max: 100
  },
  twelfthMarks: {
    type: Number,
    min: 0,
    max: 100
  },
  backlogs: {
    type: Number,
    default: 0
  },
  placementStatus: {
    type: String,
    enum: ['not_placed', 'in_process', 'placed'],
    default: 'not_placed'
  },
  placedCompany: {
    type: String
  },
  package: {
    type: Number // In LPA
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Student', studentSchema);
