import React from 'react';
import { Link } from 'react-router-dom';

const Button = ({ 
  children, 
  type = 'button', 
  variant = 'primary', 
  size = 'md',
  className = '',
  isLoading = false,
  disabled = false,
  fullWidth = false, // Added full-width support
  href = null,
  to = null,
  onClick,
  ...rest
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-100',
    outline: 'bg-transparent border border-purple-600 text-purple-600 hover:bg-purple-50 focus:ring-purple-500 dark:hover:bg-gray-800',
    ghost: 'bg-transparent text-purple-600 hover:bg-purple-50 focus:ring-purple-500 dark:hover:bg-gray-800',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };
  
  const sizeClasses = {
    sm: 'text-sm py-1 px-3',
    md: 'text-base py-2 px-4',
    lg: 'text-lg py-3 px-6',
  };

  // Combining all classes
  const allClasses = `
    ${baseClasses} 
    ${variantClasses[variant]} 
    ${sizeClasses[size]} 
    ${isLoading || disabled ? 'opacity-70 cursor-not-allowed' : ''} 
    ${fullWidth ? 'w-full' : ''} 
    ${className}
  `;

  // Loading spinner
  const content = (
    <>
      {isLoading && (
        <svg className="animate-spin mr-2 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </>
  );

  // Button as a Link
  if (to) {
    return (
      <Link to={to} className={allClasses} aria-disabled={isLoading || disabled} {...rest}>
        {content}
      </Link>
    );
  }

  // Button as an Anchor
  if (href) {
    return (
      <a href={href} className={allClasses} aria-disabled={isLoading || disabled} {...rest}>
        {content}
      </a>
    );
  }

  // Regular Button
  return (
    <button
      type={type}
      className={allClasses}
      disabled={isLoading || disabled}
      aria-disabled={isLoading || disabled} // Improves accessibility
      onClick={onClick}
      {...rest}
    >
      {content}
    </button>
  );
};

export default Button;
