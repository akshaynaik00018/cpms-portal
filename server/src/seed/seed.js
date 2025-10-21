require('dotenv').config();
const mongoose = require('mongoose');
const { connectDb } = require('../utils/db');
const User = require('../models/User');
const Job = require('../models/Job');

async function run() {
  await connectDb();
  await Promise.all([User.deleteMany({}), Job.deleteMany({})]);
  const passwordHash = await User.hashPassword('password123');
  const tpo = await User.create({ name: 'TPO Admin', email: 'tpo@example.com', passwordHash, role: 'tpo', verified: true });
  const company = await User.create({ name: 'HR Tesla', email: 'hr@tesla.com', passwordHash, role: 'company', companyName: 'Tesla', verified: true });
  const student = await User.create({ name: 'Alice Student', email: 'alice@college.edu', passwordHash, role: 'student', branch: 'CSE', graduationYear: 2026, cgpa: 8.5 });
  await Job.create({ title: 'Software Engineer', description: 'Build cool EV software', company: company._id, jobType: 'full-time', location: 'Bengaluru', salary: 1800000, eligibleBranches: ['CSE','ECE'], minCgpa: 7.0, graduationYears: [2025,2026], applicationDeadline: new Date(Date.now() + 30*24*3600*1000) });
  console.log('Seed complete');
  await mongoose.disconnect();
}

run().catch((e) => { console.error(e); process.exit(1); });
