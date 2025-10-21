import React from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Jobs from './pages/Jobs'
import JobDetail from './pages/JobDetail'
import PostJob from './pages/PostJob'
import Applications from './pages/Applications'
import Analytics from './pages/Analytics'
import Profile from './pages/Profile'
import Notifications from './pages/Notifications'

function useAuth() {
  const [token, setToken] = React.useState(localStorage.getItem('token'))
  const [user, setUser] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem('user')) } catch { return null }
  })
  const login = (t, u) => { localStorage.setItem('token', t); localStorage.setItem('user', JSON.stringify(u)); setToken(t); setUser(u) }
  const logout = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); setToken(null); setUser(null) }
  return { token, user, login, logout }
}

export const AuthContext = React.createContext(null)

const Layout = ({ children }) => {
  const { user, logout } = React.useContext(AuthContext)
  return (
    <div>
      <nav style={{display:'flex',gap:16,padding:12,borderBottom:'1px solid #ddd'}}>
        <Link to="/">Home</Link>
        <Link to="/jobs">Jobs</Link>
        {user?.role === 'company' && <Link to="/post-job">Post Job</Link>}
        {['tpo','admin'].includes(user?.role) && <Link to="/analytics">Analytics</Link>}
        {user && <Link to="/applications">My Applications</Link>}
        {user && <Link to="/notifications">Notifications</Link>}
        {user && <Link to="/profile">Profile</Link>}
        {!user && <Link to="/login">Login</Link>}
        {!user && <Link to="/register">Register</Link>}
        {user && <span>Hi, {user.name} ({user.role})</span>}
        {user && <button onClick={logout}>Logout</button>}
      </nav>
      <div style={{padding:16}}>{children}</div>
    </div>
  )
}

const Private = ({ children }) => {
  const { token } = React.useContext(AuthContext)
  if (!token) return <Navigate to="/login" />
  return children
}

export default function App() {
  const auth = useAuth()
  return (
    <AuthContext.Provider value={auth}>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/post-job" element={<Private><PostJob /></Private>} />
          <Route path="/applications" element={<Private><Applications /></Private>} />
          <Route path="/analytics" element={<Private><Analytics /></Private>} />
          <Route path="/profile" element={<Private><Profile /></Private>} />
          <Route path="/notifications" element={<Private><Notifications /></Private>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Layout>
    </AuthContext.Provider>
  )
}
