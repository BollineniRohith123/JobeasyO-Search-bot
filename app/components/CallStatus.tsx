import React, { ReactNode } from 'react';
import { PhoneIcon, Mic, MicOff, Volume2, Volume1, VolumeX } from 'lucide-react';
import ConnectionStatus from './ConnectionStatus';

interface CallStatusProps {
  status: string;
  children?: ReactNode;
}

function CallStatus({ status, children }: CallStatusProps) {
  const normalizedStatus = status.toLowerCase().trim();
  const isActive = normalizedStatus === 'connected' || normalizedStatus === 'call started successfully';
  const isConnecting = normalizedStatus === 'connecting' || normalizedStatus === 'starting call...';
  
  return (
    <div className={`flex flex-col bg-gray-900/95 backdrop-blur border transition-colors duration-300 ${
      isActive ? 'border-blue-800/50' : isConnecting ? 'border-yellow-800/50' : 'border-gray-800'
    } rounded-lg p-6 w-full lg:w-1/3`}>
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <h2 className="text-xl font-bold text-blue-400 flex items-center">
            <div className="relative">
              <PhoneIcon size={20} className="mr-2" />
              {isActive && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              )}
            </div>
            Voice Interaction
          </h2>
        </div>

        <ConnectionStatus 
          status={status}
          latency={100}
          quality={
            isActive ? 'good' :
            isConnecting ? 'medium' :
            'poor'
          }
        />

        <div className="mt-4 p-4 rounded-lg bg-gray-900/80 border border-gray-800/50 transition-all duration-300">
          <div className="flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 font-medium">Voice Activity</span>
              <VoiceActivityIndicator status={status} />
            </div>
            <div className="flex justify-center space-x-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-1 rounded-full transition-all duration-300 ${
                    isActive ? 'bg-green-400' : isConnecting ? 'bg-yellow-400' : 'bg-gray-600'
                  }`}
                  style={{
                    height: isActive ? `${8 + Math.random() * 16}px` : '4px',
                    animationDelay: `${i * 0.15}s`,
                    animation: isActive ? 'voice-wave 1s ease-in-out infinite' : 'none'
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        {children}
      </div>
    </div>
  );
}

const VoiceActivityIndicator: React.FC<{ status: string }> = ({ status }) => {
  const normalizedStatus = status.toLowerCase().trim();
  
  if (normalizedStatus === 'off' || normalizedStatus === 'disconnected') {
    return (
      <div className="flex items-center space-x-2 text-gray-500 transition-colors duration-300">
        <VolumeX size={14} />
        <span className="text-xs font-medium">Inactive</span>
      </div>
    );
  }

  if (normalizedStatus === 'connecting' || normalizedStatus === 'starting call...') {
    return (
      <div className="flex items-center space-x-2 text-yellow-400 transition-colors duration-300">
        <Volume1 size={14} className="animate-pulse" />
        <span className="text-xs font-medium">Initializing</span>
      </div>
    );
  }

  if (normalizedStatus === 'connected' || normalizedStatus === 'call started successfully') {
    return (
      <div className="flex items-center space-x-2 text-green-400 transition-colors duration-300">
        <Volume2 size={14} className="animate-pulse" />
        <span className="text-xs font-medium">Active</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2 text-red-400 transition-colors duration-300">
      <MicOff size={14} />
      <span className="text-xs font-medium">Error</span>
    </div>
  );
};

export default CallStatus;
