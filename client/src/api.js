import axios from 'axios'

export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api'

export function createApi(token) {
  const api = axios.create({ baseURL: API_BASE })
  api.interceptors.request.use((config) => {
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  })
  return api
}
