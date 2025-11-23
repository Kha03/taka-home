/**
 * Favorite Service
 * Xử lý các API calls liên quan đến yêu thích (favorites)
 */

import { apiClient } from "../client";
import type { ApiResponse } from "../types";

// Types cho Favorite
export interface FavoriteProperty {
  id: string;
  user: {
    id: string;
  };
  property: {
    id: string;
  };
  createdAt: string;
}

export interface FavoriteRoomType {
  id: string;
  user: {
    id: string;
  };
  roomType: {
    id: string;
  };
  createdAt: string;
}

export type Favorite = FavoriteProperty | FavoriteRoomType;

export interface AddFavoritePropertyRequest {
  propertyId: string;
}

export interface AddFavoriteRoomTypeRequest {
  roomTypeId: string;
}

export class FavoriteService {
  private basePath = "/favorites";

  /**
   * Thêm property vào danh sách yêu thích (APARTMENT/HOUSING)
   */
  async addFavoriteProperty(
    propertyId: string
  ): Promise<ApiResponse<FavoriteProperty>> {
    return await apiClient.post<FavoriteProperty>(this.basePath, {
      propertyId,
    });
  }

  /**
   * Thêm roomType vào danh sách yêu thích (BOARDING)
   */
  async addFavoriteRoomType(
    roomTypeId: string
  ): Promise<ApiResponse<FavoriteRoomType>> {
    return await apiClient.post<FavoriteRoomType>(this.basePath, {
      roomTypeId,
    });
  }

  /**
   * Xóa khỏi danh sách yêu thích
   */
  async removeFavorite(favoriteId: string): Promise<ApiResponse<void>> {
    return await apiClient.delete<void>(`${this.basePath}/${favoriteId}`);
  }

  /**
   * Lấy danh sách yêu thích của user
   */
  async getFavorites(): Promise<ApiResponse<Favorite[]>> {
    return await apiClient.get<Favorite[]>(this.basePath);
  }
}

// Export singleton instance
export const favoriteService = new FavoriteService();
