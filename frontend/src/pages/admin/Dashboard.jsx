import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../utils/api';
import { toast } from 'react-toastify';
import { 
  FaUsers, FaBuilding, FaBriefcase, FaFileAlt, 
  FaCheckCircle, FaChartLine, FaTrophy 
} from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await adminAPI.getDashboard();
      setStats(response.data);
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

  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

  const placementData = [
    { name: 'Placed', value: stats.placements.placedStudents },
    { name: 'In Process', value: stats.placements.inProcessStudents },
    { name: 'Not Placed', value: stats.placements.notPlacedStudents }
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p className="text-secondary">Complete overview of placement activities</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#dbeafe' }}>
            <FaUsers style={{ color: '#1e40af' }} />
          </div>
          <div className="stat-content">
            <h3>{stats.users.totalStudents}</h3>
            <p>Total Students</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#e0e7ff' }}>
            <FaBuilding style={{ color: '#3730a3' }} />
          </div>
          <div className="stat-content">
            <h3>{stats.users.totalCompanies}</h3>
            <p>Companies</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#d1fae5' }}>
            <FaBriefcase style={{ color: '#065f46' }} />
          </div>
          <div className="stat-content">
            <h3>{stats.jobs.openJobs}</h3>
            <p>Active Jobs</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#fef3c7' }}>
            <FaFileAlt style={{ color: '#92400e' }} />
          </div>
          <div className="stat-content">
            <h3>{stats.applications.totalApplications}</h3>
            <p>Applications</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#dcfce7' }}>
            <FaCheckCircle style={{ color: '#166534' }} />
          </div>
          <div className="stat-content">
            <h3>{stats.placements.placedStudents}</h3>
            <p>Students Placed</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#fce7f3' }}>
            <FaChartLine style={{ color: '#9f1239' }} />
          </div>
          <div className="stat-content">
            <h3>{stats.placements.placementRate}%</h3>
            <p>Placement Rate</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-2 mt-4">
        <div className="card">
          <h3 className="mb-3">Department-wise Placement</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.departmentStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#4f46e5" name="Total Students" />
              <Bar dataKey="placed" fill="#10b981" name="Placed" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="mb-3">Placement Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={placementData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {placementData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Package Stats & Top Recruiters */}
      <div className="grid grid-2 mt-4">
        <div className="card">
          <h3 className="mb-3">Package Statistics</h3>
          <div className="package-stats">
            <div className="package-item">
              <span className="package-label">Highest Package</span>
              <span className="package-value">{stats.packageStats.maxPackage || 0} LPA</span>
            </div>
            <div className="package-item">
              <span className="package-label">Average Package</span>
              <span className="package-value">{stats.packageStats.avgPackage?.toFixed(2) || 0} LPA</span>
            </div>
            <div className="package-item">
              <span className="package-label">Lowest Package</span>
              <span className="package-value">{stats.packageStats.minPackage || 0} LPA</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="mb-3"><FaTrophy /> Top Recruiters</h3>
          <div className="top-recruiters">
            {stats.topRecruiters && stats.topRecruiters.length > 0 ? (
              stats.topRecruiters.map((recruiter, index) => (
                <div key={index} className="recruiter-item">
                  <div className="recruiter-rank">{index + 1}</div>
                  <div className="recruiter-info">
                    <span className="recruiter-name">{recruiter._id}</span>
                    <span className="recruiter-count">{recruiter.selections} selections</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-secondary">No data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Placements */}
      <div className="card mt-4">
        <h3 className="mb-3">Recent Placements</h3>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Email</th>
                <th>Company</th>
                <th>Package</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentPlacements && stats.recentPlacements.length > 0 ? (
                stats.recentPlacements.map((placement) => (
                  <tr key={placement._id}>
                    <td>{placement.user?.name}</td>
                    <td>{placement.user?.email}</td>
                    <td>{placement.placedCompany}</td>
                    <td>{placement.package} LPA</td>
                    <td>
                      <span className="badge badge-success">Placed</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-secondary">
                    No recent placements
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style jsx="true">{`
        .package-stats {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .package-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background-color: var(--bg-color);
          border-radius: 0.5rem;
        }

        .package-label {
          font-weight: 500;
          color: var(--text-secondary);
        }

        .package-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--primary-color);
        }

        .top-recruiters {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .recruiter-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background-color: var(--bg-color);
          border-radius: 0.5rem;
        }

        .recruiter-rank {
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          background-color: var(--primary-color);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          flex-shrink: 0;
        }

        .recruiter-info {
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .recruiter-name {
          font-weight: 600;
          color: var(--text-primary);
        }

        .recruiter-count {
          font-size: 0.813rem;
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
