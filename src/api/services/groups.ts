
import { Group } from '@/types';
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
  async getAllGroups(): Promise<ApiResponse<Group[]>> {
    return await apiClient.get<Group[]>(API_ENDPOINTS.GROUPS.LIST);
  }

  async getGroupById(id: string): Promise<ApiResponse<Group>> {
    return await apiClient.get<Group>(API_ENDPOINTS.GROUPS.BY_ID(id));
  }

  async createGroup(groupData: CreateGroupRequest): Promise<ApiResponse<Group>> {
    return await apiClient.post<Group>(API_ENDPOINTS.GROUPS.CREATE, groupData);
  }

  async updateGroup(id: string, updates: UpdateGroupRequest): Promise<ApiResponse<Group>> {
    return await apiClient.put<Group>(API_ENDPOINTS.GROUPS.UPDATE(id), updates);
  }

  async deleteGroup(id: string): Promise<ApiResponse<void>> {
    return await apiClient.delete<void>(API_ENDPOINTS.GROUPS.DELETE(id));
  }

  async joinGroup(groupId: string): Promise<ApiResponse<void>> {
    return await apiClient.post<void>(API_ENDPOINTS.GROUPS.JOIN, { groupId });
  }

  async leaveGroup(groupId: string): Promise<ApiResponse<void>> {
    return await apiClient.post<void>(API_ENDPOINTS.GROUPS.LEAVE, { groupId });
  }

  async getGroupMembers(id: string): Promise<ApiResponse<any[]>> {
    return await apiClient.get<any[]>(API_ENDPOINTS.GROUPS.MEMBERS(id));
  }

  async getGroupMessages(id: string): Promise<ApiResponse<any[]>> {
    return await apiClient.get<any[]>(API_ENDPOINTS.GROUPS.MESSAGES(id));
  }
}

export const groupService = new GroupService();
