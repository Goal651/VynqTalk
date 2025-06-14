
import { useState } from "react";
import { Message } from "@/types";
import { useToast } from "@/hooks/use-toast";

export const useMessageOperations = (
  messages: Message[],
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  onMessageDelete?: (messageId: number) => void,
  onMessageEdit?: (message: Message) => void
) => {
  const { toast } = useToast();
  const [messageToDelete, setMessageToDelete] = useState<number | null>(null);
  const [messageToEdit, setMessageToEdit] = useState<Message | null>(null);
  const [editedContent, setEditedContent] = useState("");

  const handleDeleteMessage = (messageId: number) => {
    console.log("Delete message requested:", messageId);
    setMessageToDelete(messageId);
  };

  const confirmDeleteMessage = () => {
    if (messageToDelete) {
      console.log("Confirming delete message:", messageToDelete);
      setMessages(messages.filter(message => message.id !== messageToDelete));
      if (onMessageDelete) onMessageDelete(messageToDelete);
      setMessageToDelete(null);

      toast({
        title: "Message deleted",
        description: "Message has been removed",
      });
    }
  };

  const handleEditMessage = (message: Message) => {
    console.log("Edit message requested:", message.id);
    setMessageToEdit(message);
    setEditedContent(message.content);

  };

  const confirmEditMessage = () => {
    if (messageToEdit) {
      console.log("Confirming edit message:", messageToEdit.id, "new content:", editedContent);
      setMessages(messages.map(message =>
        message.id === messageToEdit.id
          ? { ...message, content: editedContent, edited: true }
          : message
      ));
      if (onMessageEdit) onMessageEdit({...messageToEdit, content: editedContent, edited: true});
      setMessageToEdit(null);

      toast({
        title: "Message edited",
        description: "Message has been updated",
      });
    }
  };

  return {
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
  };
};
