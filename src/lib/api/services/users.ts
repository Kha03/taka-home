/**
 * Users API Service
 * Quản lý các API calls liên quan đến users (Admin)
 */

import { apiClient } from "../client";
import type { ApiResponse } from "../types";
import type { User } from "@/types/user";

export class UsersService {
  /**
   * Lấy danh sách users
   */
  async getUsers(): Promise<ApiResponse<User[]>> {
    return await apiClient.get<User[]>("/users");
  }

  /**
   * Lấy thông tin chi tiết user theo ID
   */
  async getUserById(userId: string): Promise<ApiResponse<User>> {
    return await apiClient.get<User>(`/users/${userId}`);
  }

  /**
   * Cập nhật thông tin user
   */
  async updateUser(
    userId: string,
    data: {
      email?: string;
      fullName?: string;
      phone?: string;
      CCCD?: string;
      status?: "ACTIVE" | "INACTIVE";
    }
  ): Promise<ApiResponse<User>> {
    return await apiClient.patch<User>(`/users/${userId}`, data);
  }

  /**
   * Xóa user
   */
  async deleteUser(userId: string): Promise<ApiResponse<void>> {
    return await apiClient.delete<void>(`/users/${userId}`);
  }

  /**
   * Upload avatar cho user
   */
  async uploadAvatar(
    file: File
  ): Promise<ApiResponse<{ user: { avatarUrl: string } }>> {
    const formData = new FormData();
    formData.append("avatar", file);

    return await apiClient.post<{ user: { avatarUrl: string } }>(
      "/users/upload-avatar",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  }
}

// Export singleton instance
export const usersService = new UsersService();
