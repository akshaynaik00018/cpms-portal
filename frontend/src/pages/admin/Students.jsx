import React, { useState, useEffect } from 'react';
import { studentAPI } from '../../utils/api';
import { toast } from 'react-toastify';
import { FaSearch } from 'react-icons/fa';

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    department: '',
    batch: '',
    placementStatus: ''
  });

  useEffect(() => {
    fetchStudents();
  }, [filters]);

  const fetchStudents = async () => {
    try {
      const params = {};
      if (filters.department) params.department = filters.department;
      if (filters.batch) params.batch = filters.batch;
      if (filters.placementStatus) params.placementStatus = filters.placementStatus;

      const response = await studentAPI.getAll(params);
      setStudents(response.data);
    } catch (error) {
      toast.error('Failed to load students');
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
        <h1>Student Management</h1>
      </div>

      <div className="card mb-4">
        <div className="filters-row">
          <input
            type="text"
            className="form-control"
            placeholder="Filter by department..."
            value={filters.department}
            onChange={(e) => setFilters({ ...filters, department: e.target.value })}
          />
          <input
            type="text"
            className="form-control"
            placeholder="Filter by batch..."
            value={filters.batch}
            onChange={(e) => setFilters({ ...filters, batch: e.target.value })}
          />
          <select
            className="form-control"
            value={filters.placementStatus}
            onChange={(e) => setFilters({ ...filters, placementStatus: e.target.value })}
          >
            <option value="">All Statuses</option>
            <option value="not_placed">Not Placed</option>
            <option value="in_process">In Process</option>
            <option value="placed">Placed</option>
          </select>
        </div>
      </div>

      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Roll Number</th>
                <th>Department</th>
                <th>Batch</th>
                <th>CGPA</th>
                <th>Status</th>
                <th>Placed Company</th>
                <th>Package</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id}>
                  <td>
                    <div>
                      <strong>{student.user?.name}</strong>
                      <br />
                      <span className="text-sm text-secondary">{student.user?.email}</span>
                    </div>
                  </td>
                  <td>{student.rollNumber}</td>
                  <td>{student.department}</td>
                  <td>{student.batch}</td>
                  <td>{student.cgpa?.toFixed(2)}</td>
                  <td>
                    <span className={`badge ${
                      student.placementStatus === 'placed' ? 'badge-success' :
                      student.placementStatus === 'in_process' ? 'badge-warning' :
                      'badge-secondary'
                    }`}>
                      {student.placementStatus?.replace('_', ' ')}
                    </span>
                  </td>
                  <td>{student.placedCompany || '-'}</td>
                  <td>{student.package ? `${student.package} LPA` : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style jsx="true">{`
        .filters-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }
      `}</style>
    </div>
  );
};

export default AdminStudents;
