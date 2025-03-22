import React from 'react';
import LoadingDots from './LoadingDots';

export default function SearchLoadingAnimation() {
  return (
    <div className="flex flex-col items-center justify-center py-8 space-y-4">
      <div className="relative">
        <div className="absolute inset-0 w-16 h-16 rounded-full bg-blue-500/20 animate-pulse"></div>
        <div className="absolute inset-0 w-16 h-16 rounded-full bg-blue-400/10 animate-ping"></div>
        <div className="relative z-10">
          <LoadingDots size={3} color="bg-blue-400" />
        </div>
      </div>
      <div className="space-y-2 text-center">
        <p className="text-blue-300 font-medium animate-pulse">
          AI Job Search in Progress
        </p>
        <p className="text-gray-400 text-sm flex flex-col items-center space-y-1">
          <span>Analyzing your profile</span>
          <span>Matching with opportunities</span>
          <span>Finding perfect matches</span>
        </p>
      </div>
    </div>
  );
}
