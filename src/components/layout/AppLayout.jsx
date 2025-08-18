import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import logo from '../../assets/logo.png';
import analyticsIcon from '../../assets/anaylictics.svg';
import expensesIcon from '../../assets/expenses.svg';
import userIcon from '../../assets/user.svg';
import exitIcon from '../../assets/exit.svg';
import notificationIcon from '../../assets/notification.png';
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
                <img src={analyticsIcon} alt="Analytics" className="nav-icon" />
                <span className="nav-text">Analysis</span>
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${isActive('/expenses') ? 'active' : ''}`}
                onClick={() => navigate('/app/expenses')}
              >
                <img src={expensesIcon} alt="Expenses" className="nav-icon" />
                <span className="nav-text">Expenses</span>
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${isActive('/users') ? 'active' : ''}`}
                onClick={() => navigate('/app/users')}
              >
                <img src={userIcon} alt="Users" className="nav-icon" />
                <span className="nav-text">Users</span>
              </button>
            </li>
            <li className="nav-item">
              <button
                className="nav-link logout-link"
                onClick={handleLogout}
              >
                <img src={exitIcon} alt="Logout" className="nav-icon" />
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
              <img src={notificationIcon} alt="Notifications" className="notification-icon" />
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