import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { Role } from 'ultravox-client';
import { toggleMic } from '@/lib/clientTools';

interface MicToggleButtonProps {
  role: Role;
}

export default function MicToggleButton({ role }: MicToggleButtonProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const isUser = role === Role.USER;
  const label = isUser ? 'Microphone' : 'Speaker';
  const Icon = isUser ? (isMuted ? MicOff : Mic) : (isMuted ? VolumeX : Volume2);

  const handleToggle = async () => {
    try {
      setIsAnimating(true);
      await toggleMic(role);
      setIsMuted(prev => !prev);
      setTimeout(() => setIsAnimating(false), 300);
    } catch (error) {
      console.error(`Error toggling ${label}:`, error);
      setIsAnimating(false);
    }
  };

  // Pulse animation for active microphone
  useEffect(() => {
    if (!isMuted && isUser) {
      const interval = setInterval(() => {
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 300);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isMuted, isUser]);

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`
        relative flex items-center justify-center h-12 px-4 rounded-lg transition-all duration-300
        ${isMuted 
          ? 'bg-red-500/20 hover:bg-red-600/30 text-red-300 border border-red-500/30' 
          : isUser
            ? 'bg-green-500/20 hover:bg-green-600/30 text-green-300 border border-green-500/30'
            : 'bg-blue-500/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30'
        }
        ${isAnimating ? 'scale-105' : 'scale-100'}
        hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 
        ${isMuted ? 'focus:ring-red-500/50' : isUser ? 'focus:ring-green-500/50' : 'focus:ring-blue-500/50'}
      `}
    >
      {/* Animated ring for active microphone */}
      {!isMuted && isUser && (
        <span className="absolute inset-0 rounded-lg border border-green-500/30 animate-ping opacity-30"></span>
      )}
      
      <Icon className="w-5 h-5 mr-2" />
      <span>{isMuted ? `${label} Off` : `${label} On`}</span>
      
      {/* Voice activity indicators for user microphone */}
      {!isMuted && isUser && (
        <div className="flex items-center ml-2 space-x-1">
          <div className="w-1 h-3 bg-green-400/70 rounded-full animate-voice-wave"></div>
          <div className="w-1 h-5 bg-green-400/70 rounded-full animate-voice-wave" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-1 h-4 bg-green-400/70 rounded-full animate-voice-wave" style={{ animationDelay: '0.4s' }}></div>
        </div>
      )}
    </button>
  );
}