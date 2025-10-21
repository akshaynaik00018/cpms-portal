import React, { useState, useEffect } from 'react';
import { jobAPI, companyAPI } from '../../utils/api';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { format } from 'date-fns';

const CompanyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    jobType: 'full-time',
    location: '',
    package: { min: '', max: '' },
    eligibility: {
      minCGPA: '',
      departments: '',
      batches: '',
      maxBacklogs: 0
    },
    skillsRequired: '',
    applicationDeadline: '',
    totalPositions: 1
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await companyAPI.getDashboard();
      setJobs(response.data.jobs);
    } catch (error) {
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: { ...formData[parent], [child]: value }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const jobData = {
      ...formData,
      skillsRequired: formData.skillsRequired.split(',').map(s => s.trim()),
      eligibility: {
        ...formData.eligibility,
        departments: formData.eligibility.departments.split(',').map(s => s.trim()),
        batches: formData.eligibility.batches.split(',').map(s => s.trim())
      }
    };

    try {
      if (editingJob) {
        await jobAPI.update(editingJob._id, jobData);
        toast.success('Job updated successfully');
      } else {
        await jobAPI.create(jobData);
        toast.success('Job posted successfully');
      }
      setShowModal(false);
      resetForm();
      fetchJobs();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save job');
    }
  };

  const handleEdit = (job) => {
    setEditingJob(job);
    setFormData({
      ...job,
      skillsRequired: job.skillsRequired.join(', '),
      eligibility: {
        ...job.eligibility,
        departments: job.eligibility.departments.join(', '),
        batches: job.eligibility.batches.join(', ')
      }
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    
    try {
      await jobAPI.delete(id);
      toast.success('Job deleted successfully');
      fetchJobs();
    } catch (error) {
      toast.error('Failed to delete job');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      jobType: 'full-time',
      location: '',
      package: { min: '', max: '' },
      eligibility: {
        minCGPA: '',
        departments: '',
        batches: '',
        maxBacklogs: 0
      },
      skillsRequired: '',
      applicationDeadline: '',
      totalPositions: 1
    });
    setEditingJob(null);
  };

  if (loading) {
    return <div className="flex-center"><div className="spinner"></div></div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Job Postings</h1>
        <button 
          className="btn btn-primary"
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
        >
          <FaPlus /> Post New Job
        </button>
      </div>

      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Type</th>
                <th>Location</th>
                <th>Package</th>
                <th>Deadline</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job._id}>
                  <td><strong>{job.title}</strong></td>
                  <td><span className="badge badge-info">{job.jobType}</span></td>
                  <td>{job.location}</td>
                  <td>{job.package?.min} - {job.package?.max} LPA</td>
                  <td>{format(new Date(job.applicationDeadline), 'MMM dd, yyyy')}</td>
                  <td>
                    <span className={`badge ${
                      job.status === 'open' ? 'badge-success' : 'badge-secondary'
                    }`}>
                      {job.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => handleEdit(job)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(job._id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Job Form Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content large-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingJob ? 'Edit Job' : 'Post New Job'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal-body">
              <div className="grid grid-2">
                <div className="form-group">
                  <label>Job Title *</label>
                  <input
                    type="text"
                    name="title"
                    className="form-control"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Job Type *</label>
                  <select
                    name="jobType"
                    className="form-control"
                    value={formData.jobType}
                    onChange={handleChange}
                    required
                  >
                    <option value="full-time">Full Time</option>
                    <option value="internship">Internship</option>
                    <option value="part-time">Part Time</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  name="description"
                  className="form-control"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  required
                />
              </div>

              <div className="grid grid-2">
                <div className="form-group">
                  <label>Location *</label>
                  <input
                    type="text"
                    name="location"
                    className="form-control"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Total Positions *</label>
                  <input
                    type="number"
                    name="totalPositions"
                    className="form-control"
                    value={formData.totalPositions}
                    onChange={handleChange}
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-2">
                <div className="form-group">
                  <label>Min Package (LPA) *</label>
                  <input
                    type="number"
                    name="package.min"
                    className="form-control"
                    value={formData.package.min}
                    onChange={handleChange}
                    step="0.1"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Max Package (LPA) *</label>
                  <input
                    type="number"
                    name="package.max"
                    className="form-control"
                    value={formData.package.max}
                    onChange={handleChange}
                    step="0.1"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Application Deadline *</label>
                <input
                  type="date"
                  name="applicationDeadline"
                  className="form-control"
                  value={formData.applicationDeadline ? formData.applicationDeadline.split('T')[0] : ''}
                  onChange={handleChange}
                  required
                />
              </div>

              <h4 className="mt-3 mb-2">Eligibility Criteria</h4>

              <div className="grid grid-2">
                <div className="form-group">
                  <label>Minimum CGPA *</label>
                  <input
                    type="number"
                    name="eligibility.minCGPA"
                    className="form-control"
                    value={formData.eligibility.minCGPA}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    max="10"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Max Backlogs</label>
                  <input
                    type="number"
                    name="eligibility.maxBacklogs"
                    className="form-control"
                    value={formData.eligibility.maxBacklogs}
                    onChange={handleChange}
                    min="0"
                  />
                </div>
              </div>

              <div className="grid grid-2">
                <div className="form-group">
                  <label>Eligible Departments (comma separated)</label>
                  <input
                    type="text"
                    name="eligibility.departments"
                    className="form-control"
                    value={formData.eligibility.departments}
                    onChange={handleChange}
                    placeholder="e.g., Computer Science, IT"
                  />
                </div>

                <div className="form-group">
                  <label>Eligible Batches (comma separated)</label>
                  <input
                    type="text"
                    name="eligibility.batches"
                    className="form-control"
                    value={formData.eligibility.batches}
                    onChange={handleChange}
                    placeholder="e.g., 2024, 2025"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Skills Required (comma separated)</label>
                <input
                  type="text"
                  name="skillsRequired"
                  className="form-control"
                  value={formData.skillsRequired}
                  onChange={handleChange}
                  placeholder="e.g., JavaScript, React, Node.js"
                />
              </div>
            </form>

            <div className="modal-footer">
              <button 
                className="btn btn-outline" 
                onClick={() => setShowModal(false)}
                type="button"
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleSubmit}
              >
                {editingJob ? 'Update Job' : 'Post Job'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx="true">{`
        .action-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .large-modal {
          max-width: 800px;
        }
      `}</style>
    </div>
  );
};

export default CompanyJobs;
