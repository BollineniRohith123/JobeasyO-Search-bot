import React from 'react';

interface BackgroundAnimationProps {
  variant?: 'default' | 'active' | 'subtle';
}

export default function BackgroundAnimation({ variant = 'default' }: BackgroundAnimationProps) {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Base Gradient */}
      <div 
        className={`
          absolute inset-0 transition-opacity duration-1000
          ${variant === 'active' ? 'opacity-100' : 'opacity-90'}
          ${variant === 'subtle' ? 'opacity-80' : ''}
        `}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
      </div>

      {/* Subtle Grid Pattern */}
      <div 
        className={`
          absolute inset-0 opacity-[0.03]
          [background-image:linear-gradient(0deg,transparent_24%,rgba(var(--apple-blue),0.2)_25%,rgba(var(--apple-blue),0.2)_26%,transparent_27%,transparent_74%,rgba(var(--apple-blue),0.2)_75%,rgba(var(--apple-blue),0.2)_76%,transparent_77%,transparent),linear-gradient(90deg,transparent_24%,rgba(var(--apple-blue),0.2)_25%,rgba(var(--apple-blue),0.2)_26%,transparent_27%,transparent_74%,rgba(var(--apple-blue),0.2)_75%,rgba(var(--apple-blue),0.2)_76%,transparent_77%,transparent)]
          background-size:80px 80px
          ${variant === 'active' ? 'opacity-[0.04]' : ''}
          ${variant === 'subtle' ? 'opacity-[0.02]' : ''}
        `}
      />

      {/* Ambient Orbs - Apple-like subtle gradients */}
      <div className="absolute inset-0">
        <div className="relative w-full h-full">
          {/* Top Right Orb */}
          <div 
            className={`
              absolute -top-64 -right-64 w-[600px] h-[600px] 
              bg-gradient-to-br from-[rgba(var(--apple-blue),0.15)] to-transparent
              rounded-full blur-3xl
              ${variant === 'active' ? 'opacity-30' : 'opacity-20'}
              ${variant === 'subtle' ? 'opacity-10' : ''}
            `}
          />

          {/* Bottom Left Orb */}
          <div 
            className={`
              absolute -bottom-64 -left-64 w-[600px] h-[600px]
              bg-gradient-to-tr from-[rgba(var(--apple-purple),0.15)] to-transparent
              rounded-full blur-3xl
              ${variant === 'active' ? 'opacity-30' : 'opacity-20'}
              ${variant === 'subtle' ? 'opacity-10' : ''}
            `}
          />
          
          {/* Center Orb - Only visible in active state */}
          <div 
            className={`
              absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
              w-[800px] h-[800px]
              bg-gradient-to-r from-[rgba(var(--apple-blue),0.05)] via-[rgba(var(--apple-purple),0.05)] to-[rgba(var(--apple-pink),0.05)]
              rounded-full blur-3xl
              transition-opacity duration-1000
              ${variant === 'active' ? 'opacity-30' : 'opacity-0'}
            `}
          />
        </div>
      </div>

      {/* Subtle Floating Particles - More minimal and elegant */}
      <div className="absolute inset-0">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className={`
              absolute w-1 h-1 rounded-full
              bg-gradient-to-r from-[rgba(var(--apple-blue),0.3)] to-[rgba(var(--apple-purple),0.3)]
              animate-subtle-float
            `}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0.3,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${6 + i * 0.5}s`
            }}
          />
        ))}
      </div>
      
      {/* Apple-like noise texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px'
        }}
      />
    </div>
  );
}