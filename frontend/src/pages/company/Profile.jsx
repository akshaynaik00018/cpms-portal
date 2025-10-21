import React, { useState, useEffect } from 'react';
import { companyAPI } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { FaSave, FaEdit } from 'react-icons/fa';

const CompanyProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await companyAPI.getDashboard();
      setProfile(response.data.company);
      setFormData(response.data.company);
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
      await companyAPI.update(profile._id, formData);
      toast.success('Profile updated successfully');
      setProfile(formData);
      setEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  if (loading) {
    return <div className="flex-center"><div className="spinner"></div></div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Company Profile</h1>
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
            <h3 className="mb-3">Company Information</h3>
            
            <div className="form-group">
              <label>Company Name</label>
              <input
                type="text"
                name="companyName"
                className="form-control"
                value={formData?.companyName || ''}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>

            <div className="form-group">
              <label>Industry</label>
              <input
                type="text"
                name="industry"
                className="form-control"
                value={formData?.industry || ''}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>

            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                name="location"
                className="form-control"
                value={formData?.location || ''}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>

            <div className="form-group">
              <label>Website</label>
              <input
                type="url"
                name="website"
                className="form-control"
                value={formData?.website || ''}
                onChange={handleChange}
                disabled={!editing}
                placeholder="https://example.com"
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                className="form-control"
                value={formData?.description || ''}
                onChange={handleChange}
                disabled={!editing}
                rows="4"
                placeholder="Brief description about your company"
              />
            </div>
          </div>

          <div className="card">
            <h3 className="mb-3">HR Contact Information</h3>
            
            <div className="form-group">
              <label>HR Name</label>
              <input
                type="text"
                name="hrName"
                className="form-control"
                value={formData?.hrName || ''}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>

            <div className="form-group">
              <label>HR Email</label>
              <input
                type="email"
                name="hrEmail"
                className="form-control"
                value={formData?.hrEmail || ''}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>

            <div className="form-group">
              <label>HR Phone</label>
              <input
                type="tel"
                name="hrPhone"
                className="form-control"
                value={formData?.hrPhone || ''}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>

            <div className="form-group">
              <label>Logo URL</label>
              <input
                type="url"
                name="logo"
                className="form-control"
                value={formData?.logo || ''}
                onChange={handleChange}
                disabled={!editing}
                placeholder="https://example.com/logo.png"
              />
            </div>

            <div className="form-group">
              <label>Verification Status</label>
              <div>
                {profile?.isVerified ? (
                  <span className="badge badge-success">Verified</span>
                ) : (
                  <span className="badge badge-warning">Pending Verification</span>
                )}
              </div>
            </div>
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

export default CompanyProfile;
