import React from 'react';

const Input = React.forwardRef(({
  label, error, className = '', id, ...props
}, ref) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={`input-field ${error ? 'border-red-400 focus:ring-red-300 focus:border-red-400' : ''} ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
