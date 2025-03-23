import React from 'react';
import { Loader2 } from 'lucide-react';
import GradientText from './GradientText';

interface LoadingScreenProps {
  message?: string;
}

export default function LoadingScreen({ message = 'Loading...' }: LoadingScreenProps) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex flex-col items-center justify-center">
      <div className="relative">
        <div className="w-20 h-20 rounded-full border-4 border-blue-500/30 animate-spin"></div>
        <div className="w-20 h-20 rounded-full border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent absolute top-0 left-0 animate-spin"></div>
        <Loader2 className="w-10 h-10 text-blue-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
      </div>
      
      <div className="mt-8 text-center">
        <h2 className="text-2xl font-bold mb-2">
          <GradientText animate>{message}</GradientText>
        </h2>
        <p className="text-gray-400 max-w-md text-center">
          Please wait while we prepare your experience
        </p>
      </div>
      
      {/* Loading bar animation */}
      <div className="w-64 h-1 bg-gray-800 rounded-full mt-8 overflow-hidden">
        <div className="h-full w-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 animate-loading-bar"></div>
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