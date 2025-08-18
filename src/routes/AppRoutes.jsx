import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../features/auth/authSlice';
import ProtectedRoute from './ProtectedRoute';
import Signup from '../pages/Signup';
import Login from '../pages/Login';
import ForgotPassword from '../pages/ForgotPassword';
import Expenses from '../pages/Expenses';
import Users from '../pages/Users';
import Analysis from '../pages/Analysis';
import Reports from '../pages/Reports';
import TestPage from '../pages/TestPage';

const AppRoutes = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/signup" 
          element={isAuthenticated ? <Navigate to="/app/expenses" replace /> : <Signup />} 
        />
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/app/expenses" replace /> : <Login />} 
        />
        <Route 
          path="/forgot" 
          element={isAuthenticated ? <Navigate to="/app/expenses" replace /> : <ForgotPassword />} 
        />
        
        {/* Protected Routes */}
        <Route
          path="/app/expenses"
          element={
            <ProtectedRoute>
              <Expenses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/users"
          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/analysis"
          element={
            <ProtectedRoute>
              <Analysis />
            </ProtectedRoute>
          }
        />
        
        {/* Test Route */}
        <Route path="/test" element={<TestPage />} />
        
        {/* Default Redirects */}
        <Route 
          path="/" 
          element={<Navigate to={isAuthenticated ? "/app/expenses" : "/login"} replace />} 
        />
        <Route 
          path="/app" 
          element={<Navigate to="/app/expenses" replace />} 
        />
        <Route 
          path="*" 
          element={<Navigate to={isAuthenticated ? "/app/expenses" : "/login"} replace />} 
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes; 