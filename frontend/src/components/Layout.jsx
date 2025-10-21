import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FaHome, FaUser, FaBriefcase, FaFileAlt, FaCalendarAlt, 
  FaUsers, FaBuilding, FaCog, FaSignOutAlt, FaBars, FaTimes,
  FaChartBar
} from 'react-icons/fa';
import './Layout.css';

const Layout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getNavItems = () => {
    switch (user?.role) {
      case 'student':
        return [
          { path: '/student/dashboard', icon: <FaHome />, label: 'Dashboard' },
          { path: '/student/profile', icon: <FaUser />, label: 'Profile' },
          { path: '/student/jobs', icon: <FaBriefcase />, label: 'Jobs' },
          { path: '/student/applications', icon: <FaFileAlt />, label: 'Applications' },
          { path: '/student/interviews', icon: <FaCalendarAlt />, label: 'Interviews' },
        ];
      case 'company':
        return [
          { path: '/company/dashboard', icon: <FaHome />, label: 'Dashboard' },
          { path: '/company/profile', icon: <FaUser />, label: 'Profile' },
          { path: '/company/jobs', icon: <FaBriefcase />, label: 'Job Postings' },
          { path: '/company/applications', icon: <FaFileAlt />, label: 'Applications' },
        ];
      case 'admin':
        return [
          { path: '/admin/dashboard', icon: <FaChartBar />, label: 'Dashboard' },
          { path: '/admin/students', icon: <FaUsers />, label: 'Students' },
          { path: '/admin/companies', icon: <FaBuilding />, label: 'Companies' },
          { path: '/admin/jobs', icon: <FaBriefcase />, label: 'Jobs' },
          { path: '/admin/users', icon: <FaCog />, label: 'Users' },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="layout">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="header-left">
            <button 
              className="menu-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <FaTimes /> : <FaBars />}
            </button>
            <h1 className="header-title">Placement Portal</h1>
          </div>
          <div className="header-right">
            <div className="user-info">
              <span className="user-name">{user?.name}</span>
              <span className="user-role">{user?.role}</span>
            </div>
            <button className="btn btn-outline btn-sm" onClick={logout}>
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="layout-body">
        {/* Sidebar */}
        <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <nav className="sidebar-nav">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
