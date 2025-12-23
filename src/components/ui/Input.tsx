'use client';

import { ReactNode } from 'react';

interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number';
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onKeyPress?: (e: React.KeyboardEvent) => void;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  id?: string;
  name?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  autoFocus?: boolean;
}

export function Input({
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  onFocus,
  onKeyPress,
  disabled = false,
  required = false,
  className = '',
  id,
  name,
  error,
  leftIcon,
  rightIcon,
  autoFocus,
}: InputProps) {
  const baseClasses = 'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200';
  
  const errorClasses = error 
    ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
    : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500';
    
  const disabledClasses = disabled ? 'bg-gray-100 cursor-not-allowed opacity-50' : 'bg-white dark:bg-gray-800';

  return (
    <div className="relative">
      <input
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        onKeyPress={onKeyPress}
        disabled={disabled}
        required={required}
        autoFocus={autoFocus}
        className={`${baseClasses} ${errorClasses} ${disabledClasses} ${className} ${
          leftIcon ? 'pl-10' : ''
        } ${rightIcon ? 'pr-10' : ''}`}
      />
      {leftIcon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          {leftIcon}
        </div>
      )}
      {rightIcon && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          {rightIcon}
        </div>
      )}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}