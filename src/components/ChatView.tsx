
import { useState } from "react";
import { User, Message } from "../types";
import { ChatSidebar } from "./ChatSidebar";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { mockMessages, mockUsers } from "../data/mockData";
import { UserInfo } from "./UserInfo";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { LineWave } from "./LineWave";

interface ChatViewProps {
  onMessageDelete?: (messageId: string) => void;
  onMessageEdit?: (message: Message) => void;
}

export const ChatView = ({ onMessageDelete, onMessageEdit }: ChatViewProps) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [users] = useState<User[]>(mockUsers);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);
  const [messageToEdit, setMessageToEdit] = useState<Message | null>(null);
  const [editedContent, setEditedContent] = useState("");
  const [activeChat, setActiveChat] = useState<User | null>(null);

  const handleSendMessage = (content: string) => {
    if (!user || !activeChat) return;
    
    const newMessage: Message = {
      id: `m${Date.now()}`,
      userId: user.id,
      content: content,
      timestamp: new Date(),
      chatWithUserId: activeChat.id,
    };
    setMessages([...messages, newMessage]);
  };

  const handleUserClick = (clickedUser: User) => {
    setActiveChat(clickedUser);
    setShowUserInfo(false);
  };

  const handleUserAvatarClick = (clickedUser: User) => {
    setSelectedUser(clickedUser);
    setShowUserInfo(true);
  };

  const handleCloseUserInfo = () => {
    setShowUserInfo(false);
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessageToDelete(messageId);
  };

  const confirmDeleteMessage = () => {
    if (messageToDelete) {
      setMessages(messages.filter(message => message.id !== messageToDelete));
      if (onMessageDelete) onMessageDelete(messageToDelete);
      setMessageToDelete(null);
    }
  };

  const handleEditMessage = (message: Message) => {
    setMessageToEdit(message);
    setEditedContent(message.content);
    if (onMessageEdit) onMessageEdit(message);
  };

  const confirmEditMessage = () => {
    if (messageToEdit) {
      setMessages(messages.map(message => 
        message.id === messageToEdit.id 
          ? { ...message, content: editedContent, isEdited: true } 
          : message
      ));
      setMessageToEdit(null);
    }
  };

  // Filter messages for the active chat
  const filteredMessages = activeChat 
    ? messages.filter(message => 
        (message.userId === user?.id && message.chatWithUserId === activeChat.id) ||
        (message.userId === activeChat.id && (!message.chatWithUserId || message.chatWithUserId === user?.id))
      )
    : [];

  return (
    <div className="flex h-full relative">
      <LineWave className="absolute inset-0 opacity-10" />
      <ChatSidebar 
        users={users} 
        onUserClick={handleUserClick}
        activeChat={activeChat}
      />
      <div className="flex-1 flex flex-col h-full border-l border-r border-border/30 bg-background/80 backdrop-blur-sm relative z-10">
        {activeChat ? (
          <>
            <div className="p-4 border-b border-border bg-card/50 backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-medium">{activeChat.name.substring(0, 2).toUpperCase()}</span>
                </div>
                <div>
                  <h2 className="font-semibold">{activeChat.name}</h2>
                  <p className="text-xs text-muted-foreground">
                    {activeChat.isOnline ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              <MessageList 
                messages={filteredMessages} 
                users={users} 
                onUserAvatarClick={handleUserAvatarClick}
                onDeleteMessage={handleDeleteMessage}
                onEditMessage={handleEditMessage}
              />
            </div>
            <MessageInput onSendMessage={handleSendMessage} currentUser={user || undefined} />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="h-12 w-12 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                <span className="text-muted-foreground">💬</span>
              </div>
              <h3 className="font-semibold mb-2">No conversation selected</h3>
              <p className="text-muted-foreground">Choose a user from the sidebar to start chatting</p>
            </div>
          </div>
        )}
      </div>
      
      {showUserInfo && selectedUser && (
        <UserInfo user={selectedUser} onClose={handleCloseUserInfo} />
      )}
      
      <AlertDialog open={messageToDelete !== null} onOpenChange={(open) => !open && setMessageToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete message</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this message? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteMessage} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <Dialog open={messageToEdit !== null} onOpenChange={(open) => !open && setMessageToEdit(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit message</DialogTitle>
          </DialogHeader>
          <Textarea 
            value={editedContent} 
            onChange={(e) => setEditedContent(e.target.value)}
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setMessageToEdit(null)}>
              Cancel
            </Button>
            <Button onClick={confirmEditMessage}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
