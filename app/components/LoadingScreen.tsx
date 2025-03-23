import React from 'react';
import { Loader2 } from 'lucide-react';
import GradientText from './GradientText';

interface LoadingScreenProps {
  message?: string;
}

export default function LoadingScreen({ message = 'Loading...' }: LoadingScreenProps) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center">
      <div className="text-center scale-in">
        <div className="inline-block mb-4">
          <Loader2 size={48} className="text-[rgba(var(--apple-blue),1)] animate-spin" />
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">
            <GradientText>{message}</GradientText>
          </h2>
          <div className="flex justify-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-[rgba(var(--apple-blue),1)] animate-bounce" style={{ animationDelay: '0s' }} />
            <div className="w-2 h-2 rounded-full bg-[rgba(var(--apple-purple),1)] animate-bounce" style={{ animationDelay: '0.2s' }} />
            <div className="w-2 h-2 rounded-full bg-[rgba(var(--apple-pink),1)] animate-bounce" style={{ animationDelay: '0.4s' }} />
          </div>
          <p className="text-gray-400 max-w-sm mx-auto text-sm">
            Setting up your voice interaction experience...
          </p>
        </div>
      </div>

      {/* Background Animation */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-tr from-[rgba(var(--apple-blue),0.1)] to-[rgba(var(--apple-purple),0.1)]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[rgba(var(--apple-blue),0.05)] rounded-full blur-3xl animate-pulse" />
      </div>
    </div>
  );
}

export function LoadingSpinner({ size = 24, className = '' }) {
  return (
    <Loader2 
      size={size} 
      className={`text-[rgba(var(--apple-blue),1)] animate-spin ${className}`} 
    />
  );
}