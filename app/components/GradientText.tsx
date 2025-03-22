import React from 'react';

interface GradientTextProps {
  children: React.ReactNode;
  from?: string;
  via?: string;
  to?: string;
  className?: string;
  animate?: boolean;
}

export default function GradientText({
  children,
  from = 'from-blue-400',
  via = 'via-purple-400',
  to = 'to-pink-400',
  className = '',
  animate = false
}: GradientTextProps) {
  return (
    <span
      className={`
        inline-block bg-clip-text text-transparent
        bg-gradient-to-r ${from} ${via} ${to}
        ${animate ? 'animate-gradient-flow' : ''}
        ${className}
      `}
    >
      {children}
    </span>
  );
}

// Preset gradients
export const presets = {
  primary: {
    from: 'from-blue-400',
    via: 'via-purple-400',
    to: 'to-pink-400'
  },
  success: {
    from: 'from-green-400',
    via: 'via-emerald-400',
    to: 'to-teal-400'
  },
  warning: {
    from: 'from-yellow-400',
    via: 'via-orange-400',
    to: 'to-red-400'
  },
  info: {
    from: 'from-cyan-400',
    via: 'via-blue-400',
    to: 'to-indigo-400'
  }
};
