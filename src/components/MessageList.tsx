
import { Message, User } from "../types";
import { MessageBubble } from "./MessageBubble";

interface MessageListProps {
  messages: Message[];
  users: User[];
  currentUserId?: number;
  onUserAvatarClick?: () => void;
  onDeleteMessage?: (message: Message) => void;
  onEditMessage?: (message: Message) => void;
  onReplyMessage?: (message: Message) => void;
  onReactToMessage?: (messageId: number, emoji: string) => void;
}

export const MessageList = ({
  messages,
  users,
  currentUserId = 1,
  onUserAvatarClick,
  onDeleteMessage,
  onEditMessage,
  onReplyMessage,
  onReactToMessage,
}: MessageListProps) => {
  console.log("MessageList received messages:", messages.length);
  console.log("MessageList users:", users.length);

  const getUserById = (userId: number) => {
    const user = users.find((u) => u.id === userId);
    if (!user) {
      console.log("User not found for ID:", userId);
      return {
        id: userId,
        name: "Unknown User",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
        isOnline: false,
        isAdmin: false,
      };
    }
    return user;
  };

  const sortedMessages = [...messages].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  return (
    <div className="flex flex-col space-y-4 p-4">
      {sortedMessages.map((message) => {
        const user = getUserById(message.senderId);
        console.log("Rendering message:", message.id, "from user:", user.name);

        return (
          <MessageBubble
            key={message.id}
            message={message}
            user={user as User}
            currentUserId={currentUserId}
            onUserAvatarClick={onUserAvatarClick}
            onDeleteMessage={() => onDeleteMessage?.(message)}
            onEditMessage={() => onEditMessage?.(message)}
            onReplyMessage={onReplyMessage}
            onReactToMessage={onReactToMessage}
          />
        );
      })}
    </div>
  );
};
