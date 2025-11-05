/**
 * Statistics Service
 * Xử lý các API calls liên quan đến thống kê
 */

import { apiClient } from "../client";
import type {
  ApiResponse,
  LandlordStatistics,
  StatisticsOverview,
} from "../types";

export class StatisticsService {
  private basePath = "/statistics";

  /**
   * Lấy thống kê của landlord theo ID
   */
  async getLandlordStatistics(
    landlordId: string
  ): Promise<ApiResponse<LandlordStatistics>> {
    return await apiClient.get<LandlordStatistics>(
      `${this.basePath}/landlord/${landlordId}`
    );
  }

  /**
   * Lấy thống kê tổng quan của hệ thống
   */
  async getOverview(): Promise<ApiResponse<StatisticsOverview>> {
    return await apiClient.get<StatisticsOverview>(`${this.basePath}/overview`);
  }
}

// Export singleton instance
export const statisticsService = new StatisticsService();
