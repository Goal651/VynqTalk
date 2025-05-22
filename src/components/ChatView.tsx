
import { useState } from "react";
import { User, Message } from "../types";
import { ChatSidebar } from "./ChatSidebar";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { mockMessages, mockUsers, currentUser } from "../data/mockData";
import { UserInfo } from "./UserInfo";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ChatViewProps {
  onMessageDelete?: (messageId: string) => void;
  onMessageEdit?: (message: Message) => void;
}

export const ChatView = ({ onMessageDelete, onMessageEdit }: ChatViewProps) => {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [users] = useState<User[]>(mockUsers);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);
  const [messageToEdit, setMessageToEdit] = useState<Message | null>(null);
  const [editedContent, setEditedContent] = useState("");

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: `m${Date.now()}`,
      userId: currentUser.id,
      content: content,
      timestamp: new Date(),
    };
    setMessages([...messages, newMessage]);
  };

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
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
          ? { ...message, content: editedContent } 
          : message
      ));
      setMessageToEdit(null);
    }
  };

  return (
    <div className="flex h-full">
      <ChatSidebar users={users} onUserClick={handleUserClick} />
      <div className="flex-1 flex flex-col h-full border-l border-r border-border/30">
        <div className="flex-1 overflow-y-auto">
          <MessageList 
            messages={messages} 
            users={users} 
            onUserAvatarClick={handleUserClick}
            onDeleteMessage={handleDeleteMessage}
            onEditMessage={handleEditMessage}
          />
        </div>
        <MessageInput onSendMessage={handleSendMessage} currentUser={currentUser} />
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
