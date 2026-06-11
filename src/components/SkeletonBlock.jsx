import React from 'react';

export default function SkeletonBlock({ className = '', height = 'h-4', width = 'w-full' }) {
  return (
    <div 
      className={`shimmer-bg rounded-lg ${height} ${width} ${className}`} 
    />
  );
}
