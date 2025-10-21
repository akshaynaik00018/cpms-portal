import React, { useState, useEffect } from 'react';
import { companyAPI } from '../../utils/api';
import { toast } from 'react-toastify';
import { FaCheckCircle } from 'react-icons/fa';

const AdminCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await companyAPI.getAll();
      setCompanies(response.data);
    } catch (error) {
      toast.error('Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id) => {
    try {
      await companyAPI.verify(id);
      toast.success('Company verified successfully');
      fetchCompanies();
    } catch (error) {
      toast.error('Failed to verify company');
    }
  };

  if (loading) {
    return <div className="flex-center"><div className="spinner"></div></div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Company Management</h1>
      </div>

      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Company Name</th>
                <th>Industry</th>
                <th>Location</th>
                <th>HR Contact</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company) => (
                <tr key={company._id}>
                  <td>
                    <strong>{company.companyName}</strong>
                  </td>
                  <td>{company.industry}</td>
                  <td>{company.location || '-'}</td>
                  <td>
                    {company.hrName && (
                      <div>
                        <div>{company.hrName}</div>
                        <div className="text-sm text-secondary">{company.hrEmail}</div>
                      </div>
                    )}
                  </td>
                  <td>
                    {company.isVerified ? (
                      <span className="badge badge-success">
                        <FaCheckCircle /> Verified
                      </span>
                    ) : (
                      <span className="badge badge-warning">Pending</span>
                    )}
                  </td>
                  <td>
                    {!company.isVerified && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleVerify(company._id)}
                      >
                        Verify
                      </button>
                    )}
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

export default AdminCompanies;
