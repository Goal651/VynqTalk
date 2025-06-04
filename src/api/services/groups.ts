import { Group, User } from '@/types';
import { apiClient } from '../client';
import { API_ENDPOINTS } from '../constants';
import { ApiResponse } from '../types';

export interface CreateGroupRequest {
  name: string;
  description?: string;
  avatar?: string;
  isPrivate: boolean;
  members: string[];
}

export interface UpdateGroupRequest {
  name?: string;
  description?: string;
  avatar?: string;
  isPrivate?: boolean;
}

export class GroupService {
  async getGroups(): Promise<ApiResponse<Group[]>> {
    return await apiClient.get<Group[]>(API_ENDPOINTS.GROUPS.LIST);
  }

  async getGroup(id: number): Promise<ApiResponse<Group>> {
    return await apiClient.get<Group>(API_ENDPOINTS.GROUPS.BY_ID(id));

  }

  async createGroup(data: CreateGroupRequest): Promise<ApiResponse<Group>> {
    return await apiClient.post<Group>(API_ENDPOINTS.GROUPS.CREATE, data);

  }

  async updateGroup(id: number, data: UpdateGroupRequest): Promise<ApiResponse<Group>> {
    return await apiClient.put<Group>(API_ENDPOINTS.GROUPS.UPDATE(id), data);
  }

  async deleteGroup(id: number): Promise<ApiResponse<void>> {
    return await apiClient.delete<void>(API_ENDPOINTS.GROUPS.DELETE(id));
  }

  async addMember(groupId: number, user: User): Promise<ApiResponse<Group>> {
    return await apiClient.post<Group>(API_ENDPOINTS.GROUPS.MEMBERS(groupId), user );

  }

  async removeMember(groupId: number, userId: number): Promise<ApiResponse<Group>> {
    return await apiClient.delete<Group>(`${API_ENDPOINTS.GROUPS.MEMBERS(groupId)}/${userId}`);

  }

  async joinGroup(groupId: number): Promise<ApiResponse<void>> {
    return await apiClient.post<void>(API_ENDPOINTS.GROUPS.JOIN, { groupId });

  }

  async leaveGroup(groupId: number): Promise<ApiResponse<void>> {
    return await apiClient.post<void>(API_ENDPOINTS.GROUPS.LEAVE, { groupId });

  }

  async getGroupMembers(id: number): Promise<ApiResponse<Group['members']>> {
    return await apiClient.get<Group['members']>(API_ENDPOINTS.GROUPS.MEMBERS(id));
  }

}

export const groupService = new GroupService();
