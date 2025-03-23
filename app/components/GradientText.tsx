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
  from = 'from-[rgba(var(--apple-blue),1)]',
  via = 'via-[rgba(var(--apple-purple),1)]',
  to = 'to-[rgba(var(--apple-pink),1)]',
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

// Preset gradients using Apple colors
export const presets = {
  primary: {
    from: 'from-[rgba(var(--apple-blue),1)]',
    via: 'via-[rgba(var(--apple-purple),1)]',
    to: 'to-[rgba(var(--apple-pink),1)]'
  },
  success: {
    from: 'from-[rgba(var(--apple-green),1)]',
    via: 'via-[rgba(var(--apple-teal),1)]',
    to: 'to-[rgba(var(--apple-blue),1)]'
  },
  warning: {
    from: 'from-[rgba(var(--apple-yellow),1)]',
    via: 'via-[rgba(var(--apple-orange),1)]',
    to: 'to-[rgba(var(--apple-red),1)]'
  },
  info: {
    from: 'from-[rgba(var(--apple-teal),1)]',
    via: 'via-[rgba(var(--apple-blue),1)]',
    to: 'to-[rgba(var(--apple-indigo),1)]'
  }
};