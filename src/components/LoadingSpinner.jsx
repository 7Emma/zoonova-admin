import React from 'react';

export default function LoadingSpinner({ size = 'md', message = null }) {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8">
      <div className={`${sizes[size]} border-4 border-gray-200 border-t-primary rounded-full animate-spin`}></div>
      {message && <p className="text-gray-600">{message}</p>}
    </div>
  );
}
