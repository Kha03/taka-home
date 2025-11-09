/**
 * Auth API Service
 * Quản lý các API calls liên quan đến xác thực và người dùng
 */

import { apiClient } from "../client";
import type {
  ApiResponse,
  Account,
  User,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  RegisterResponse,
} from "../types";

export class AuthService {
  /**
   * Đăng nhập
   */
  async login(data: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post<AuthResponse>("/auth/login", data);

    // Tự động set token vào client nếu login thành công
    if (response.code === 200 && response.data?.accessToken) {
      apiClient.setAuthToken(response.data.accessToken);
      
      // Lưu token vào localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem(
          "account_info",
          JSON.stringify(response.data.account)
        );

        // Lưu refreshToken vào localStorage
        if (response.data.refreshToken) {
          localStorage.setItem("refreshToken", response.data.refreshToken);
        }
      }
    }

    return response;
  }

  /**
   * Đăng ký
   */
  async register(
    data: RegisterRequest
  ): Promise<ApiResponse<RegisterResponse>> {
    const response = await apiClient.post<RegisterResponse>(
      "/auth/register",
      data
    );
    return response;
  }

  /**
   * Đăng xuất
   */
  async logout(): Promise<ApiResponse<void>> {
    try {
      // Gọi API logout trước (kèm accessToken trong header)
      const response = await apiClient.post<void>("/auth/logout");

      // Xóa token khỏi client và localStorage
      apiClient.removeAuthToken();
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("account_info");
      }

      return response;
    } catch (error) {
      // Vẫn xóa token local dù API call fail
      apiClient.removeAuthToken();
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("account_info");
      }
      throw error;
    }
  }

  /**
   * Lấy thông tin account hiện tại
   */
  async getCurrentUser(): Promise<ApiResponse<Account>> {
    return apiClient.get<Account>("/auth/me");
  }

  /**
   * Cập nhật thông tin user
   */
  async updateProfile(
    data: Partial<Pick<User, "fullName" | "avatarUrl">>
  ): Promise<ApiResponse<User>> {
    return apiClient.put<User>("/auth/profile", data);
  }

  /**
   * Đổi mật khẩu
   */
  async changePassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<ApiResponse<void>> {
    return apiClient.post<void>("/auth/change-password", data);
  }

  /**
   * Gửi email reset mật khẩu
   */
  async forgotPassword(email: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>("/auth/forgot-password", { email });
  }

  /**
   * Reset mật khẩu với token (Email recovery)
   */
  async resetPasswordWithEmail(data: {
    token: string;
    newPassword: string;
  }): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<{ message: string }>("/auth/reset-password-email", data);
  }

  /**
   * Reset mật khẩu với Firebase idToken (Phone Authentication)
   */
  async resetPasswordWithPhone(data: {
    idToken: string;
    newPassword: string;
  }): Promise<ApiResponse<void>> {
    return apiClient.post<void>("/auth/reset-password", data);
  }

  /**
   * Refresh token
   */
  async refreshToken(
    refreshToken?: string
  ): Promise<ApiResponse<AuthResponse>> {
    const token =
      refreshToken ||
      (typeof window !== "undefined"
        ? localStorage.getItem("refreshToken")
        : null);

    if (!token) {
      throw new Error("No refresh token available");
    }

    const response = await apiClient.post<AuthResponse>("/auth/refresh", {
      refreshToken: token,
    });

    // Cập nhật cả accessToken và refreshToken mới vào localStorage
    if (response.code === 200 && response.data?.accessToken) {
      apiClient.setAuthToken(response.data.accessToken);
      
      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem(
          "account_info",
          JSON.stringify(response.data.account)
        );

        // Cập nhật refreshToken nếu có
        if (response.data.refreshToken) {
          localStorage.setItem("refreshToken", response.data.refreshToken);
        }
      }
    }

    return response;
  }

  /**
   * Xác thực email
   */
  async verifyEmail(token: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>("/auth/verify-email", { token });
  }

  /**
   * Gửi lại email xác thực
   */
  async resendVerificationEmail(): Promise<ApiResponse<void>> {
    return apiClient.post<void>("/auth/resend-verification");
  }

  /**
   * Upload ảnh CCCD để xác thực tài khoản
   */
  async recognizeCCCD(imageFile: File): Promise<ApiResponse<{
    id: string;           // Số CCCD
    name: string;         // Họ và tên
    dob: string;          // Date of birth - Ngày sinh
    sex: string;          // Giới tính
    home: string;         // Quê quán
    address: string;      // Địa chỉ thường trú
    doe: string;          // Date of expiry - Ngày hết hạn
    poi: string;          // Place of issue - Nơi cấp
  }>> {
    const formData = new FormData();
    formData.append("image", imageFile);

    return apiClient.post<{
      id: string;
      name: string;
      dob: string;
      sex: string;
      home: string;
      address: string;
      doe: string;
      poi: string;
    }>("/users/recognize-cccd", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  /**
   * Khởi tạo token từ localStorage (khi reload trang)
   */
  initializeAuth(): void {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token) {
        apiClient.setAuthToken(token);
      }
    }
  }

  /**
   * Kiểm tra xem user có đang đăng nhập không
   */
  isAuthenticated(): boolean {
    if (typeof window !== "undefined") {
      return !!localStorage.getItem("accessToken");
    }
    return false;
  }
}

// Create singleton instance
export const authService = new AuthService();
