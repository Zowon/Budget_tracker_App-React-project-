import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { signUp } from '../features/auth/authSlice';
import AuthLayout from '../components/layout/AuthLayout';
import FormField from '../components/inputs/FormField';
import Button from '../components/inputs/Button';
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
    password: '',
    confirmPassword: '',
    budgetLimit: ''
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

    if (!formData.budgetLimit || parseFloat(formData.budgetLimit) <= 0) {
      newErrors.budgetLimit = 'Please enter a valid budget limit';
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
      const result = await dispatch(signUp({
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        budgetLimit: parseFloat(formData.budgetLimit)
      })).unwrap();

      // The signUp thunk returns the user object directly, not a success property
      if (result && result.id) {
        navigate('/app/expenses');
      }
    } catch (error) {
      console.error('Signup failed:', error);
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
          label="Monthly Budget Limit"
          type="number"
          name="budgetLimit"
          placeholder="Enter Amount"
          value={formData.budgetLimit}
          onChange={handleChange}
          error={errors.budgetLimit}
          required
          step="0.01"
          min="0"
        />

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
    </AuthLayout>
  );
};

export default Signup; 