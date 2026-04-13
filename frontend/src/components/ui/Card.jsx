import React from 'react';

const Card = ({ children, className = '', onClick }) => (
  <div
    className={`card ${onClick ? 'cursor-pointer hover:shadow-card-hover transition-shadow duration-200' : ''} ${className}`}
    onClick={onClick}
  >
    {children}
  </div>
);

export const CardHeader = ({ title, subtitle, action }) => (
  <div className="flex items-start justify-between mb-4">
    <div>
      <h3 className="font-heading font-semibold text-text-main text-base">{title}</h3>
      {subtitle && <p className="text-gray-500 text-sm mt-0.5">{subtitle}</p>}
    </div>
    {action && <div className="flex-shrink-0 ml-4">{action}</div>}
  </div>
);

export default Card;
