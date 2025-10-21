const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['student', 'company', 'tpo', 'admin'], required: true },

    // Student fields
    rollNumber: String,
    branch: String,
    graduationYear: Number,
    cgpa: Number,
    skills: [String],
    resumeUrl: String,

    // Company fields
    companyName: String,
    website: String,
    logoUrl: String,

    // Common
    phone: String,
    verified: { type: Boolean, default: false },
    lastLoginAt: Date,
  },
  { timestamps: true }
);

UserSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

UserSchema.statics.hashPassword = async function (password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

module.exports = mongoose.model('User', UserSchema);
