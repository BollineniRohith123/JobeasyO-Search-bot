import React from 'react';

interface LoadingDotsProps {
  size?: number;
  color?: string;
}

export default function LoadingDots({ 
  size = 2, 
  color = 'bg-blue-400' 
}: LoadingDotsProps) {
  return (
    <div className="flex items-center justify-center space-x-2">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className={`
            w-${size} h-${size} rounded-full ${color}
            animate-bounce
            transition-transform duration-300
          `}
          style={{
            animationDelay: `${i * 0.15}s`,
            animationDuration: '1s'
          }}
        />
      ))}
    </div>
  );
}

export function LoadingBar({
  progress = -1,
  color = 'bg-blue-400',
  height = 2
}: {
  progress?: number;
  color?: string;
  height?: number;
}) {
  const isIndeterminate = progress < 0;

  return (
    <div 
      className={`w-full bg-gray-800 rounded-full overflow-hidden`}
      style={{ height: `${height}px` }}
    >
      <div
        className={`
          ${color} h-full rounded-full
          transition-all duration-300
          ${isIndeterminate ? 'animate-loading-bar' : ''}
        `}
        style={{
          width: isIndeterminate ? '30%' : `${progress}%`,
          ...(isIndeterminate && {
            animation: 'loading-bar 1.5s ease-in-out infinite'
          })
        }}
      />
    </div>
  );
}
