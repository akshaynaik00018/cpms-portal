const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  companyName: {
    type: String,
    required: true,
    unique: true
  },
  industry: {
    type: String,
    required: true
  },
  website: {
    type: String
  },
  description: {
    type: String
  },
  logo: {
    type: String
  },
  location: {
    type: String
  },
  hrName: {
    type: String
  },
  hrEmail: {
    type: String
  },
  hrPhone: {
    type: String
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Company', companySchema);
