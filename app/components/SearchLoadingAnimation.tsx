import React, { useState, useEffect } from 'react';
import LoadingDots from './LoadingDots';

export default function SearchLoadingAnimation() {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = [
    'Connecting to Perplexity API...',
    'Analyzing your profile...',
    'Searching job databases...',
    'Matching with opportunities...',
    'Finding perfect matches...',
    'Retrieving application links...'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % steps.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

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
        <div className="text-gray-400 text-sm flex flex-col items-center space-y-1">
          {steps.map((step, index) => (
            <span 
              key={index} 
              className={`transition-all duration-300 ${
                index === currentStep 
                  ? 'text-blue-300 font-medium scale-105' 
                  : index < currentStep 
                    ? 'text-green-400 line-through opacity-70' 
                    : 'opacity-50'
              }`}
            >
              {step}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}