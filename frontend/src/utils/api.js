import axios from 'axios';

const API_URL = '/api';

// Configure axios defaults
axios.defaults.baseURL = API_URL;

// Add token to requests if it exists
const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Students API
export const studentAPI = {
  getAll: (params) => axios.get('/students', { params }),
  getById: (id) => axios.get(`/students/${id}`),
  update: (id, data) => axios.put(`/students/${id}`, data),
  getDashboard: () => axios.get('/students/dashboard/my'),
};

// Companies API
export const companyAPI = {
  getAll: (params) => axios.get('/companies', { params }),
  getById: (id) => axios.get(`/companies/${id}`),
  update: (id, data) => axios.put(`/companies/${id}`, data),
  verify: (id) => axios.put(`/companies/${id}/verify`),
  getDashboard: () => axios.get('/companies/dashboard/my'),
};

// Jobs API
export const jobAPI = {
  getAll: (params) => axios.get('/jobs', { params }),
  getEligible: () => axios.get('/jobs/eligible'),
  getById: (id) => axios.get(`/jobs/${id}`),
  create: (data) => axios.post('/jobs', data),
  update: (id, data) => axios.put(`/jobs/${id}`, data),
  delete: (id) => axios.delete(`/jobs/${id}`),
};

// Applications API
export const applicationAPI = {
  getAll: (params) => axios.get('/applications', { params }),
  getById: (id) => axios.get(`/applications/${id}`),
  apply: (data) => axios.post('/applications', data),
  updateStatus: (id, data) => axios.put(`/applications/${id}`, data),
  withdraw: (id) => axios.delete(`/applications/${id}`),
};

// Interviews API
export const interviewAPI = {
  getAll: (params) => axios.get('/interviews', { params }),
  getById: (id) => axios.get(`/interviews/${id}`),
  schedule: (data) => axios.post('/interviews', data),
  update: (id, data) => axios.put(`/interviews/${id}`, data),
  cancel: (id) => axios.delete(`/interviews/${id}`),
};

// Admin API
export const adminAPI = {
  getDashboard: () => axios.get('/admin/dashboard'),
  getUsers: (params) => axios.get('/admin/users', { params }),
  toggleUserStatus: (id) => axios.put(`/admin/users/${id}/toggle-status`),
  deleteUser: (id) => axios.delete(`/admin/users/${id}`),
};

export default axios;
