
import { User, Message } from "../types";
import { ChatSidebar } from "./ChatSidebar";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { ChatHeader } from "./ChatHeader";
import { UserInfo } from "./UserInfo";
import { MessageDialogs } from "./MessageDialogs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import { useChat } from "@/hooks/useChat";
import { useMessageOperations } from "@/hooks/useMessageOperations";


interface ChatViewProps {
  onMessageDelete?: (messageId: number) => void;
  onMessageEdit?: (message: Message) => void;
  users?: User[];
}

export const ChatView = ({ onMessageDelete, onMessageEdit, users }: ChatViewProps) => {
  const { user } = useAuth();
  const {
    selectedUser,
    showUserInfo,
    activeChat,
    replyTo,
    messages,
    filteredMessages,
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

  return (
    <div className="flex h-full relative bg-gradient-to-br from-background to-secondary/10">

      <ChatSidebar
        users={users}
        onUserClick={handleUserClick}
        activeChat={activeChat}
      />
      
      <div className="flex-1 flex flex-col h-full border-l border-r border-border/30 bg-background/90 backdrop-blur-sm relative z-0">
        <ChatHeader
          users={users}
          activeChat={activeChat}
          onVoiceCall={() => {}}
          onVideoCall={() => {}}
        />

        {activeChat ? (
          <>
            <ScrollArea className="flex-1">
              <MessageList
                messages={filteredMessages}
                users={users || []}
                currentUserId={user?.id}
                onUserAvatarClick={handleUserAvatarClick}
                onDeleteMessage={handleDeleteMessage}
                onEditMessage={handleEditMessage}
                onReplyMessage={handleReplyMessage}
                onReactToMessage={handleReactToMessage}
              />
            </ScrollArea>
            <div className="flex-shrink-0 border-t border-border/30 bg-background/50 backdrop-blur-sm">
              <MessageInput
                onSendMessage={handleSendMessage}
                currentUser={user || { id: 0, name: "Guest", avatar: "",  isAdmin: false }}
                replyTo={replyTo || undefined}
                onCancelReply={handleCancelReply}
              />
            </div>
          </>
        ) : (
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
      </div>

      {showUserInfo && selectedUser && (
        <UserInfo user={selectedUser} onClose={handleCloseUserInfo} />
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
    </div>
  );
};
