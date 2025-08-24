import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../features/auth/authSlice';
import AuthLayout from '../components/layout/AuthLayout';
import FormField from '../components/inputs/FormField';
import Button from '../components/inputs/Button';
import Toast from '../components/ui/Toast';
import loginImage from '../assets/login.png';
import './login.css';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ message: '', type: '', isVisible: false });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Hide toast error when user starts typing
    if (toast.isVisible && toast.type === 'error') {
      closeToast();
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Show toast notification
  const showToast = (message, type) => {
    setToast({ message, type, isVisible: true });
  };

  // Close toast
  const closeToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await dispatch(login({
        email: formData.email,
        password: formData.password
      })).unwrap();

      // Show success toast and navigate
      showToast('Login successful', 'success');
      
      // Navigate after a short delay to show the toast
      setTimeout(() => {
        navigate('/app/expenses');
      }, 1000);
    } catch (error) {
      console.error('Login failed:', error);
      showToast(error.message || 'Invalid credentials', 'error');
    }
  };

  return (
    <AuthLayout
      title="Welcome Back!"
      subtitle="Sign in to continue to Budget Tracker"
      illustration={
        <div className="login-illustration">
          <img src={loginImage} alt="Login illustration" className="login-image" />
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="login-form">
        
        <FormField
          label="Email"
          type="email"
          name="email"
          placeholder="test@gmail.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
        />

        <FormField
          label="Password"
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          required
        />

        <div className="form-options">
          <label className="checkbox-label">
            <input type="checkbox" className="checkbox" />
            <span className="checkbox-text">Remember me</span>
          </label>
          <Link to="/forgot" className="forgot-link">
            Forgot Password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          loading={loading}
          className="login-button"
        >
          {loading ? 'Signing In...' : 'LOG IN'}
        </Button>

        <div className="signup-link">
          Don't have an account?{' '}
          <Link to="/signup" className="signup-link__text">
            Sign Up
          </Link>
        </div>
      </form>
      
      {/* Toast Notifications */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={closeToast}
      />
    </AuthLayout>
  );
};

export default Login; 