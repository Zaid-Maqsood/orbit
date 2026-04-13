import React from 'react';
import Spinner from './Spinner';

const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  cta: 'btn-cta',
  danger: 'btn-danger',
  ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 cursor-pointer',
};

const Button = ({
  children,
  variant = 'primary',
  loading = false,
  disabled = false,
  className = '',
  onClick,
  type = 'button',
  size = 'md',
}) => {
  const sizeClass = size === 'sm' ? 'px-3 py-1.5 text-xs' : '';
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${variants[variant]} ${sizeClass} ${className} inline-flex items-center gap-2`}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  );
};

export default Button;
