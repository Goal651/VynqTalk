import { Message } from "@/types";
import { apiClient } from "../client";


// Get messages between two users
export const getMessages = async (senderId: number, receiverId: number) => {
    const response = await apiClient.get<Message[]>(`/messages/conv/${senderId}/${receiverId}`);
    return response.data;
};

// Update a message by ID
export const updateMessage = async (messageId: string, updatedContent: string) => {
    const response = await apiClient.put(`/${messageId}`, {
        content: updatedContent,
    });
    return response.data;
};

// Delete a message by ID
export const deleteMessage = async (messageId: string) => {
    await apiClient.delete(`/${messageId}`);
};
