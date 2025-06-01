
import { useState } from "react";
import { Message } from "@/types";

export const useMessageOperations = (
  messages: Message[],
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  onMessageDelete?: (messageId: string) => void,
  onMessageEdit?: (message: Message) => void
) => {
  const [messageToDelete, setMessageToDelete] = useState<Message | null>(null);
  const [messageToEdit, setMessageToEdit] = useState<Message | null>(null);
  const [editedContent, setEditedContent] = useState("");

  const handleDeleteMessage = (message: Message) => {
    console.log("Delete message requested:", message.id);
    setMessageToDelete(message);
  };

  const confirmDeleteMessage = () => {
    if (messageToDelete) {
      console.log("Confirming delete for message:", messageToDelete.id);
      setMessages((prev) =>
        prev.filter((msg) => msg.id !== messageToDelete.id)
      );
      if (onMessageDelete) {
        onMessageDelete(messageToDelete.id);
      }
      setMessageToDelete(null);
    }
  };

  const handleEditMessage = (message: Message) => {
    console.log("Edit message requested:", message.id);
    setMessageToEdit(message);
    setEditedContent(message.content);
  };

  const confirmEditMessage = () => {
    if (messageToEdit && editedContent.trim()) {
      console.log("Confirming edit for message:", messageToEdit.id);
      const updatedMessage = {
        ...messageToEdit,
        content: editedContent.trim(),
        edited: true,
      };

      setMessages((prev) =>
        prev.map((msg) => (msg.id === messageToEdit.id ? updatedMessage : msg))
      );

      if (onMessageEdit) {
        onMessageEdit(updatedMessage);
      }

      setMessageToEdit(null);
      setEditedContent("");
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
    confirmEditMessage,
  };
};
