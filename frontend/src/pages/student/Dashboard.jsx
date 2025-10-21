import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { studentAPI, applicationAPI, interviewAPI } from '../../utils/api';
import { toast } from 'react-toastify';
import { 
  FaBriefcase, FaFileAlt, FaCheckCircle, FaCalendarAlt, 
  FaChartLine, FaExclamationCircle 
} from 'react-icons/fa';
import { format } from 'date-fns';
import './Dashboard.css';

const StudentDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await studentAPI.getDashboard();
      setDashboardData(response.data);
    } catch (error) {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '400px' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  const { student, applications, upcomingInterviews, statistics } = dashboardData || {};

  const getStatusBadge = (status) => {
    const statusMap = {
      applied: 'badge-info',
      shortlisted: 'badge-warning',
      selected: 'badge-success',
      rejected: 'badge-danger',
      on_hold: 'badge-secondary'
    };
    return statusMap[status] || 'badge-secondary';
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Welcome back, {student?.user?.name}!</h1>
          <p className="text-secondary">Here's what's happening with your placement journey</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#dbeafe' }}>
            <FaFileAlt style={{ color: '#1e40af' }} />
          </div>
          <div className="stat-content">
            <h3>{statistics?.totalApplications || 0}</h3>
            <p>Applications</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#fef3c7' }}>
            <FaChartLine style={{ color: '#92400e' }} />
          </div>
          <div className="stat-content">
            <h3>{statistics?.shortlisted || 0}</h3>
            <p>Shortlisted</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#d1fae5' }}>
            <FaCheckCircle style={{ color: '#065f46' }} />
          </div>
          <div className="stat-content">
            <h3>{statistics?.selected || 0}</h3>
            <p>Selected</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#e0e7ff' }}>
            <FaBriefcase style={{ color: '#3730a3' }} />
          </div>
          <div className="stat-content">
            <h3>{student?.cgpa?.toFixed(2) || 'N/A'}</h3>
            <p>CGPA</p>
          </div>
        </div>
      </div>

      {/* Profile Quick View */}
      <div className="grid grid-2 mt-4">
        <div className="card">
          <div className="card-header">
            <h3>Profile Summary</h3>
            <Link to="/student/profile" className="btn btn-outline btn-sm">
              Edit Profile
            </Link>
          </div>
          <div className="profile-details">
            <div className="detail-item">
              <span className="detail-label">Roll Number:</span>
              <span className="detail-value">{student?.rollNumber}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Department:</span>
              <span className="detail-value">{student?.department}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Batch:</span>
              <span className="detail-value">{student?.batch}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Placement Status:</span>
              <span className={`badge ${
                student?.placementStatus === 'placed' ? 'badge-success' :
                student?.placementStatus === 'in_process' ? 'badge-warning' :
                'badge-secondary'
              }`}>
                {student?.placementStatus?.replace('_', ' ')}
              </span>
            </div>
            {student?.placedCompany && (
              <div className="detail-item">
                <span className="detail-label">Placed at:</span>
                <span className="detail-value">{student?.placedCompany} ({student?.package} LPA)</span>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Interviews */}
        <div className="card">
          <div className="card-header">
            <h3><FaCalendarAlt /> Upcoming Interviews</h3>
            <Link to="/student/interviews" className="btn btn-outline btn-sm">
              View All
            </Link>
          </div>
          <div className="list-container">
            {upcomingInterviews && upcomingInterviews.length > 0 ? (
              upcomingInterviews.map((interview) => (
                <div key={interview._id} className="list-item">
                  <div>
                    <h4>{interview.job?.title}</h4>
                    <p className="text-secondary">{interview.company?.companyName}</p>
                    <p className="text-sm">
                      Round {interview.round} - {interview.roundType.replace('_', ' ')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-weight-bold">
                      {format(new Date(interview.scheduledDate), 'MMM dd, yyyy')}
                    </p>
                    <p className="text-sm text-secondary">{interview.scheduledTime}</p>
                    <span className={`badge ${
                      interview.mode === 'online' ? 'badge-info' : 'badge-secondary'
                    }`}>
                      {interview.mode}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <FaExclamationCircle />
                <p>No upcoming interviews</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="card mt-4">
        <div className="card-header">
          <h3><FaFileAlt /> Recent Applications</h3>
          <Link to="/student/applications" className="btn btn-outline btn-sm">
            View All Applications
          </Link>
        </div>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Company</th>
                <th>Applied Date</th>
                <th>Status</th>
                <th>Current Round</th>
              </tr>
            </thead>
            <tbody>
              {applications && applications.length > 0 ? (
                applications.slice(0, 5).map((app) => (
                  <tr key={app._id}>
                    <td>{app.job?.title}</td>
                    <td>{app.job?.company?.companyName}</td>
                    <td>{format(new Date(app.appliedDate), 'MMM dd, yyyy')}</td>
                    <td>
                      <span className={`badge ${getStatusBadge(app.status)}`}>
                        {app.status}
                      </span>
                    </td>
                    <td>Round {app.currentRound}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    <div className="empty-state">
                      <FaExclamationCircle />
                      <p>No applications yet. Start applying to jobs!</p>
                      <Link to="/student/jobs" className="btn btn-primary btn-sm mt-2">
                        Browse Jobs
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
