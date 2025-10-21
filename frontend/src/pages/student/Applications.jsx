import React, { useState, useEffect } from 'react';
import { applicationAPI } from '../../utils/api';
import { toast } from 'react-toastify';
import { FaFileAlt, FaEye, FaTrash } from 'react-icons/fa';
import { format } from 'date-fns';

const StudentApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchApplications();
  }, [filter]);

  const fetchApplications = async () => {
    try {
      const params = filter !== 'all' ? { status: filter } : {};
      const response = await applicationAPI.getAll(params);
      setApplications(response.data);
    } catch (error) {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (id) => {
    if (!window.confirm('Are you sure you want to withdraw this application?')) {
      return;
    }

    try {
      await applicationAPI.withdraw(id);
      toast.success('Application withdrawn successfully');
      fetchApplications();
    } catch (error) {
      toast.error('Failed to withdraw application');
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      applied: { class: 'badge-info', text: 'Applied' },
      shortlisted: { class: 'badge-warning', text: 'Shortlisted' },
      selected: { class: 'badge-success', text: 'Selected' },
      rejected: { class: 'badge-danger', text: 'Rejected' },
      on_hold: { class: 'badge-secondary', text: 'On Hold' }
    };
    return statusMap[status] || statusMap.applied;
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
          <h1>My Applications</h1>
          <p className="text-secondary">Track all your job applications</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs mb-4">
        <button 
          className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Applications
        </button>
        <button 
          className={`filter-tab ${filter === 'applied' ? 'active' : ''}`}
          onClick={() => setFilter('applied')}
        >
          Applied
        </button>
        <button 
          className={`filter-tab ${filter === 'shortlisted' ? 'active' : ''}`}
          onClick={() => setFilter('shortlisted')}
        >
          Shortlisted
        </button>
        <button 
          className={`filter-tab ${filter === 'selected' ? 'active' : ''}`}
          onClick={() => setFilter('selected')}
        >
          Selected
        </button>
        <button 
          className={`filter-tab ${filter === 'rejected' ? 'active' : ''}`}
          onClick={() => setFilter('rejected')}
        >
          Rejected
        </button>
      </div>

      {applications.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <FaFileAlt style={{ fontSize: '4rem', opacity: 0.3 }} />
            <h3>No applications found</h3>
            <p>Start applying to jobs to see them here</p>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Company</th>
                  <th>Applied Date</th>
                  <th>Status</th>
                  <th>Current Round</th>
                  <th>Round Results</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app._id}>
                    <td>
                      <strong>{app.job?.title}</strong>
                      <br />
                      <span className="text-sm text-secondary">{app.job?.jobType}</span>
                    </td>
                    <td>{app.job?.company?.companyName}</td>
                    <td>{format(new Date(app.appliedDate), 'MMM dd, yyyy')}</td>
                    <td>
                      <span className={`badge ${getStatusBadge(app.status).class}`}>
                        {getStatusBadge(app.status).text}
                      </span>
                    </td>
                    <td>Round {app.currentRound}</td>
                    <td>
                      {app.roundResults && app.roundResults.length > 0 ? (
                        <div className="round-results">
                          {app.roundResults.map((result, index) => (
                            <div key={index} className="round-result-item">
                              <span className="text-sm">
                                Round {result.round}:
                              </span>
                              <span className={`badge badge-sm ${
                                result.status === 'cleared' ? 'badge-success' : 
                                result.status === 'failed' ? 'badge-danger' : 
                                'badge-secondary'
                              }`}>
                                {result.status}
                              </span>
                              {result.score && <span className="text-sm">({result.score})</span>}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-secondary text-sm">No results yet</span>
                      )}
                    </td>
                    <td>
                      <div className="action-buttons">
                        {app.status === 'applied' && (
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleWithdraw(app._id)}
                          >
                            <FaTrash /> Withdraw
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <style jsx="true">{`
        .filter-tabs {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .filter-tab {
          padding: 0.5rem 1rem;
          border: 1px solid var(--border-color);
          background-color: var(--card-bg);
          color: var(--text-secondary);
          border-radius: 0.375rem;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .filter-tab:hover {
          background-color: var(--bg-color);
        }

        .filter-tab.active {
          background-color: var(--primary-color);
          color: white;
          border-color: var(--primary-color);
        }

        .round-results {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .round-result-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .badge-sm {
          padding: 0.125rem 0.5rem;
          font-size: 0.688rem;
        }

        .action-buttons {
          display: flex;
          gap: 0.5rem;
        }

        @media (max-width: 768px) {
          .table-responsive {
            overflow-x: scroll;
          }

          .table {
            min-width: 800px;
          }
        }
      `}</style>
    </div>
  );
};

export default StudentApplications;
