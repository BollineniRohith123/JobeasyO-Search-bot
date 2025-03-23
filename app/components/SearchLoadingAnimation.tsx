import React from 'react';
import { Search, Briefcase, Building } from 'lucide-react';

export default function SearchLoadingAnimation() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative">
        <div className="flex items-center space-x-2">
          {/* Animated icons */}
          <div className="flex items-center justify-center w-8 h-8">
            <Search 
              className="w-6 h-6 text-[rgba(var(--apple-blue),1)] absolute animate-ping opacity-75"
              style={{ animationDuration: '2s' }}
            />
            <Search className="w-6 h-6 text-[rgba(var(--apple-blue),1)] relative" />
          </div>
          <div className="flex items-center justify-center w-8 h-8">
            <Briefcase 
              className="w-6 h-6 text-[rgba(var(--apple-purple),1)] absolute animate-ping opacity-75"
              style={{ animationDuration: '2s', animationDelay: '0.5s' }}
            />
            <Briefcase className="w-6 h-6 text-[rgba(var(--apple-purple),1)] relative" />
          </div>
          <div className="flex items-center justify-center w-8 h-8">
            <Building 
              className="w-6 h-6 text-[rgba(var(--apple-pink),1)] absolute animate-ping opacity-75"
              style={{ animationDuration: '2s', animationDelay: '1s' }}
            />
            <Building className="w-6 h-6 text-[rgba(var(--apple-pink),1)] relative" />
          </div>
        </div>
      </div>
      <div className="mt-4 flex flex-col items-center space-y-2">
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 rounded-full bg-[rgba(var(--apple-blue),1)] animate-bounce" style={{ animationDelay: '0s' }} />
          <div className="w-2 h-2 rounded-full bg-[rgba(var(--apple-purple),1)] animate-bounce" style={{ animationDelay: '0.2s' }} />
          <div className="w-2 h-2 rounded-full bg-[rgba(var(--apple-pink),1)] animate-bounce" style={{ animationDelay: '0.4s' }} />
        </div>
        <span className="text-gray-400 text-sm font-medium">
          Searching for opportunities...
        </span>
      </div>
    </div>
  );
}