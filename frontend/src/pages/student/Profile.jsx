import React, { useState, useEffect } from 'react';
import { studentAPI } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { FaSave, FaEdit } from 'react-icons/fa';

const StudentProfile = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await studentAPI.getDashboard();
      setProfile(response.data.student);
      setFormData(response.data.student);
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await studentAPI.update(profile._id, formData);
      toast.success('Profile updated successfully');
      setProfile(formData);
      setEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleSkillsChange = (e) => {
    const skills = e.target.value.split(',').map(s => s.trim());
    setFormData({ ...formData, skills });
  };

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '400px' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>My Profile</h1>
        <button 
          className={`btn ${editing ? 'btn-secondary' : 'btn-primary'}`}
          onClick={() => setEditing(!editing)}
        >
          {editing ? 'Cancel' : <><FaEdit /> Edit Profile</>}
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-2">
          <div className="card">
            <h3 className="mb-3">Personal Information</h3>
            
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                className="form-control"
                value={user?.name}
                disabled
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                value={user?.email}
                disabled
              />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                className="form-control"
                value={user?.phone || ''}
                disabled
              />
            </div>
          </div>

          <div className="card">
            <h3 className="mb-3">Academic Information</h3>
            
            <div className="form-group">
              <label>Roll Number</label>
              <input
                type="text"
                className="form-control"
                value={profile?.rollNumber}
                disabled
              />
            </div>

            <div className="form-group">
              <label>Department</label>
              <input
                type="text"
                name="department"
                className="form-control"
                value={formData?.department || ''}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>

            <div className="form-group">
              <label>Batch</label>
              <input
                type="text"
                name="batch"
                className="form-control"
                value={formData?.batch || ''}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>

            <div className="form-group">
              <label>CGPA</label>
              <input
                type="number"
                name="cgpa"
                className="form-control"
                value={formData?.cgpa || ''}
                onChange={handleChange}
                disabled={!editing}
                step="0.01"
                min="0"
                max="10"
              />
            </div>

            <div className="form-group">
              <label>Backlogs</label>
              <input
                type="number"
                name="backlogs"
                className="form-control"
                value={formData?.backlogs || 0}
                onChange={handleChange}
                disabled={!editing}
                min="0"
              />
            </div>
          </div>
        </div>

        <div className="card mt-4">
          <h3 className="mb-3">Academic Performance</h3>
          <div className="grid grid-2">
            <div className="form-group">
              <label>10th Marks (%)</label>
              <input
                type="number"
                name="tenthMarks"
                className="form-control"
                value={formData?.tenthMarks || ''}
                onChange={handleChange}
                disabled={!editing}
                min="0"
                max="100"
              />
            </div>

            <div className="form-group">
              <label>12th Marks (%)</label>
              <input
                type="number"
                name="twelfthMarks"
                className="form-control"
                value={formData?.twelfthMarks || ''}
                onChange={handleChange}
                disabled={!editing}
                min="0"
                max="100"
              />
            </div>
          </div>
        </div>

        <div className="card mt-4">
          <h3 className="mb-3">Skills & Links</h3>
          
          <div className="form-group">
            <label>Skills (comma separated)</label>
            <textarea
              name="skills"
              className="form-control"
              value={formData?.skills?.join(', ') || ''}
              onChange={handleSkillsChange}
              disabled={!editing}
              rows="3"
              placeholder="e.g., JavaScript, React, Node.js, Python"
            />
          </div>

          <div className="form-group">
            <label>LinkedIn Profile</label>
            <input
              type="url"
              name="linkedIn"
              className="form-control"
              value={formData?.linkedIn || ''}
              onChange={handleChange}
              disabled={!editing}
              placeholder="https://linkedin.com/in/username"
            />
          </div>

          <div className="form-group">
            <label>GitHub Profile</label>
            <input
              type="url"
              name="github"
              className="form-control"
              value={formData?.github || ''}
              onChange={handleChange}
              disabled={!editing}
              placeholder="https://github.com/username"
            />
          </div>

          <div className="form-group">
            <label>Portfolio Website</label>
            <input
              type="url"
              name="portfolio"
              className="form-control"
              value={formData?.portfolio || ''}
              onChange={handleChange}
              disabled={!editing}
              placeholder="https://yourportfolio.com"
            />
          </div>

          <div className="form-group">
            <label>Resume URL</label>
            <input
              type="url"
              name="resume"
              className="form-control"
              value={formData?.resume || ''}
              onChange={handleChange}
              disabled={!editing}
              placeholder="Link to your resume (Google Drive, Dropbox, etc.)"
            />
          </div>
        </div>

        {editing && (
          <div className="mt-4 flex gap-2">
            <button type="submit" className="btn btn-primary">
              <FaSave /> Save Changes
            </button>
            <button 
              type="button" 
              className="btn btn-outline"
              onClick={() => {
                setEditing(false);
                setFormData(profile);
              }}
            >
              Cancel
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default StudentProfile;
