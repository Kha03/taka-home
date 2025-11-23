/**
 * Favorite Service
 * Xử lý các API calls liên quan đến yêu thích (favorites)
 */

import { apiClient } from "../client";
import type { ApiResponse } from "../types";

// Types cho Favorite - Match với API response
export interface FavoriteItem {
  id: string;
  property: {
    id: string;
    title: string;
    description: string;
    type: string;
    province: string;
    ward: string;
    address: string;
    block: string | null;
    furnishing: string | null;
    legalDoc: string | null;
    price: number | null;
    deposit: number | null;
    electricityPricePerKwh: string | null;
    waterPricePerM3: string | null;
    area: number | null;
    bedrooms: number | null;
    bathrooms: number | null;
    mapLocation: string | null;
    isVisible: boolean;
    isApproved: boolean;
    heroImage: string | null;
    images: string[] | null;
    floor: number | null;
    unit: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
  roomType: {
    id: string;
    name: string;
    bedrooms: number;
    bathrooms: number;
    area: number;
    price: number;
    deposit: number;
    furnishing: string;
    images: string[];
    description: string;
    heroImage: string;
    createdAt: string;
    updatedAt: string;
  } | null;
  createdAt: string;
}

export interface FavoriteProperty {
  id: string;
  property: {
    id: string;
  };
  createdAt: string;
}

export interface FavoriteRoomType {
  id: string;
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
  async getFavorites(): Promise<ApiResponse<FavoriteItem[]>> {
    return await apiClient.get<FavoriteItem[]>(this.basePath);
  }

  /**
   * Kiểm tra xem property có trong danh sách yêu thích không
   */
  async isFavoriteProperty(propertyId: string): Promise<boolean> {
    try {
      const response = await this.getFavorites();
      if (response.code === 200 && response.data) {
        return response.data.some(
          (item) => item.property && item.property.id === propertyId
        );
      }
      return false;
    } catch (error) {
      console.error("Error checking favorite property:", error);
      return false;
    }
  }

  /**
   * Kiểm tra xem roomType có trong danh sách yêu thích không
   */
  async isFavoriteRoomType(roomTypeId: string): Promise<boolean> {
    try {
      const response = await this.getFavorites();
      if (response.code === 200 && response.data) {
        return response.data.some(
          (item) => item.roomType && item.roomType.id === roomTypeId
        );
      }
      return false;
    } catch (error) {
      console.error("Error checking favorite roomType:", error);
      return false;
    }
  }

  /**
   * Lấy favorite ID từ propertyId hoặc roomTypeId
   */
  async getFavoriteId(
    propertyId?: string,
    roomTypeId?: string
  ): Promise<string | null> {
    try {
      const response = await this.getFavorites();
      if (response.code === 200 && response.data) {
        const favorite = response.data.find((item) => {
          if (propertyId && item.property) {
            return item.property.id === propertyId;
          }
          if (roomTypeId && item.roomType) {
            return item.roomType.id === roomTypeId;
          }
          return false;
        });
        return favorite ? favorite.id : null;
      }
      return null;
    } catch (error) {
      console.error("Error getting favorite ID:", error);
      return null;
    }
  }
}

// Export singleton instance
export const favoriteService = new FavoriteService();
