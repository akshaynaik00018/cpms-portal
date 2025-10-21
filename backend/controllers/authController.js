const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Student = require('../models/Student');
const Company = require('../models/Company');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, password, role, ...additionalData } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'student',
      phone: additionalData.phone
    });

    // Create role-specific profile
    if (role === 'student' && additionalData.rollNumber) {
      await Student.create({
        user: user._id,
        rollNumber: additionalData.rollNumber,
        department: additionalData.department,
        batch: additionalData.batch,
        cgpa: additionalData.cgpa || 0,
        tenthMarks: additionalData.tenthMarks,
        twelfthMarks: additionalData.twelfthMarks
      });
    } else if (role === 'company' && additionalData.companyName) {
      await Company.create({
        user: user._id,
        companyName: additionalData.companyName,
        industry: additionalData.industry,
        location: additionalData.location,
        hrName: additionalData.hrName,
        hrEmail: additionalData.hrEmail,
        hrPhone: additionalData.hrPhone
      });
    }

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      if (!user.isActive) {
        return res.status(401).json({ message: 'Account is deactivated' });
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      phone: req.user.phone
    };

    // Get role-specific profile
    if (req.user.role === 'student') {
      const student = await Student.findOne({ user: req.user._id });
      user.profile = student;
    } else if (req.user.role === 'company') {
      const company = await Company.findOne({ user: req.user._id });
      user.profile = company;
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  register,
  login,
  getMe
};
