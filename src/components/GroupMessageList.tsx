import { GroupMessage, User, Reaction } from '@/types';
import GroupMessageBubble from './GroupMessageBubble';
import { Skeleton } from '@/components/ui/skeleton';

interface GroupMessageListProps {
  messages: GroupMessage[];
  users: User[];
  currentUserId?: number;
  isLoading?: boolean;
  onUserAvatarClick?: (user: User) => void;
  onDeleteMessage?: (messageId: number) => void;
  onEditMessage?: (message: GroupMessage) => void;
  onReplyMessage?: (message: GroupMessage) => void;
  onReactToMessage?: (messageId: number, reaction: Reaction) => void;
  onMediaClick?: (messageId: number) => void;
}

export const GroupMessageList = ({
  messages,
  users,
  currentUserId,
  isLoading = false,
  onUserAvatarClick,
  onDeleteMessage,
  onEditMessage,
  onReplyMessage,
  onReactToMessage,
  onMediaClick
}: GroupMessageListProps) => {
  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-20 rounded" />
                <Skeleton className="h-3 w-16 rounded" />
              </div>
              <Skeleton className="h-16 w-3/4 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (!messages.length) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl">💬</span>
          </div>
          <h3 className="font-semibold mb-2 text-lg">No messages yet</h3>
          <p className="text-muted-foreground">Be the first to start the conversation!</p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-2 p-2">
      {messages.map((message) => {
        const sender = users.find(u => u.id === message.sender.id) || message.sender;
        return (
          <GroupMessageBubble
            key={message.id}
            message={message}
            user={sender}
            currentUserId={currentUserId}
            onUserAvatarClick={() => onUserAvatarClick?.(sender)}
            onDeleteMessage={() => onDeleteMessage?.(message.id)}
            onEditMessage={() => onEditMessage?.(message)}
            onReplyMessage={onReplyMessage}
            onReactToMessage={onReactToMessage}
            onMediaClick={onMediaClick}
            isGroupAdmin={!!sender.userRole && sender.userRole === 'ADMIN'}
          />
        );
      })}
    </div>
  );
};

export default GroupMessageList; 