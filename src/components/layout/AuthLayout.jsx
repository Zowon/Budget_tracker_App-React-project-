import React from 'react';
import './AuthLayout.css';
import logo from '../../assets/logo.png';

const AuthLayout = ({ children, illustration, title, subtitle }) => {
  return (
    <div className="auth-layout">
      <div className="auth-layout__left">
        <div className="auth-layout__content">
          <div className="auth-layout__header">
            <div className="logo">
              <img src={logo} alt="Budget Tracker" className="logo__image" />
              <span className="logo__text">Budget Tracker</span>
            </div>
            {title && <h1 className="auth-layout__title">{title}</h1>}
            {subtitle && <p className="auth-layout__subtitle">{subtitle}</p>}
          </div>
          <div className="auth-layout__form">
            {children}
          </div>
        </div>
      </div>
      <div className="auth-layout__right">
        <div className="auth-layout__illustration">
          {illustration}
        </div>
      </div>
      <div className="auth-layout__line"></div>
    </div>
  );
};

export default AuthLayout; 