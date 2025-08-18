import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import logo from '../../assets/logo.png';
import './AppLayout.css';

const AppLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname.includes(path);
  };

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-container">
            <img src={logo} alt="Budget Tracker" className="logo" />
            <span className="logo-text">Budget Tracker</span>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          <ul className="nav-list">
            <li className="nav-item">
              <button
                className={`nav-link ${isActive('/analysis') ? 'active' : ''}`}
                onClick={() => navigate('/app/analysis')}
              >
                <span className="nav-icon">📊</span>
                <span className="nav-text">Analysis</span>
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${isActive('/expenses') ? 'active' : ''}`}
                onClick={() => navigate('/app/expenses')}
              >
                <span className="nav-icon">💰</span>
                <span className="nav-text">Expenses</span>
              </button>
            </li>
            <li className="nav-item">
              <button
                className="nav-link logout-link"
                onClick={handleLogout}
              >
                <span className="nav-icon">🚪</span>
                <span className="nav-text">Logout</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Top Header */}
        <header className="top-header">
          <div className="header-left">
            {/* Page title will be set by individual pages */}
          </div>
          <div className="header-right">
            <button className="notification-btn" aria-label="Notifications">
              <span className="notification-icon">🔔</span>
            </button>
            <div className="profile-picture">
              <span className="profile-initial">U</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="page-content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout; 