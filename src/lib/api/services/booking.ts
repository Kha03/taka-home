/**
 * Booking API Service
 * Xử lý tất cả các API calls liên quan đến booking/rental requests
 */

import { apiClient } from "../client";
import type { ApiResponse } from "../types";

/**
 * API Request Types
 */

export interface CreateBookingDto {
  propertyId?: string; // Required cho apartment, optional cho boarding
  roomId?: string; // Required cho boarding, optional cho apartment
}

/**
 * API Response Types
 */

export interface BookingUser {
  id: string;
  email?: string;
  phone?: string;
  fullName?: string;
  avatarUrl?: string | null;
}

export interface BookingProperty {
  id: string;
  title: string;
  type: string;
  address: string;
  price: number;
  heroImage: string | null;
}

export interface BookingRoom {
  id: string;
  name: string;
  price: number;
  area: number;
}

export interface Booking {
  id: string;
  tenant: BookingUser;
  landlord: BookingUser;
  property: BookingProperty;
  room?: BookingRoom;
  status: "pending" | "approved" | "rejected" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

/**
 * Booking Service Class
 */
export class BookingService {
  /**
   * Tạo booking/yêu cầu thuê mới
   * POST /bookings
   */
  private basePath = "/bookings";
  async createBooking(data: CreateBookingDto): Promise<ApiResponse<Booking>> {
    return apiClient.post<Booking>(this.basePath, data);
  }

  /**
   * Lấy danh sách bookings của user hiện tại
   * GET /bookings/my-bookings
   */
  async getMyBookings(): Promise<ApiResponse<Booking[]>> {
    return apiClient.get<Booking[]>(`${this.basePath}/my-bookings`);
  }

  /**
   * Lấy chi tiết một booking
   * GET /bookings/:id
   */
  async getBookingById(id: string): Promise<ApiResponse<Booking>> {
    return apiClient.get<Booking>(`${this.basePath}/${id}`);
  }

  /**
   * Hủy booking
   * PATCH /bookings/:id/cancel
   */
  async cancelBooking(id: string): Promise<ApiResponse<Booking>> {
    return apiClient.patch<Booking>(`${this.basePath}/${id}/cancel`);
  }

  /**
   * Chủ nhà phê duyệt booking
   * PATCH /bookings/:id/approve
   */
  async approveBooking(id: string): Promise<ApiResponse<Booking>> {
    return apiClient.patch<Booking>(`${this.basePath}/${id}/approve`);
  }

  /**
   * Chủ nhà từ chối booking
   * PATCH /bookings/:id/reject
   */
  async rejectBooking(id: string): Promise<ApiResponse<Booking>> {
    return apiClient.patch<Booking>(`${this.basePath}/${id}/reject`);
  }
}

// Export singleton instance
export const bookingService = new BookingService();
