import React, { useState, useEffect } from 'react';
import { interviewAPI } from '../../utils/api';
import { toast } from 'react-toastify';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaVideo, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { format } from 'date-fns';

const StudentInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('scheduled');

  useEffect(() => {
    fetchInterviews();
  }, [filter]);

  const fetchInterviews = async () => {
    try {
      const params = { status: filter };
      const response = await interviewAPI.getAll(params);
      setInterviews(response.data);
    } catch (error) {
      toast.error('Failed to load interviews');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      scheduled: { class: 'badge-info', text: 'Scheduled' },
      completed: { class: 'badge-success', text: 'Completed' },
      cancelled: { class: 'badge-danger', text: 'Cancelled' },
      rescheduled: { class: 'badge-warning', text: 'Rescheduled' }
    };
    return statusMap[status] || statusMap.scheduled;
  };

  const getResultBadge = (result) => {
    const resultMap = {
      pending: { class: 'badge-secondary', text: 'Pending' },
      passed: { class: 'badge-success', text: 'Passed' },
      failed: { class: 'badge-danger', text: 'Failed' }
    };
    return resultMap[result] || resultMap.pending;
  };

  const getRoundTypeLabel = (type) => {
    const typeMap = {
      aptitude: 'Aptitude Test',
      technical: 'Technical Round',
      hr: 'HR Round',
      coding: 'Coding Test',
      group_discussion: 'Group Discussion'
    };
    return typeMap[type] || type;
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
          <h1>My Interviews</h1>
          <p className="text-secondary">Manage your interview schedule</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs mb-4">
        <button 
          className={`filter-tab ${filter === 'scheduled' ? 'active' : ''}`}
          onClick={() => setFilter('scheduled')}
        >
          Scheduled
        </button>
        <button 
          className={`filter-tab ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
        <button 
          className={`filter-tab ${filter === 'cancelled' ? 'active' : ''}`}
          onClick={() => setFilter('cancelled')}
        >
          Cancelled
        </button>
      </div>

      {interviews.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <FaCalendarAlt style={{ fontSize: '4rem', opacity: 0.3' }} />
            <h3>No interviews found</h3>
            <p>Your interview schedule will appear here</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-2">
          {interviews.map((interview) => (
            <div key={interview._id} className="card interview-card">
              <div className="interview-header">
                <div>
                  <h3>{interview.job?.title}</h3>
                  <p className="company-name">{interview.company?.companyName}</p>
                </div>
                <span className={`badge ${getStatusBadge(interview.status).class}`}>
                  {getStatusBadge(interview.status).text}
                </span>
              </div>

              <div className="interview-details">
                <div className="detail-item">
                  <span className="detail-label">Round:</span>
                  <span className="detail-value">
                    Round {interview.round} - {getRoundTypeLabel(interview.roundType)}
                  </span>
                </div>

                <div className="detail-item">
                  <FaCalendarAlt />
                  <span>{format(new Date(interview.scheduledDate), 'EEEE, MMMM dd, yyyy')}</span>
                </div>

                {interview.scheduledTime && (
                  <div className="detail-item">
                    <FaClock />
                    <span>{interview.scheduledTime}</span>
                  </div>
                )}

                <div className="detail-item">
                  {interview.mode === 'online' ? <FaVideo /> : <FaMapMarkerAlt />}
                  <span>
                    {interview.mode === 'online' ? 'Online Interview' : `Venue: ${interview.venue || 'TBA'}`}
                  </span>
                </div>

                {interview.mode === 'online' && interview.meetingLink && (
                  <div className="detail-item">
                    <a 
                      href={interview.meetingLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="meeting-link"
                    >
                      Join Meeting →
                    </a>
                  </div>
                )}

                {interview.status === 'completed' && (
                  <div className="result-section">
                    <div className="detail-item">
                      <span className="detail-label">Result:</span>
                      <span className={`badge ${getResultBadge(interview.result).class}`}>
                        {getResultBadge(interview.result).text}
                      </span>
                    </div>

                    {interview.score && (
                      <div className="detail-item">
                        <span className="detail-label">Score:</span>
                        <span className="detail-value">{interview.score}</span>
                      </div>
                    )}

                    {interview.feedback && (
                      <div className="feedback-section">
                        <strong>Feedback:</strong>
                        <p>{interview.feedback}</p>
                      </div>
                    )}
                  </div>
                )}

                {interview.notes && (
                  <div className="notes-section">
                    <strong>Notes:</strong>
                    <p>{interview.notes}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
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

        .interview-card {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .interview-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border-color);
        }

        .interview-header h3 {
          margin: 0;
          font-size: 1.125rem;
        }

        .company-name {
          color: var(--text-secondary);
          margin: 0.25rem 0 0 0;
          font-size: 0.875rem;
        }

        .interview-details {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
        }

        .detail-label {
          font-weight: 600;
          color: var(--text-secondary);
        }

        .detail-value {
          color: var(--text-primary);
        }

        .meeting-link {
          color: var(--primary-color);
          text-decoration: none;
          font-weight: 600;
        }

        .meeting-link:hover {
          text-decoration: underline;
        }

        .result-section {
          background-color: var(--bg-color);
          padding: 1rem;
          border-radius: 0.5rem;
          margin-top: 0.5rem;
        }

        .feedback-section,
        .notes-section {
          background-color: var(--bg-color);
          padding: 1rem;
          border-radius: 0.5rem;
          font-size: 0.875rem;
        }

        .feedback-section p,
        .notes-section p {
          margin: 0.5rem 0 0 0;
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
};

export default StudentInterviews;
