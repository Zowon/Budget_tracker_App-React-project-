import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { signUp } from '../features/auth/authSlice';
import { addUserFromAuth } from '../features/users/usersSlice';
import AuthLayout from '../components/layout/AuthLayout';
import FormField from '../components/inputs/FormField';
import Button from '../components/inputs/Button';
import Toast from '../components/ui/Toast';
import signupImage from '../assets/signup.png';
import './signup.css';

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'User',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ message: '', type: '', isVisible: false });

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

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/[\s\-()]/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.role) {
      newErrors.role = 'Role is required';
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
      const result = await dispatch(signUp({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        password: formData.password
      })).unwrap();

      // Add user to users table
      dispatch(addUserFromAuth(result));
      
      showToast('User created successfully', 'success');
      
      // Navigate after a short delay to show the toast
      setTimeout(() => {
        navigate('/app/expenses');
      }, 1500);
    } catch (error) {
      console.error('Signup failed:', error);
      showToast(error.message || 'Signup failed', 'error');
    }
  };

  return (
    <AuthLayout
      title="Sign Up"
      subtitle="Welcome to our community"
      illustration={
        <div className="signup-illustration">
          <img src={signupImage} alt="Sign up illustration" className="signup-image" />
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="signup-form">
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
        
        <div className="name-fields">
          <FormField
            label="First Name"
            type="text"
            name="firstName"
            placeholder="Cameron"
            value={formData.firstName}
            onChange={handleChange}
            error={errors.firstName}
            required
          />
          <FormField
            label="Last Name"
            type="text"
            name="lastName"
            placeholder="Williamson"
            value={formData.lastName}
            onChange={handleChange}
            error={errors.lastName}
            required
          />
        </div>

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

        <FormField
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          placeholder="Enter your password"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          required
        />

        <FormField
          label="Phone Number"
          type="tel"
          name="phone"
          placeholder="Enter phone number"
          value={formData.phone}
          onChange={handleChange}
          error={errors.phone}
          required
        />

        <div className="form-group">
          <label htmlFor="role" className="form-label">
            Role <span className="required">*</span>
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className={`form-select ${errors.role ? 'error' : ''}`}
            required
          >
            <option value="User">User</option>
            <option value="Manager">Manager</option>
            <option value="Admin">Admin</option>
          </select>
          {errors.role && (
            <span className="error-message">{errors.role}</span>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          loading={loading}
          className="signup-button"
        >
          {loading ? 'Signing Up...' : 'SIGN UP'}
        </Button>

        <div className="login-link">
          Already have an account?{' '}
          <Link to="/login" className="login-link__text">
            Log in
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

export default Signup; 