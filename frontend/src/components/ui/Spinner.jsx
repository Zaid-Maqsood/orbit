import React from 'react';

const sizes = {
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-10 h-10 border-4',
};

const Spinner = ({ size = 'md', className = '' }) => (
  <div
    className={`${sizes[size]} rounded-full border-primary-200 border-t-primary animate-spin ${className}`}
    role="status"
    aria-label="Loading"
  />
);

export default Spinner;
