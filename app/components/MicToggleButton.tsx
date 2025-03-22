import React, { useState, useCallback, useEffect } from 'react';
import { Role } from 'ultravox-client';
import { toggleMute } from '@/lib/callFunctions';
import { MicIcon, MicOffIcon, Volume2Icon, VolumeOffIcon } from 'lucide-react';
import { useToast } from '@/app/context/ToastContext';

interface MicToggleButtonProps {
  role: Role;
}

export default function MicToggleButton({ role }: MicToggleButtonProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const { showToast } = useToast();

  const triggerAnimation = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300); // Match duration with CSS transition
  };

  const toggleMic = useCallback(async () => {
    try {
      toggleMute(role);
      const newMutedState = !isMuted;
      setIsMuted(newMutedState);
      triggerAnimation();

      const deviceType = role === Role.USER ? 'Microphone' : 'Speaker';
      const action = newMutedState ? 'muted' : 'unmuted';
      showToast(
        `${deviceType} ${action}`, 
        newMutedState ? 'warning' : 'success'
      );
    } catch (error) {
      console.error("Error toggling microphone:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      showToast(`Failed to toggle ${role === Role.USER ? 'microphone' : 'speaker'}: ${errorMessage}`, 'error');
    }
  }, [role, isMuted, showToast]);

  // Reset mute state when component unmounts
  useEffect(() => {
    return () => {
      if (isMuted) {
        try {
          toggleMute(role);
          showToast(`${role === Role.USER ? 'Microphone' : 'Speaker'} reset`, 'info');
        } catch (error) {
          console.error("Error resetting microphone state:", error);
        }
      }
    };
  }, [isMuted, role, showToast]);

  return (
    <button
      onClick={toggleMic}
      className={`
        relative flex-grow flex items-center justify-center h-10 rounded-md border
        transition-all duration-300 group
        ${isMuted 
          ? 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20' 
          : 'bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20'
        }
        ${isAnimating ? 'scale-95' : 'scale-100'}
      `}
    >
      <div className="relative flex items-center">
        {role === Role.USER ? (
          <div className="relative">
            {isMuted ? (
              <>
                <MicOffIcon size={20} />
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              </>
            ) : (
              <>
                <MicIcon size={20} />
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              </>
            )}
          </div>
        ) : (
          <div className="relative">
            {isMuted ? (
              <>
                <VolumeOffIcon size={20} />
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              </>
            ) : (
              <>
                <Volume2Icon size={20} />
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              </>
            )}
          </div>
        )}
        <span className="ml-2 font-medium">
          {isMuted ? 'Unmute' : 'Mute'} {role === Role.USER ? 'Mic' : 'Speaker'}
        </span>
      </div>

      {/* Ripple effect on hover */}
      <div className="absolute inset-0 overflow-hidden rounded-md pointer-events-none">
        <div className={`
          absolute inset-0 transform scale-0 group-hover:scale-100 
          transition-transform duration-700 ease-out rounded-md 
          ${isMuted 
            ? 'bg-red-400/5' 
            : 'bg-green-400/5'
          }
        `} />
      </div>

      {/* Focus ring */}
      <div className={`
        absolute -inset-0.5 rounded-lg pointer-events-none
        transition-opacity duration-300
        ${isMuted 
          ? 'ring-2 ring-red-500/30 ring-offset-0' 
          : 'ring-2 ring-green-500/30 ring-offset-0'
        }
        opacity-0 focus-visible:opacity-100
      `} />
    </button>
  );
}
