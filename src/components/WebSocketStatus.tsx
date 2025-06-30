import React, { useState, useEffect } from 'react';
import { useSocket } from '@/contexts/SocketContext';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, AlertCircle } from 'lucide-react';

export const WebSocketStatus: React.FC = () => {
  const [status, setStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const socket = useSocket();

  useEffect(() => {
    if (!socket) {
      setStatus('disconnected');
      return;
    }

    // Check initial connection status
    if (socket.isConnected()) {
      setStatus('connected');
    } else {
      setStatus('connecting');
    }

    // Listen for connection changes
    const checkConnection = () => {
      if (socket.isConnected()) {
        setStatus('connected');
      } else {
        setStatus('disconnected');
      }
    };

    // Check every 2 seconds
    const interval = setInterval(checkConnection, 2000);
    
    return () => clearInterval(interval);
  }, [socket]);

  const getStatusConfig = () => {
    switch (status) {
      case 'connected':
        return {
          icon: <Wifi className="h-3 w-3" />,
          text: 'Connected',
          variant: 'default' as const,
          className: 'bg-green-500 hover:bg-green-600'
        };
      case 'connecting':
        return {
          icon: <AlertCircle className="h-3 w-3 animate-pulse" />,
          text: 'Connecting...',
          variant: 'secondary' as const,
          className: 'bg-yellow-500 hover:bg-yellow-600'
        };
      case 'error':
        return {
          icon: <AlertCircle className="h-3 w-3" />,
          text: 'Error',
          variant: 'destructive' as const,
          className: 'bg-red-500 hover:bg-red-600'
        };
      default:
        return {
          icon: <WifiOff className="h-3 w-3" />,
          text: 'Disconnected',
          variant: 'secondary' as const,
          className: 'bg-gray-500 hover:bg-gray-600'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <Badge 
      variant={config.variant} 
      className={`${config.className} text-white text-xs px-2 py-1 flex items-center gap-1`}
    >
      {config.icon}
      {config.text}
    </Badge>
  );
}; 