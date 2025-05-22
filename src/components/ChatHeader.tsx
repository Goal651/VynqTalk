
import { User } from "../types";

interface ChatHeaderProps {
  users: User[];
}

export const ChatHeader = ({ users }: ChatHeaderProps) => {
  const onlineCount = users.filter(user => user.isOnline).length;
  
  return (
    <div className="p-4 border-b border-border flex items-center justify-between bg-secondary/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="flex items-center space-x-2">
        <h1 className="text-xl font-semibold text-primary">PulseChat</h1>
        <div className="px-2 py-1 rounded-full bg-muted text-xs font-medium">
          {onlineCount} online
        </div>
      </div>
      <div className="flex -space-x-2">
        {users.slice(0, 3).map((user) => (
          <div 
            key={user.id} 
            className="relative w-8 h-8 rounded-full border-2 border-background overflow-hidden"
            title={user.name}
          >
            <img 
              src={user.avatar} 
              alt={user.name}
              className="w-full h-full object-cover"
            />
            {user.isOnline && (
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-background rounded-full"></span>
            )}
          </div>
        ))}
        {users.length > 3 && (
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-xs font-semibold border-2 border-background">
            +{users.length - 3}
          </div>
        )}
      </div>
    </div>
  );
};
