import React, { useState, useEffect } from 'react';
import { applicationAPI } from '../../utils/api';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const CompanyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await applicationAPI.getAll();
      setApplications(response.data);
    } catch (error) {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await applicationAPI.updateStatus(id, { status });
      toast.success('Application status updated');
      fetchApplications();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const viewDetails = (app) => {
    setSelectedApp(app);
    setShowModal(true);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      applied: 'badge-info',
      shortlisted: 'badge-warning',
      selected: 'badge-success',
      rejected: 'badge-danger'
    };
    return statusMap[status] || 'badge-secondary';
  };

  if (loading) {
    return <div className="flex-center"><div className="spinner"></div></div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Applications</h1>
      </div>

      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Job Title</th>
                <th>Applied Date</th>
                <th>CGPA</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app._id}>
                  <td>
                    <div>
                      <strong>{app.student?.user?.name}</strong>
                      <br />
                      <span className="text-sm text-secondary">
                        {app.student?.rollNumber} • {app.student?.department}
                      </span>
                    </div>
                  </td>
                  <td>{app.job?.title}</td>
                  <td>{format(new Date(app.appliedDate), 'MMM dd, yyyy')}</td>
                  <td>{app.student?.cgpa?.toFixed(2)}</td>
                  <td>
                    <span className={`badge ${getStatusBadge(app.status)}`}>
                      {app.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => viewDetails(app)}
                      >
                        View
                      </button>
                      {app.status === 'applied' && (
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleUpdateStatus(app._id, 'shortlisted')}
                        >
                          Shortlist
                        </button>
                      )}
                      {app.status === 'shortlisted' && (
                        <>
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleUpdateStatus(app._id, 'selected')}
                          >
                            Select
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleUpdateStatus(app._id, 'rejected')}
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {showModal && selectedApp && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Application Details</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            
            <div className="modal-body">
              <h4>Student Information</h4>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Name:</span>
                  <span className="detail-value">{selectedApp.student?.user?.name}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{selectedApp.student?.user?.email}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Roll Number:</span>
                  <span className="detail-value">{selectedApp.student?.rollNumber}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Department:</span>
                  <span className="detail-value">{selectedApp.student?.department}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">CGPA:</span>
                  <span className="detail-value">{selectedApp.student?.cgpa?.toFixed(2)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Backlogs:</span>
                  <span className="detail-value">{selectedApp.student?.backlogs || 0}</span>
                </div>
              </div>

              {selectedApp.student?.skills && selectedApp.student.skills.length > 0 && (
                <>
                  <h4 className="mt-3">Skills</h4>
                  <div className="skills-list">
                    {selectedApp.student.skills.map((skill, index) => (
                      <span key={index} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                </>
              )}

              {selectedApp.coverLetter && (
                <>
                  <h4 className="mt-3">Cover Letter</h4>
                  <p className="cover-letter">{selectedApp.coverLetter}</p>
                </>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx="true">{`
        .action-buttons {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-top: 1rem;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .detail-label {
          font-weight: 500;
          color: var(--text-secondary);
          font-size: 0.875rem;
        }

        .detail-value {
          font-weight: 600;
          color: var(--text-primary);
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
          font-size: 0.875rem;
          border: 1px solid var(--border-color);
        }

        .cover-letter {
          background-color: var(--bg-color);
          padding: 1rem;
          border-radius: 0.5rem;
          margin-top: 0.5rem;
          line-height: 1.6;
        }
      `}</style>
    </div>
  );
};

export default CompanyApplications;
