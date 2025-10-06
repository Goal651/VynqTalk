import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageType, User } from "@/types";
import { formatDistanceToNow } from "date-fns";

interface ISidebarUser {
    user: User,
    currentUserId: number,
    unreadCountByUser: Record<number, number>
    handleUserClick: (user: User) => void
    activeChat: User
}

export default function SidebarUser({ user, currentUserId, unreadCountByUser, handleUserClick, activeChat }: ISidebarUser) {
    const isCurrentUser = user.id === currentUserId;
    const latestMessage = user.latestMessage;
    const unreadCount = unreadCountByUser[user.id] || 0;
    const isLatestMessageFile = latestMessage?.type !== MessageType.TEXT
    const isSender = latestMessage?.sender?.id == currentUserId
    return (
        <div
            key={user.id}
            className={`flex items-center p-3 hover:bg-muted/50 cursor-pointer border-b border-border group transition-all duration-200
                 ${activeChat?.id === user.id ? "bg-muted/50 border-l-4 border-l-primary" : "hover:bg-accent/30"                }`}
            onClick={() => handleUserClick(user)}
        >
            <div className="relative">
                <Avatar className={`cursor-pointer transition-transform hover:scale-105`}>
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                        {user.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                {!isCurrentUser && (
                    <span
                        className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white shadow ${user.isOnline ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}
                        title={user.isOnline ? "Online" : "Offline"}
                    />
                )}
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow border border-white min-w-[18px] text-center select-none" title={`${unreadCount} unread message${unreadCount > 1 ? 's' : ''}`}>{unreadCount > 9 ? '9+' : unreadCount}</span>
                )}
            </div>
            <div className="ml-3 flex-1 overflow-hidden">
                <div className="font-medium text-foreground truncate">{user.name}</div>
                {latestMessage ? (
                    <div className="text-xs text-muted-foreground truncate flex items-center gap-2">
                        {isSender && (<span>You: </span>)}
                        {isLatestMessageFile ? (
                            <span className="truncate max-w-[10rem]">Sent {latestMessage.type.toLocaleLowerCase()}</span>
                        ) : (
                            <span className="truncate max-w-[10rem]">{latestMessage.content}</span>
                        )}
                        {latestMessage.timestamp && (
                            <span className="whitespace-nowrap">· {formatDistanceToNow(new Date(latestMessage.timestamp), { addSuffix: true })}</span>
                        )}
                    </div>
                ) : (
                    <div className="text-xs text-muted-foreground truncate flex items-center gap-2">
                        Say hi to your new friend
                    </div>
                )}
            </div>
        </div >
    );

}