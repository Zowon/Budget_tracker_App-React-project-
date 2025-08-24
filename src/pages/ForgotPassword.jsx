import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { forgotPassword } from '../features/auth/authSlice';
import AuthLayout from '../components/layout/AuthLayout';
import FormField from '../components/inputs/FormField';
import Button from '../components/inputs/Button';
import Toast from '../components/ui/Toast';
import resetImage from '../assets/reset.png';
import './forgot.css';

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: ''
  });

  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);
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
      await dispatch(forgotPassword({ email: formData.email })).unwrap();
      showToast('Reset link sent', 'success');
      setIsSuccess(true);
    } catch (error) {
      console.error('Forgot password failed:', error);
      showToast(error.message || 'Account not found', 'error');
    }
  };

  if (isSuccess) {
    return (
      <AuthLayout
        title="Check Your Email"
        subtitle="We've sent a password reset link to your email"
        illustration={
          <div className="success-illustration">
            <div className="success-icon">✅</div>
            <div className="success-message">
              <h3>Reset Link Sent!</h3>
              <p>Please check your email and click the reset link to continue.</p>
            </div>
          </div>
        }
      >
        <div className="success-actions">
          <Button
            variant="primary"
            onClick={() => navigate('/login')}
            className="back-to-login-button"
          >
            Back to Login
          </Button>
          
          <div className="resend-link">
            Didn't receive the email?{' '}
            <button
              type="button"
              className="resend-button"
              onClick={handleSubmit}
              disabled={loading}
            >
              Resend
            </button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Enter your email for a reset link"
      illustration={
        <div className="forgot-illustration">
          <img src={resetImage} alt="Reset password illustration" className="reset-image" />
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="forgot-form">
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

        <Button
          type="submit"
          variant="primary"
          loading={loading}
          className="reset-button"
        >
          {loading ? 'Sending...' : 'Send Reset Password Link'}
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

export default ForgotPassword; 