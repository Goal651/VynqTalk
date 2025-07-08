import { useState } from "react";
import { User } from '@/types';
import { X, UserPlus, UserMinus, Eye, EyeOff } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks";

interface UserInfoProps {
  user: User;
  onClose: () => void;
  className?: string;
  onlineUsers: Set<number>
}

export const UserInfo = ({ user, onClose, className, onlineUsers }: UserInfoProps) => {
  const [isBlocked, setIsBlocked] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const isOnline = onlineUsers.has(user.id)

  const handleBlockUser = () => {
    setIsBlocked(!isBlocked);
    toast({
      title: !isBlocked ? "User blocked" : "User unblocked",
      description: !isBlocked
        ? `You won't receive messages from ${user.name}`
        : `You will now receive messages from ${user.name}`,
    });
  };

  const handleHideUser = () => {
    setIsHidden(!isHidden);
    toast({
      title: !isHidden ? "User hidden" : "User unhidden",
      description: !isHidden
        ? `${user.name} will be hidden from your chat list`
        : `${user.name} will be visible in your chat list`,
    });
  };

  return (
    <div className={`w-80 border-l border-border bg-card h-full flex flex-col ${className ?? ""}`}>
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h2 className="text-lg font-semibold">User Info</h2>
        <Button type="button" size="icon" variant="ghost" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="p-6 flex flex-col items-center">
        <Avatar className="h-20 w-20 mb-4">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <h3 className="text-xl font-bold">{user.name}</h3>
        <p className="text-sm text-muted-foreground mb-4">
          {isOnline ? "Online" : "Offline"}
        </p>

        <div className="w-full space-y-3 mt-6">
          <Button type="button"
            variant={isBlocked ? "default" : "outline"}
            className="w-full justify-start"
            onClick={handleBlockUser}
          >
            {isBlocked ? <UserPlus className="mr-2 h-4 w-4" /> : <UserMinus className="mr-2 h-4 w-4" />}
            {isBlocked ? "Unblock User" : "Block User"}
          </Button>

          <Button type="button"
            variant={isHidden ? "default" : "outline"}
            className="w-full justify-start"
            onClick={handleHideUser}
          >
            {isHidden ? <Eye className="mr-2 h-4 w-4" /> : <EyeOff className="mr-2 h-4 w-4" />}
            {isHidden ? "Show User" : "Hide User"}
          </Button>
        </div>
      </div>
    </div>
  );
};
