import { User } from '@/types';
import { apiClient } from '../client';
import { API_ENDPOINTS } from '../constants';
import { ApiResponse} from '../types';

export class UserService {
    async getAllUsers(): Promise<ApiResponse<User[]>> {
        return await apiClient.get<User[]>(API_ENDPOINTS.USERS.ALL);
    }

    async getUserById(id: number): Promise<ApiResponse<User>> {
        return await apiClient.get<User>(API_ENDPOINTS.USERS.BY_ID(id));
    }

    
}

export const userService = new UserService();
