import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingScreenProps {
  message?: string;
}

export default function LoadingScreen({ message = 'Loading...' }: LoadingScreenProps) {
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block mb-4">
          <Loader2 size={48} className="text-blue-400 animate-spin" />
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-blue-400">{message}</h2>
          <div className="flex justify-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0s' }} />
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0.4s' }} />
          </div>
          <p className="text-gray-400 max-w-sm mx-auto text-sm">
            Setting up your voice interaction experience...
          </p>
        </div>
      </div>

      {/* Background Animation */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/20 to-purple-900/20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
      </div>
    </div>
  );
}

export function LoadingSpinner({ size = 24, className = '' }) {
  return (
    <Loader2 
      size={size} 
      className={`text-blue-400 animate-spin ${className}`} 
    />
  );
}
