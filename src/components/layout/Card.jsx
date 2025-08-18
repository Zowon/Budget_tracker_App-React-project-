import React from 'react';
import './Card.css';

const Card = ({ children, className = '', padding = 'medium', ...props }) => {
  const cardClasses = [
    'card',
    `card--padding-${padding}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
};

export default Card; 