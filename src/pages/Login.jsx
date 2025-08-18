import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../features/auth/authSlice';
import AuthLayout from '../components/layout/AuthLayout';
import FormField from '../components/inputs/FormField';
import Button from '../components/inputs/Button';
import loginImage from '../assets/login.png';
import './login.css';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const result = await dispatch(login({
        email: formData.email,
        password: formData.password
      })).unwrap();

      // The login thunk returns the user object directly, not a success property
      if (result && result.id) {
        navigate('/app/expenses');
      }
    } catch (error) {
      console.error('Login failed:', error);
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
        {error && (
          <div style={{ 
            color: 'red', 
            marginBottom: '1rem', 
            padding: '0.5rem', 
            backgroundColor: '#fee', 
            border: '1px solid #fcc',
            borderRadius: '4px'
          }}>
            {error}
          </div>
        )}
        
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
    </AuthLayout>
  );
};

export default Login; 