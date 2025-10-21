import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaBuilding, FaGraduationCap } from 'react-icons/fa';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'student',
    // Student specific
    rollNumber: '',
    department: '',
    batch: '',
    cgpa: '',
    // Company specific
    companyName: '',
    industry: '',
    location: '',
    hrName: '',
    hrEmail: '',
    hrPhone: ''
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    const result = await register(formData);
    
    if (result.success) {
      toast.success('Registration successful!');
      navigate('/');
    } else {
      toast.error(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card register-card">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Join the Placement Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Role Selection */}
          <div className="form-group">
            <label>Select Role</label>
            <select
              name="role"
              className="form-control"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="student">Student</option>
              <option value="company">Company</option>
            </select>
          </div>

          {/* Common Fields */}
          <div className="form-group">
            <label htmlFor="name">
              <FaUser /> Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">
              <FaEnvelope /> Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">
                <FaLock /> Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-control"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
                placeholder="Enter password"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">
                <FaLock /> Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="form-control"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm password"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="phone">
              <FaPhone /> Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className="form-control"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
            />
          </div>

          {/* Student Specific Fields */}
          {formData.role === 'student' && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="rollNumber">
                    <FaGraduationCap /> Roll Number
                  </label>
                  <input
                    type="text"
                    id="rollNumber"
                    name="rollNumber"
                    className="form-control"
                    value={formData.rollNumber}
                    onChange={handleChange}
                    required
                    placeholder="Roll number"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="department">Department</label>
                  <input
                    type="text"
                    id="department"
                    name="department"
                    className="form-control"
                    value={formData.department}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Computer Science"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="batch">Batch</label>
                  <input
                    type="text"
                    id="batch"
                    name="batch"
                    className="form-control"
                    value={formData.batch}
                    onChange={handleChange}
                    required
                    placeholder="e.g., 2024"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cgpa">CGPA</label>
                  <input
                    type="number"
                    id="cgpa"
                    name="cgpa"
                    className="form-control"
                    value={formData.cgpa}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    max="10"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </>
          )}

          {/* Company Specific Fields */}
          {formData.role === 'company' && (
            <>
              <div className="form-group">
                <label htmlFor="companyName">
                  <FaBuilding /> Company Name
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  className="form-control"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                  placeholder="Enter company name"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="industry">Industry</label>
                  <input
                    type="text"
                    id="industry"
                    name="industry"
                    className="form-control"
                    value={formData.industry}
                    onChange={handleChange}
                    required
                    placeholder="e.g., IT Services"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="location">Location</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    className="form-control"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g., Bangalore"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="hrName">HR Name</label>
                <input
                  type="text"
                  id="hrName"
                  name="hrName"
                  className="form-control"
                  value={formData.hrName}
                  onChange={handleChange}
                  placeholder="HR contact person"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="hrEmail">HR Email</label>
                  <input
                    type="email"
                    id="hrEmail"
                    name="hrEmail"
                    className="form-control"
                    value={formData.hrEmail}
                    onChange={handleChange}
                    placeholder="HR email"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="hrPhone">HR Phone</label>
                  <input
                    type="tel"
                    id="hrPhone"
                    name="hrPhone"
                    className="form-control"
                    value={formData.hrPhone}
                    onChange={handleChange}
                    placeholder="HR phone"
                  />
                </div>
              </div>
            </>
          )}

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Login here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
