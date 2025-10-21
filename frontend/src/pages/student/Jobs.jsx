import React, { useState, useEffect } from 'react';
import { jobAPI, applicationAPI } from '../../utils/api';
import { toast } from 'react-toastify';
import { FaBriefcase, FaMapMarkerAlt, FaRupeeSign, FaClock, FaCheckCircle } from 'react-icons/fa';
import { format } from 'date-fns';

const StudentJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await jobAPI.getEligible();
      setJobs(response.data);
    } catch (error) {
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (job) => {
    setSelectedJob(job);
    setShowModal(true);
  };

  const submitApplication = async () => {
    if (!selectedJob) return;
    
    setApplying(true);
    try {
      await applicationAPI.apply({
        jobId: selectedJob._id,
        coverLetter
      });
      toast.success('Application submitted successfully!');
      setShowModal(false);
      setCoverLetter('');
      fetchJobs();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
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
        <div>
          <h1>Available Jobs</h1>
          <p className="text-secondary">Jobs matching your eligibility criteria</p>
        </div>
      </div>

      {jobs.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <FaBriefcase style={{ fontSize: '4rem', opacity: 0.3 }} />
            <h3>No jobs available</h3>
            <p>Check back later for new opportunities</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-2">
          {jobs.map((job) => (
            <div key={job._id} className="card job-card">
              <div className="job-header">
                <div className="company-logo">
                  {job.company?.logo ? (
                    <img src={job.company.logo} alt={job.company.companyName} />
                  ) : (
                    <FaBriefcase />
                  )}
                </div>
                <div>
                  <h3>{job.title}</h3>
                  <p className="company-name">{job.company?.companyName}</p>
                </div>
              </div>

              <div className="job-details">
                <div className="detail-row">
                  <FaMapMarkerAlt />
                  <span>{job.location}</span>
                </div>
                <div className="detail-row">
                  <FaRupeeSign />
                  <span>
                    {job.package?.min} - {job.package?.max} LPA
                  </span>
                </div>
                <div className="detail-row">
                  <FaClock />
                  <span>Deadline: {format(new Date(job.applicationDeadline), 'MMM dd, yyyy')}</span>
                </div>
              </div>

              <div className="job-tags">
                <span className="badge badge-info">{job.jobType}</span>
                <span className="badge badge-secondary">{job.status}</span>
              </div>

              <div className="job-description">
                <p>{job.description.substring(0, 150)}...</p>
              </div>

              {job.skillsRequired && job.skillsRequired.length > 0 && (
                <div className="skills-required">
                  <strong>Skills:</strong>
                  <div className="skills-list">
                    {job.skillsRequired.map((skill, index) => (
                      <span key={index} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="eligibility-info">
                <strong>Eligibility:</strong>
                <ul>
                  <li>Min CGPA: {job.eligibility?.minCGPA}</li>
                  <li>Max Backlogs: {job.eligibility?.maxBacklogs}</li>
                  {job.eligibility?.departments?.length > 0 && (
                    <li>Departments: {job.eligibility.departments.join(', ')}</li>
                  )}
                </ul>
              </div>

              <button 
                className="btn btn-primary btn-block mt-3"
                onClick={() => handleApply(job)}
              >
                Apply Now
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Application Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Apply for {selectedJob?.title}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            
            <div className="modal-body">
              <p className="mb-3">
                Company: <strong>{selectedJob?.company?.companyName}</strong>
              </p>
              
              <div className="form-group">
                <label>Cover Letter (Optional)</label>
                <textarea
                  className="form-control"
                  rows="6"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Write a brief cover letter explaining why you're interested in this position..."
                />
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="btn btn-outline" 
                onClick={() => setShowModal(false)}
                disabled={applying}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={submitApplication}
                disabled={applying}
              >
                {applying ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx="true">{`
        .job-card {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .job-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border-color);
        }

        .company-logo {
          width: 60px;
          height: 60px;
          border-radius: 0.5rem;
          background-color: var(--bg-color);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          color: var(--primary-color);
          border: 1px solid var(--border-color);
        }

        .company-logo img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .job-header h3 {
          margin: 0;
          font-size: 1.25rem;
        }

        .company-name {
          color: var(--text-secondary);
          margin: 0.25rem 0 0 0;
        }

        .job-details {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .detail-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-secondary);
          font-size: 0.875rem;
        }

        .job-tags {
          display: flex;
          gap: 0.5rem;
        }

        .job-description {
          color: var(--text-secondary);
          font-size: 0.875rem;
          line-height: 1.5;
        }

        .skills-required {
          font-size: 0.875rem;
        }

        .skills-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }

        .skill-tag {
          background-color: var(--bg-color);
          padding: 0.25rem 0.75rem;
          border-radius: 0.25rem;
          font-size: 0.75rem;
          border: 1px solid var(--border-color);
        }

        .eligibility-info {
          font-size: 0.875rem;
          background-color: var(--bg-color);
          padding: 1rem;
          border-radius: 0.5rem;
        }

        .eligibility-info ul {
          margin: 0.5rem 0 0 1.5rem;
          padding: 0;
        }

        .eligibility-info li {
          margin: 0.25rem 0;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }

        .modal-content {
          background-color: var(--card-bg);
          border-radius: 0.75rem;
          max-width: 600px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: var(--shadow-lg);
        }

        .modal-header {
          padding: 1.5rem;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-header h2 {
          margin: 0;
          font-size: 1.5rem;
        }

        .modal-close {
          background: none;
          border: none;
          font-size: 2rem;
          cursor: pointer;
          color: var(--text-secondary);
          line-height: 1;
        }

        .modal-body {
          padding: 1.5rem;
        }

        .modal-footer {
          padding: 1.5rem;
          border-top: 1px solid var(--border-color);
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
        }
      `}</style>
    </div>
  );
};

export default StudentJobs;
