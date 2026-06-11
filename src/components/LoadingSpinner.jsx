import React from 'react';

export default function LoadingSpinner({ size = 'md' }) {
  const sizeClasses = {
    sm: 'h-6 w-6 border-2',
    md: 'h-10 w-10 border-4',
    lg: 'h-16 w-16 border-4',
  };

  return (
    <div className="flex items-center justify-center py-8">
      <div className={`${sizeClasses[size] || sizeClasses.md} animate-spin rounded-full border-gray-200 border-t-indigo-600`} />
    </div>
  );
}
