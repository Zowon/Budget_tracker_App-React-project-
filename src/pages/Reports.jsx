import React from 'react';
import AppLayout from '../components/layout/AppLayout';
import './reports.css';

const Reports = () => {
  return (
    <AppLayout>
    <div className="reports-page">
        <div className="reports-header">
          <h1 className="page-title">Analysis</h1>
        </div>
        
        <div className="reports-content">
          <div className="reports-placeholder">
            <div className="placeholder-icon">📊</div>
            <h2>Reports & Analytics</h2>
            <p>Detailed expense analysis and reporting features will be implemented here.</p>
            <p>This will include charts, trends, and budget insights.</p>
          </div>
        </div>
    </div>
    </AppLayout>
  );
};

export default Reports; 