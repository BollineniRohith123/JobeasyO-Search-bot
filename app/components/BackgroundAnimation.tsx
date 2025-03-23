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
          absolute inset-0 transition-opacity duration-1000
          ${variant === 'active' ? 'opacity-60' : ''}
          ${variant === 'subtle' ? 'opacity-30' : 'opacity-40'}
        `}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-purple-900/20 to-black/30" />
      </div>

      {/* Ambient Orbs */}
      <div className="absolute inset-0">
        <div className="relative w-full h-full">
          {/* Top Right Orb */}
          <div 
            className={`
              absolute -top-32 -right-32 w-96 h-96 
              bg-blue-500/10 rounded-full blur-3xl
              animate-pulse
              ${variant === 'active' ? 'bg-blue-500/20' : ''}
              ${variant === 'subtle' ? 'bg-blue-500/5' : ''}
            `}
          />

          {/* Bottom Left Orb */}
          <div 
            className={`
              absolute -bottom-32 -left-32 w-96 h-96
              bg-purple-500/10 rounded-full blur-3xl
              animate-pulse [animation-delay:1s]
              ${variant === 'active' ? 'bg-purple-500/20' : ''}
              ${variant === 'subtle' ? 'bg-purple-500/5' : ''}
            `}
          />
          
          {/* Center Orb - New */}
          <div 
            className={`
              absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
              w-[40rem] h-[40rem] rounded-full blur-3xl
              bg-indigo-500/5 animate-pulse [animation-delay:2s]
              ${variant === 'active' ? 'bg-indigo-500/10' : ''}
              ${variant === 'subtle' ? 'bg-indigo-500/3' : ''}
            `}
          />
        </div>
      </div>

      {/* Grid Pattern */}
      <div 
        className={`
          absolute inset-0 
          [background-image:linear-gradient(0deg,transparent_24%,rgba(100,100,255,0.3)_25%,rgba(100,100,255,0.3)_26%,transparent_27%,transparent_74%,rgba(100,100,255,0.3)_75%,rgba(100,100,255,0.3)_76%,transparent_77%,transparent),linear-gradient(90deg,transparent_24%,rgba(100,100,255,0.3)_25%,rgba(100,100,255,0.3)_26%,transparent_27%,transparent_74%,rgba(100,100,255,0.3)_75%,rgba(100,100,255,0.3)_76%,transparent_77%,transparent)]
          background-size:80px 80px
          transition-opacity duration-1000
          ${variant === 'active' ? 'opacity-[0.04]' : ''}
          ${variant === 'subtle' ? 'opacity-[0.01]' : 'opacity-[0.02]'}
        `}
      />

      {/* Moving Particles */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className={`
              absolute w-1 h-1 rounded-full
              animate-float-particle
              ${i % 3 === 0 ? 'bg-blue-400/30' : i % 3 === 1 ? 'bg-purple-400/30' : 'bg-indigo-400/30'}
              ${variant === 'active' ? 'scale-150' : ''}
              ${variant === 'subtle' ? 'scale-75' : ''}
            `}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.2}s`,
              animationDuration: `${5 + i * 0.5}s`
            }}
          />
        ))}
      </div>
      
      {/* Horizontal Lines - New */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className={`
              absolute h-px w-full bg-gradient-to-r from-transparent via-blue-400/30 to-transparent
              ${variant === 'active' ? 'opacity-50' : 'opacity-30'}
            `}
            style={{
              top: `${10 + i * 8}%`,
              animationDuration: `${20 + i * 5}s`,
              transform: `translateY(${Math.sin(i) * 10}px)`
            }}
          />
        ))}
      </div>
      
      {/* Radial Gradient Overlay - New */}
      <div 
        className={`
          absolute inset-0 bg-radial-gradient
          opacity-70 mix-blend-multiply
          ${variant === 'active' ? 'opacity-60' : ''}
          ${variant === 'subtle' ? 'opacity-80' : ''}
        `}
        style={{
          backgroundImage: 'radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.8) 70%)'
        }}
      />
    </div>
  );
}