import { User, Message, MessageType } from "@/types";
import { ChatSidebar } from "./ChatSidebar";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { ChatHeader } from "./ChatHeader";
import { UserInfo } from "../../UserInfo";
import { MessageDialogs } from "../../MessageDialogs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import { useChat, useIsMobile, useMessageOperations } from "@/hooks";
import { MediaGalleryModal } from "./MediaGalleryModal";
import { useState, useMemo, useEffect } from "react";
import { useSocket } from "@/contexts/SocketContext";
import { userService } from '@/api';
import { useUsers } from "@/contexts/UserContext";


interface ChatViewProps {
  onMessageDelete?: (messageId: number) => void;
  onMessageEdit?: (message: Message) => void;
  isLoadingUsers?: boolean;
}

export const ChatView = ({ onMessageDelete, onMessageEdit, isLoadingUsers }: ChatViewProps) => {
  const { user } = useAuth();
  const {users } = useUsers()
  const isMobile = useIsMobile();
  const socket = useSocket();
  const [onlineUserIds, setOnlineUserIds] = useState<Set<number>>(new Set());
  const [unreadMessages, setUnreadMessages] = useState<import("@/types/message").Message[]>([]);

  // Add state to control sidebar visibility on mobile
  const [showSidebar, setShowSidebar] = useState(true);

  const {
    selectedUser,
    showUserInfo,
    activeChat,
    replyTo,
    messages,
    filteredMessages,
    isLoadingMessages,
    handleSendMessage,
    handleUserClick,
    handleUserAvatarClick,
    handleCloseUserInfo,
    handleReplyMessage,
    handleCancelReply,
    handleReactToMessage,
    setMessages
  } = useChat();


  const {
    messageToDelete,
    messageToEdit,
    editedContent,
    setEditedContent,
    setMessageToDelete,
    setMessageToEdit,
    handleDeleteMessage,
    confirmDeleteMessage,
    handleEditMessage,
    confirmEditMessage
  } = useMessageOperations(messages, setMessages, onMessageDelete, onMessageEdit);

  // Gallery modal state
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  // Collect all media messages (images/videos) in the current chat
  const mediaMessages = useMemo(
    () => filteredMessages.filter(m => m.type === MessageType.IMAGE || m.type === MessageType.VIDEO),
    [filteredMessages]
  );
  // Handler to open gallery modal
  const handleMediaClick = (messageId: number) => {
    const idx = mediaMessages.findIndex(m => m.id === messageId);
    if (idx !== -1) {
      setGalleryIndex(idx);
      setGalleryOpen(true);
    }
  };

  // Handler for user click in sidebar (mobile aware)
  const handleUserClickMobile = (user: User) => {
    handleUserClick(user); // existing logic
    if (isMobile) setShowSidebar(false); // hide sidebar, show chat area
  };

  // Handler for back button in chat area
  const handleBackToSidebar = () => {
    setShowSidebar(true);
  };

  useEffect(() => {
    if (!socket) return;
    const handleOnlineUsers = (ids: Set<number>) => setOnlineUserIds(new Set<number>(ids));
    socket.onOnlineUsersChange(handleOnlineUsers);
    const initial = socket.getOnlineUsers?.();
    if (initial instanceof Set) setOnlineUserIds(new Set<number>(Array.from(initial).filter((v): v is number => typeof v === 'number')));
    else setOnlineUserIds(new Set<number>());
    return () => {
      socket.removeOnlineUsersListener(handleOnlineUsers);
    };
  }, [socket]);

  useEffect(() => {
    if (!user) return;
    userService.getUserData().then(res => {
      if (res?.data?.unreadMessages) {
        setUnreadMessages(res.data.unreadMessages);
      }
    });
  }, [user]);

  return (
    <div className="flex h-full relative bg-gradient-to-br from-background to-secondary/10">
      {/* Show sidebar only on mobile if no active chat or showSidebar is true */}
      {isMobile ? (
        (!activeChat || showSidebar) ? (
          <ChatSidebar
            users={users}
            activeChat={activeChat}
            onUserClick={handleUserClickMobile}
            className="w-full h-full"
            onlineUserIds={onlineUserIds}
            currentUserId={user?.id}
            unreadMessages={unreadMessages}
            isLoading={isLoadingUsers}
          />
        ) : null
      ) : (
        <ChatSidebar
          users={users}
          activeChat={activeChat}
          onUserClick={handleUserClick}
          onlineUserIds={onlineUserIds}
          currentUserId={user?.id}
          unreadMessages={unreadMessages}
          isLoading={isLoadingUsers}
        />
      )}

      {/* Show chat area only if activeChat is selected and (not mobile or sidebar is hidden) */}
      {activeChat && (!isMobile || !showSidebar) && (
        <div className="flex-1 flex flex-col h-full border-l border-r border-border/30 bg-background/90 backdrop-blur-sm relative z-0">
          <ChatHeader
            onlineUsers={onlineUserIds}
            onUserClick={handleUserAvatarClick}
            activeChat={activeChat}
            onVoiceCall={() => { }}
            onVideoCall={() => { }}
            {...(isMobile ? { onBack: handleBackToSidebar } : {})}
          />

          <>
            <ScrollArea className="flex-1">
              <MessageList
                messages={filteredMessages}
                users={users || []}
                isLoading={isLoadingMessages}
                currentUserId={user?.id}
                onUserAvatarClick={handleUserAvatarClick}
                onDeleteMessage={handleDeleteMessage}
                onEditMessage={handleEditMessage}
                onReplyMessage={handleReplyMessage}
                onReactToMessage={handleReactToMessage}
                onMediaClick={handleMediaClick}
              />
            </ScrollArea>
            <div className="flex-shrink-0 border-t border-border/30 bg-background/50 backdrop-blur-sm">
              <MessageInput
                onSendMessage={handleSendMessage}
                currentUser={user || { id: 0, name: "Guest", avatar: "", userRole: "USER", status: "active", createdAt: new Date().toISOString(), lastActive: new Date().toISOString(), email: '', bio: '' }}
                replyTo={replyTo || undefined}
                onCancelReply={handleCancelReply}
              />
            </div>
          </>
        </div>
      )}

      {/* Show empty state only if not mobile and no active chat */}
      {!isMobile && !activeChat && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">💬</span>
            </div>
            <h3 className="font-semibold mb-2 text-lg">No conversation selected</h3>
            <p className="text-muted-foreground">Choose a user from the sidebar to start chatting</p>
          </div>
        </div>
      )}

      {showUserInfo && selectedUser && (
        <UserInfo
          user={selectedUser}
          onClose={handleCloseUserInfo}
          onlineUsers={onlineUserIds}
          className={isMobile ? "fixed inset-0 w-full h-full z-50 bg-background overflow-auto" : undefined}
        />
      )}

      <MessageDialogs
        messageToDelete={messageToDelete}
        messageToEdit={messageToEdit}
        editedContent={editedContent}
        setEditedContent={setEditedContent}
        setMessageToDelete={setMessageToDelete}
        setMessageToEdit={setMessageToEdit}
        confirmDeleteMessage={confirmDeleteMessage}
        confirmEditMessage={confirmEditMessage}
      />
      <MediaGalleryModal
        open={galleryOpen}
        mediaMessages={mediaMessages}
        currentIndex={galleryIndex}
        onClose={() => setGalleryOpen(false)}
        onNavigate={setGalleryIndex}
      />
    </div>
  );
};
