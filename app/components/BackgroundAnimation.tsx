import React from 'react';

interface BackgroundAnimationProps {
  variant?: 'default' | 'active' | 'subtle';
}

export default function BackgroundAnimation({ variant = 'default' }: BackgroundAnimationProps) {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Gradient Base */}
      <div 
        className={`
          absolute inset-0 opacity-30 transition-opacity duration-1000
          ${variant === 'active' ? 'opacity-50' : ''}
          ${variant === 'subtle' ? 'opacity-20' : ''}
        `}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-black/20" />
      </div>

      {/* Ambient Orbs */}
      <div className="absolute inset-0">
        <div className="relative w-full h-full">
          {/* Top Right Orb */}
          <div 
            className={`
              absolute -top-32 -right-32 w-96 h-96 
              bg-blue-500/5 rounded-full blur-3xl
              animate-pulse
              ${variant === 'active' ? 'bg-blue-500/10' : ''}
              ${variant === 'subtle' ? 'bg-blue-500/3' : ''}
            `}
          />

          {/* Bottom Left Orb */}
          <div 
            className={`
              absolute -bottom-32 -left-32 w-96 h-96
              bg-purple-500/5 rounded-full blur-3xl
              animate-pulse [animation-delay:1s]
              ${variant === 'active' ? 'bg-purple-500/10' : ''}
              ${variant === 'subtle' ? 'bg-purple-500/3' : ''}
            `}
          />
        </div>
      </div>

      {/* Grid Pattern */}
      <div 
        className={`
          absolute inset-0 opacity-[0.02]
          [background-image:linear-gradient(0deg,transparent_24%,rgba(100,100,255,0.3)_25%,rgba(100,100,255,0.3)_26%,transparent_27%,transparent_74%,rgba(100,100,255,0.3)_75%,rgba(100,100,255,0.3)_76%,transparent_77%,transparent),linear-gradient(90deg,transparent_24%,rgba(100,100,255,0.3)_25%,rgba(100,100,255,0.3)_26%,transparent_27%,transparent_74%,rgba(100,100,255,0.3)_75%,rgba(100,100,255,0.3)_76%,transparent_77%,transparent)]
          background-size:50px 50px
          ${variant === 'active' ? 'opacity-[0.03]' : ''}
          ${variant === 'subtle' ? 'opacity-[0.01]' : ''}
        `}
      />

      {/* Moving Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`
              absolute w-1 h-1 bg-blue-400/20 rounded-full
              animate-float-particle
            `}
            style={{
              left: `${i * 5}%`,
              top: `${i * 5}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${5 + i * 0.5}s`
            }}
          />
        ))}
      </div>
    </div>
  );
}
