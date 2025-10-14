/**
 * Property Service
 * Xử lý các API calls liên quan đến properties
 */

import { apiClient } from "../client";
import type {
  ApiResponse,
  FilterPropertyQuery,
  Property,
  PropertyCreateRequest,
} from "../types";

export class PropertyService {
  private basePath = "/properties";

  /**
   * Tạo property mới
   */
  async createProperty(
    data: PropertyCreateRequest
  ): Promise<ApiResponse<Property>> {
    return await apiClient.post<Property>(this.basePath, data);
  }

  /**
   * Lấy danh sách properties với phân trang và filter
   */
  async getProperties(
    params?: FilterPropertyQuery
  ): Promise<ApiResponse<Property[]>> {
    return await apiClient.get<Property[]>(
      `${this.basePath}/filter`,
      params as Record<string, unknown>
    );
  }

  /**
   * Lấy chi tiết một property theo ID
   */
  async getPropertyById(id: string): Promise<ApiResponse<Property>> {
    return await apiClient.get<Property>(`${this.basePath}/${id}`);
  }

  /**
   * Cập nhật property
   */
  async updateProperty(
    id: string,
    data: Partial<PropertyCreateRequest>
  ): Promise<ApiResponse<Property>> {
    return await apiClient.put<Property>(`${this.basePath}/${id}`, data);
  }

  /**
   * Xóa property
   */
  async deleteProperty(id: string): Promise<ApiResponse<void>> {
    return await apiClient.delete<void>(`${this.basePath}/${id}`);
  }

  /**
   * Lấy properties của user hiện tại
   */
  async getMyProperties(
    params?: Omit<FilterPropertyQuery, "ownerId">
  ): Promise<ApiResponse<Property[]>> {
    return await apiClient.get<Property[]>(
      `${this.basePath}/my-properties`,
      params as Record<string, unknown>
    );
  }

  /**
   * Thay đổi trạng thái visible của property
   */
  async toggleVisibility(
    id: string,
    isVisible: boolean
  ): Promise<ApiResponse<Property>> {
    return await apiClient.patch<Property>(
      `${this.basePath}/${id}/visibility`,
      {
        isVisible,
      }
    );
  }

  /**
   * Lấy properties theo location
   */
  async getPropertiesByLocation(
    province: string,
    ward?: string,
    params?: Omit<FilterPropertyQuery, "province" | "ward">
  ): Promise<ApiResponse<Property[]>> {
    const searchParams = {
      ...params,
      province,
      ...(ward && { ward }),
    };
    return await apiClient.get<Property[]>(
      this.basePath,
      searchParams as Record<string, unknown>
    );
  }

  /**
   * Search properties with text query
   */
  async searchProperties(
    query: string,
    params?: Omit<FilterPropertyQuery, "q">
  ): Promise<ApiResponse<Property[]>> {
    const searchParams = {
      ...params,
      q: query,
    };
    return await apiClient.get<Property[]>(
      this.basePath,
      searchParams as Record<string, unknown>
    );
  }
}

// Export singleton instance
export const propertyService = new PropertyService();
