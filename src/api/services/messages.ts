
import { Message } from "@/types";
import { apiClient } from "../client";
import { API_ENDPOINTS } from "../constants";
import { ApiResponse } from "../types";

export interface SendMessageRequest {
  content: string;
  receiverId: string;
  senderId: string;
  type?: "text" | "image" | "audio" | "file";
  replyToId?: string;
}

export class MessageService {
  // Get messages between two users
  async getMessages(senderId: string, receiverId: string): Promise<ApiResponse<Message[]>> {
    return await apiClient.get<Message[]>(API_ENDPOINTS.MESSAGES.CONVERSATION(senderId, receiverId));
  }

  // Send a new message
  async sendMessage(messageData: SendMessageRequest): Promise<ApiResponse<Message>> {
    return await apiClient.post<Message>(API_ENDPOINTS.MESSAGES.SEND, messageData);
  }

  // Update a message by ID
  async updateMessage(messageId: number, updatedContent: string): Promise<ApiResponse<Message>> {
    return await apiClient.put<Message>(API_ENDPOINTS.MESSAGES.UPDATE(messageId), {
      content: updatedContent,
    });
  }

  // Delete a message by ID
  async deleteMessage(messageId: number): Promise<ApiResponse<void>> {
    return await apiClient.delete<void>(API_ENDPOINTS.MESSAGES.DELETE(messageId));
  }

  // Get message by ID
  async getMessageById(messageId: number): Promise<ApiResponse<Message>> {
    return await apiClient.get<Message>(API_ENDPOINTS.MESSAGES.BY_ID(messageId));
  }

  // React to a message
  async reactToMessage(messageId: number, emoji: string): Promise<ApiResponse<void>> {
    return await apiClient.post<void>(`${API_ENDPOINTS.MESSAGES.BY_ID(messageId)}/react`, { emoji });
  }

  // Remove reaction from a message
  async removeReaction(messageId: number, reactionId: string): Promise<ApiResponse<void>> {
    return await apiClient.delete<void>(`${API_ENDPOINTS.MESSAGES.BY_ID(messageId)}/reactions/${reactionId}`);
  }
}

export const messageService = new MessageService();

// Keep the old functions for backward compatibility
export const getMessages = messageService.getMessages.bind(messageService);
export const updateMessage = messageService.updateMessage.bind(messageService);
export const deleteMessage = messageService.deleteMessage.bind(messageService);
