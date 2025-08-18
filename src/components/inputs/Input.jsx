import React, { useState } from 'react';
import './Input.css';
import eyeIcon from '../../assets/eye.png';

const Input = ({ 
  label, 
  type = 'text', 
  name,
  placeholder, 
  value, 
  onChange, 
  error, 
  required = false,
  disabled = false,
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

  return (
    <div className="input-field">
      {label && (
        <label htmlFor={name} className="input-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <div className="input-wrapper">
        <input
          id={name}
          name={name}
          type={inputType}
          className={`input ${error ? 'input--error' : ''} ${disabled ? 'input--disabled' : ''}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          {...props}
        />
        {type === 'password' && (
          <button
            type="button"
            className="password-toggle"
            onClick={handlePasswordToggle}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            <img 
              src={eyeIcon} 
              alt={showPassword ? "Hide password" : "Show password"} 
              className="password-icon"
            />
          </button>
        )}
      </div>
      {error && <span className="input-error">{error}</span>}
    </div>
  );
};

export default Input;
