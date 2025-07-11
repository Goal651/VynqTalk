import { Message, ApiResponse} from '@/types';
import { apiClient } from '@/api';
import { API_ENDPOINTS } from '@/api';
import type { AxiosProgressEvent, CancelToken } from 'axios';

export class MessageService {
  // Get messages between two users
  async getMessages(senderId: string, receiverId: string): Promise<ApiResponse<Message[]>> {
    return await apiClient.get<Message[]>(API_ENDPOINTS.MESSAGES.CONVERSATION(senderId, receiverId));
  }

  // Update a message by ID
  async updateMessage(messageId: number, newMessage: Message): Promise<ApiResponse<Message>> {
    return await apiClient.put<Message>(API_ENDPOINTS.MESSAGES.UPDATE(messageId), newMessage);
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

  // Upload a file for a message
  async uploadMessage(
    file: File,
    onUploadProgress?: (event: AxiosProgressEvent) => void,
    cancelToken?: CancelToken,
    timeout: number = 60000 
  ): Promise<ApiResponse<string>> {
    return await apiClient.uploadFile<string>(API_ENDPOINTS.MESSAGES.UPLOAD, file, onUploadProgress, cancelToken, timeout);
  }
}

export const messageService = new MessageService();