import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { companyAPI } from '../../utils/api';
import { toast } from 'react-toastify';
import { FaBriefcase, FaFileAlt, FaCheckCircle, FaUsers } from 'react-icons/fa';
import { format } from 'date-fns';

const CompanyDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await companyAPI.getDashboard();
      setDashboardData(response.data);
    } catch (error) {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex-center" style={{ minHeight: '400px' }}><div className="spinner"></div></div>;
  }

  const { company, jobs, applications, statistics } = dashboardData || {};

  const getStatusBadge = (status) => {
    const statusMap = {
      applied: 'badge-info',
      shortlisted: 'badge-warning',
      selected: 'badge-success',
      rejected: 'badge-danger'
    };
    return statusMap[status] || 'badge-secondary';
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Welcome, {company?.companyName}!</h1>
          <p className="text-secondary">Manage your recruitment activities</p>
        </div>
        {!company?.isVerified && (
          <div className="verification-notice">
            <span className="badge badge-warning">Pending Verification</span>
            <p className="text-sm mt-1">Your account is pending admin verification</p>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#dbeafe' }}>
            <FaBriefcase style={{ color: '#1e40af' }} />
          </div>
          <div className="stat-content">
            <h3>{statistics?.totalJobs || 0}</h3>
            <p>Total Jobs</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#d1fae5' }}>
            <FaCheckCircle style={{ color: '#065f46' }} />
          </div>
          <div className="stat-content">
            <h3>{statistics?.openJobs || 0}</h3>
            <p>Active Jobs</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#fef3c7' }}>
            <FaFileAlt style={{ color: '#92400e' }} />
          </div>
          <div className="stat-content">
            <h3>{statistics?.totalApplications || 0}</h3>
            <p>Applications</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#e0e7ff' }}>
            <FaUsers style={{ color: '#3730a3' }} />
          </div>
          <div className="stat-content">
            <h3>{statistics?.shortlisted || 0}</h3>
            <p>Shortlisted</p>
          </div>
        </div>
      </div>

      {/* Jobs and Applications */}
      <div className="grid grid-2 mt-4">
        <div className="card">
          <div className="card-header">
            <h3>Active Job Postings</h3>
            <Link to="/company/jobs" className="btn btn-primary btn-sm">
              Post New Job
            </Link>
          </div>
          <div className="list-container">
            {jobs && jobs.filter(j => j.status === 'open').length > 0 ? (
              jobs.filter(j => j.status === 'open').slice(0, 5).map((job) => (
                <div key={job._id} className="list-item">
                  <div>
                    <h4>{job.title}</h4>
                    <p className="text-secondary">{job.jobType} • {job.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">
                      Deadline: {format(new Date(job.applicationDeadline), 'MMM dd')}
                    </p>
                    <span className="badge badge-success">{job.status}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>No active jobs</p>
                <Link to="/company/jobs" className="btn btn-primary btn-sm mt-2">
                  Post a Job
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Recent Applications</h3>
            <Link to="/company/applications" className="btn btn-outline btn-sm">
              View All
            </Link>
          </div>
          <div className="list-container">
            {applications && applications.length > 0 ? (
              applications.slice(0, 5).map((app) => (
                <div key={app._id} className="list-item">
                  <div>
                    <h4>{app.student?.user?.name}</h4>
                    <p className="text-secondary">
                      {app.job?.title} • Applied {format(new Date(app.appliedDate), 'MMM dd')}
                    </p>
                  </div>
                  <span className={`badge ${getStatusBadge(app.status)}`}>
                    {app.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>No applications yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx="true">{`
        .verification-notice {
          text-align: right;
        }

        .verification-notice p {
          color: var(--text-secondary);
          margin: 0;
        }
      `}</style>
    </div>
  );
};

export default CompanyDashboard;
