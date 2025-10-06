import { GroupMessage, ApiResponse} from '@/types';
import { apiClient } from '@/api';
import { API_ENDPOINTS } from '@/api';

export class GroupMessageService {
    // Get messages for a group
    async getMessages(groupId: number): Promise<ApiResponse<GroupMessage[]>> {
        return await apiClient.get<GroupMessage[]>(API_ENDPOINTS.GROUP_MESSAGES.ALL(groupId));
    }

    // Update a message by ID
    async updateMessage(messageId: number, updatedContent: string): Promise<ApiResponse<GroupMessage>> {
        return await apiClient.put<GroupMessage>(`${API_ENDPOINTS.GROUP_MESSAGES.UPDATE(messageId)}`, {
            content: updatedContent,
        });
    }

    // Delete a message by ID
    async deleteMessage(messageId: number): Promise<ApiResponse<void>> {
        return await apiClient.delete<void>(`${API_ENDPOINTS.GROUP_MESSAGES.DELETE(messageId)}`);
    }

    // Get message by ID
    async getMessageById( messageId: number): Promise<ApiResponse<GroupMessage>> {
        return await apiClient.get<GroupMessage>(`${API_ENDPOINTS.GROUP_MESSAGES.BY_ID(messageId)}`);
    }

    // React to a group message
    async reactToMessage(messageId: number, emoji: string): Promise<ApiResponse<void>> {
        return await apiClient.post<void>(API_ENDPOINTS.GROUP_MESSAGES.REACT(messageId), { emoji });
    }

    // Remove reaction from a group message
    async removeReaction(messageId: number, reactionId: string): Promise<ApiResponse<void>> {
        return await apiClient.delete<void>(`${API_ENDPOINTS.GROUP_MESSAGES.REMOVE_REACTION(messageId)}/${reactionId}`);
    }

}

export const groupMessageService = new GroupMessageService();
