import React, { useState } from 'react';
import './FormField.css';
import mailIcon from '../../assets/mail.png';
import eyeIcon from '../../assets/eye.png';

const FormField = ({ 
  label, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  error, 
  required = false,
  icon,
  ...props 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [inputType, setInputType] = useState(type);

  const handlePasswordToggle = () => {
    if (type === 'password') {
      setShowPassword(!showPassword);
      setInputType(showPassword ? 'password' : 'text');
    }
  };

  const renderIcon = () => {
    if (type === 'email') {
      return <img src={mailIcon} alt="Email" className="form-field__icon" />;
    }
    
    if (type === 'password') {
      return (
        <img 
          src={eyeIcon} 
          alt={showPassword ? "Hide password" : "Show password"} 
          className="form-field__icon" 
          onClick={handlePasswordToggle}
          style={{ cursor: 'pointer' }}
        />
      );
    }
    
    if (icon) {
      return <img src={icon} alt="" className="form-field__icon" />;
    }
    
    return null;
  };

  return (
    <div className="form-field">
      <label className="form-field__label">
        {label}
        {required && <span className="required">*</span>}
      </label>
      <div className="form-field__input-wrapper">
        <input
          type={inputType}
          className={`form-field__input ${error ? 'form-field__input--error' : ''}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          {...props}
        />
        {renderIcon()}
      </div>
      {error && <span className="form-field__error">{error}</span>}
    </div>
  );
};

export default FormField; 