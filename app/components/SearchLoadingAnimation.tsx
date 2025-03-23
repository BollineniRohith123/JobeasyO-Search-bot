import React from 'react';
import { Search } from 'lucide-react';

export default function SearchLoadingAnimation() {
  return (
    <div className="relative flex flex-col items-center">
      {/* Outer circle */}
      <div className="w-20 h-20 rounded-full border-4 border-blue-500/20 animate-pulse"></div>
      
      {/* Spinning circle */}
      <div className="w-20 h-20 rounded-full border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent absolute top-0 left-0 animate-spin"></div>
      
      {/* Search icon */}
      <Search className="w-8 h-8 text-blue-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      
      {/* Animated dots */}
      <div className="flex space-x-2 mt-6">
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
      </div>
      
      {/* Animated particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/50 rounded-full animate-float-particle"
            style={{
              left: `${50 + Math.cos(i * Math.PI / 3) * 30}%`,
              top: `${50 + Math.sin(i * Math.PI / 3) * 30}%`,
              animationDelay: `${i * 0.2}s`,
              animationDuration: '2s'
            }}
          />
        ))}
      </div>
    </div>
  );
}