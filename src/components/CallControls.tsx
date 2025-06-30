import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Phone, PhoneOff, Video, VideoOff, Mic, MicOff } from "lucide-react";
import { User } from '@/types';

interface CallControlsProps {
  activeChat: User | null;
}

export const CallControls = ({ activeChat }: CallControlsProps) => {
  const { toast } = useToast();
  const [isInCall, setIsInCall] = useState(false);
  const [callType, setCallType] = useState<'voice' | 'video' | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const handleVoiceCall = () => {
    if (!activeChat) return;
    
    setIsInCall(true);
    setCallType('voice');
    toast({
      title: "Voice call started",
      description: `Calling ${activeChat.name}...`,
    });
  };

  const handleVideoCall = () => {
    if (!activeChat) return;
    
    setIsInCall(true);
    setCallType('video');
    toast({
      title: "Video call started",
      description: `Video calling ${activeChat.name}...`,
    });
  };

  const handleEndCall = () => {
    setIsInCall(false);
    setCallType(null);
    setIsMuted(false);
    setIsVideoOff(false);
    toast({
      title: "Call ended",
      description: "Call has been disconnected",
    });
  };

  if (!activeChat) return null;

  if (isInCall) {
    return (
      <div className="fixed top-4 right-4 z-50 bg-background border border-border rounded-lg p-4 shadow-lg">
        <div className="flex items-center space-x-2 mb-3">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">
            {callType === 'video' ? 'Video' : 'Voice'} call with {activeChat.name}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant={isMuted ? "destructive" : "outline"}
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
          
          {callType === 'video' && (
            <Button
              size="sm"
              variant={isVideoOff ? "destructive" : "outline"}
              onClick={() => setIsVideoOff(!isVideoOff)}
            >
              {isVideoOff ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
            </Button>
          )}
          
          <Button
            size="sm"
            variant="destructive"
            onClick={handleEndCall}
          >
            <PhoneOff className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleVoiceCall}
        className="bg-background/50 hover:bg-primary/10"
      >
        <Phone className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleVideoCall}
        className="bg-background/50 hover:bg-primary/10"
      >
        <Video className="h-4 w-4" />
      </Button>
    </div>
  );
};
