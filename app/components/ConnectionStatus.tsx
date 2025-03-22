import React, { useMemo } from 'react';
import { 
  PhoneCall, 
  PhoneOff, 
  Wifi, 
  WifiOff, 
  AlertTriangle,
  ActivitySquare,
  SignalHigh,
  SignalMedium,
  SignalLow,
  Gauge
} from 'lucide-react';

interface ConnectionStatusProps {
  status: string;
  latency?: number;
  quality?: 'good' | 'medium' | 'poor';
}

export default function ConnectionStatus({ 
  status, 
  latency = 0, 
  quality = 'good' 
}: ConnectionStatusProps) {
  const statusConfig = useMemo(() => {
    const normalizedStatus = status.toLowerCase().trim();
    switch (normalizedStatus) {
      case 'connected':
      case 'call started successfully':
        return {
          icon: PhoneCall,
          color: 'text-green-400',
          bgColor: 'bg-green-500/10',
          borderColor: 'border-green-500/30',
          message: 'Connected'
        };
      case 'connecting':
      case 'starting call...':
        return {
          icon: Wifi,
          color: 'text-yellow-400',
          bgColor: 'bg-yellow-500/10',
          borderColor: 'border-yellow-500/30',
          message: 'Connecting'
        };
      case 'off':
      case 'disconnected':
        return {
          icon: PhoneOff,
          color: 'text-gray-400',
          bgColor: 'bg-gray-500/10',
          borderColor: 'border-gray-500/30',
          message: 'Disconnected'
        };
      case 'error':
        return {
          icon: AlertTriangle,
          color: 'text-red-400',
          bgColor: 'bg-red-500/10',
          borderColor: 'border-red-500/30',
          message: 'Error'
        };
      default:
        // Changed default case to match 'disconnected' styling
        return {
          icon: PhoneOff,
          color: 'text-gray-400',
          bgColor: 'bg-gray-500/10',
          borderColor: 'border-gray-500/30',
          message: 'Disconnected'
        };
    }
  }, [status]);

  const getQualityColor = (quality: string) => {
    switch (quality.toLowerCase()) {
      case 'good':
      case 'excellent':
        return 'text-green-400';
      case 'medium':
      case 'fair':
        return 'text-yellow-400';
      case 'poor':
        // Only show red if actually connected, otherwise use gray
        return status.toLowerCase().includes('connected') ? 'text-red-400' : 'text-gray-400';
      default:
        return 'text-gray-400';
    }
  };

  // Improved latency status thresholds
  const getLatencyStatus = (latency: number) => {
    if (status.toLowerCase().includes('disconnected')) return 'Inactive';
    if (latency <= 100) return 'Excellent';
    if (latency <= 200) return 'Good';
    if (latency <= 300) return 'Fair';
    return 'Poor';
  };

  const Icon = statusConfig.icon;

  return (
    <div className={`
      flex flex-col space-y-3 p-4 rounded-lg border
      ${statusConfig.bgColor} ${statusConfig.borderColor}
      transition-all duration-300 backdrop-blur-sm
    `}>
      <div className="flex items-center justify-between">
        <div className={`flex items-center ${statusConfig.color} transition-colors`}>
          <Icon size={18} className="mr-2" />
          <span className="font-medium">{statusConfig.message}</span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1">
            <Gauge size={14} className={getQualityColor(quality)} />
            <span className={`text-xs ${getQualityColor(quality)}`}>{quality}</span>
          </div>
          <ActivitySquare size={14} className={`${statusConfig.color} ${status.toLowerCase().includes('connected') ? 'animate-pulse' : ''}`} />
        </div>
      </div>

      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          <span className={getQualityColor(getLatencyStatus(latency).toLowerCase())}>
            {latency}ms
          </span>
          <span className="text-gray-400">•</span>
          <span className={getQualityColor(getLatencyStatus(latency).toLowerCase())}>{getLatencyStatus(latency)}</span>
        </div>
      </div>

      <div className="flex items-end space-x-1 h-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className={`
              w-1.5 rounded-sm transition-all duration-300
              ${i < getQualityLevel(quality, status) 
                ? `${getQualityColor(quality)} animate-pulse`
                : 'bg-gray-700'
              }
            `}
            style={{ 
              height: `${(i + 1) * 6}px`,
              animationDelay: `${i * 150}ms`
            }}
          />
        ))}
      </div>
    </div>
  );
}

function getQualityLevel(quality: 'good' | 'medium' | 'poor', status: string): number {
  // Don't show quality bars when disconnected
  if (status.toLowerCase().includes('disconnected')) return 0;
  
  switch (quality) {
    case 'good':
      return 4;
    case 'medium':
      return 3;
    case 'poor':
      return 1;
    default:
      return 0;
  }
}
