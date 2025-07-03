import { GroupMessage, ApiResponse} from '@/types';
import { apiClient } from "../client";
import { API_ENDPOINTS } from "../constants";

export class GroupMessageService {
    // Get messages for a group
    async getMessages(groupId: number): Promise<ApiResponse<GroupMessage[]>> {
        return await apiClient.get<GroupMessage[]>(API_ENDPOINTS.GROUP_MESSAGES.ALL(groupId));
    }

    // Update a message by ID
    async updateMessage(groupId: number, messageId: number, updatedContent: string): Promise<ApiResponse<GroupMessage>> {
        return await apiClient.put<GroupMessage>(`${API_ENDPOINTS.GROUP_MESSAGES.UPDATE(messageId)}`, {
            content: updatedContent,
        });
    }

    // Delete a message by ID
    async deleteMessage(groupId: number, messageId: number): Promise<ApiResponse<void>> {
        return await apiClient.delete<void>(`${API_ENDPOINTS.GROUP_MESSAGES.DELETE(messageId)}`);
    }

    // Get message by ID
    async getMessageById(groupId: number, messageId: number): Promise<ApiResponse<GroupMessage>> {
        return await apiClient.get<GroupMessage>(`${API_ENDPOINTS.GROUP_MESSAGES.BY_ID(messageId)}`);
    }

    // React to a message
    async reactToMessage(groupId: number, messageId: number, emoji: string): Promise<ApiResponse<void>> {
        return await apiClient.post<void>(`${API_ENDPOINTS.GROUP_MESSAGES.REACT(messageId)}`, { emoji });
    }

    // Remove reaction from a message
    async removeReaction(groupId: number, messageId: number, reactionId: string): Promise<ApiResponse<void>> {
        return await apiClient.delete<void>(`${API_ENDPOINTS.GROUP_MESSAGES.REMOVE_REACTION(messageId)}/${reactionId}`);
    }
}

export const groupMessageService = new GroupMessageService();

// Keep the old functions for backward compatibility
export const getMessages = groupMessageService.getMessages.bind(groupMessageService);
export const updateMessage = groupMessageService.updateMessage.bind(groupMessageService);
export const deleteMessage = groupMessageService.deleteMessage.bind(groupMessageService);
