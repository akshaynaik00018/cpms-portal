import React, { useState, useEffect } from 'react';
import { jobAPI } from '../../utils/api';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await jobAPI.getAll();
      setJobs(response.data);
    } catch (error) {
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex-center"><div className="spinner"></div></div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Job Management</h1>
      </div>

      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Company</th>
                <th>Type</th>
                <th>Location</th>
                <th>Package</th>
                <th>Deadline</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job._id}>
                  <td><strong>{job.title}</strong></td>
                  <td>{job.company?.companyName}</td>
                  <td><span className="badge badge-info">{job.jobType}</span></td>
                  <td>{job.location}</td>
                  <td>
                    {job.package?.min} - {job.package?.max} LPA
                  </td>
                  <td>{format(new Date(job.applicationDeadline), 'MMM dd, yyyy')}</td>
                  <td>
                    <span className={`badge ${
                      job.status === 'open' ? 'badge-success' :
                      job.status === 'closed' ? 'badge-secondary' :
                      'badge-danger'
                    }`}>
                      {job.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminJobs;
