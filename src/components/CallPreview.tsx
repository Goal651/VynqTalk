
import { User } from "../types";
import { Phone, Video, X, Mic, MicOff, VideoOff } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface CallPreviewProps {
  user: User;
  type: "audio" | "video";
  isOutgoing: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

export const CallPreview = ({ user, type, isOutgoing, onAccept, onDecline }: CallPreviewProps) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-card border border-border rounded-lg shadow-lg w-full max-w-md p-6">
        <div className="flex flex-col items-center justify-center">
          <h3 className="text-xl font-semibold mb-2">
            {isOutgoing ? "Calling..." : "Incoming Call"}
          </h3>
          
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          
          <h2 className="text-2xl font-bold mb-1">{user.name}</h2>
          <p className="text-muted-foreground mb-6 flex items-center">
            {type === "audio" ? (
              <Phone className="h-4 w-4 mr-2" />
            ) : (
              <Video className="h-4 w-4 mr-2" />
            )}
            {type === "audio" ? "Audio Call" : "Video Call"}
          </p>
          
          {type === "video" && !isOutgoing && (
            <div className="bg-muted h-40 w-full rounded-lg mb-6 flex items-center justify-center">
              <p className="text-muted-foreground">Video Preview</p>
            </div>
          )}
          
          <div className="flex justify-center space-x-4 w-full">
            {!isOutgoing ? (
              <>
                <Button 
                  size="lg" 
                  variant="destructive" 
                  className="rounded-full h-12 w-12"
                  onClick={onDecline}
                >
                  <X className="h-6 w-6" />
                </Button>
                <Button 
                  size="lg" 
                  variant="default" 
                  className="rounded-full h-12 w-12 bg-green-500 hover:bg-green-600"
                  onClick={onAccept}
                >
                  {type === "audio" ? (
                    <Phone className="h-6 w-6" />
                  ) : (
                    <Video className="h-6 w-6" />
                  )}
                </Button>
              </>
            ) : (
              <>
                {type === "video" && (
                  <Button 
                    size="lg" 
                    variant={isVideoOff ? "default" : "outline"} 
                    className="rounded-full h-12 w-12"
                    onClick={() => setIsVideoOff(!isVideoOff)}
                  >
                    {isVideoOff ? (
                      <VideoOff className="h-6 w-6" />
                    ) : (
                      <Video className="h-6 w-6" />
                    )}
                  </Button>
                )}
                <Button 
                  size="lg" 
                  variant={isMuted ? "default" : "outline"} 
                  className="rounded-full h-12 w-12"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? (
                    <MicOff className="h-6 w-6" />
                  ) : (
                    <Mic className="h-6 w-6" />
                  )}
                </Button>
                <Button 
                  size="lg" 
                  variant="destructive" 
                  className="rounded-full h-12 w-12"
                  onClick={onDecline}
                >
                  <Phone className="h-6 w-6" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
