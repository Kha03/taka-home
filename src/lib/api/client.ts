/**
 * Base API Client cho Taka Home với Axios
 * Cung cấp các phương thức HTTP với interceptors và error handling mạnh mẽ
 */

import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  AxiosRequestConfig,
} from "axios";
import { API_CONFIG } from "./config";
import type { ApiResponse } from "./types";

export interface ApiError {
  message: string;
  status: number;
  code?: string;
  data?: unknown;
}

class ApiClient {
  private axiosInstance: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (reason?: unknown) => void;
  }> = [];

  constructor(baseURL: string = API_CONFIG.BASE_URL) {
    this.axiosInstance = axios.create({
      baseURL,
      timeout: 30000, // 30 seconds
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private processQueue(error: unknown, token: string | null = null) {
    this.failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });

    this.failedQueue = [];
  }

  /**
   * Setup interceptors cho request/response handling
   */
  private setupInterceptors() {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Add accessToken  nếu có
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("accessToken")
            : null;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // If sending FormData, remove Content-Type header
        // Let browser set it automatically with boundary
        if (config.data instanceof FormData) {
          delete config.headers["Content-Type"];
        }

        console.log(
          `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`,
          {
            data: config.data instanceof FormData ? "FormData" : config.data,
            params: config.params,
          }
        );

        return config;
      },
      (error) => {
        console.error("❌ Request Error:", error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log(`✅ API Response: ${response.status}`, response.data);
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & {
          _retry?: boolean;
        };

        console.error(
          `❌ API Error: ${error.response?.status}`,
          error.response?.data
        );

        // Handle 401 Unauthorized - Phân biệt token expired vs no permission
        if (error.response?.status === 401 && !originalRequest._retry) {
          const errorData = error.response.data as {
            message?: string;
            error?: string;
            statusCode?: number;
          };

          // Kiểm tra xem có phải lỗi token expired không
          const isTokenExpired = errorData?.message === "Token expired";

          // Nếu không phải token expired, báo lỗi ngay (no permission)
          if (!isTokenExpired) {
            console.error("❌ Access Denied - Unauthorized");
            return Promise.reject(error);
          }

          // Nếu là token expired, thực hiện refresh token
          if (this.isRefreshing) {
            // Nếu đang refresh, đợi refresh xong rồi retry
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            })
              .then((token) => {
                if (originalRequest.headers) {
                  originalRequest.headers.Authorization = `Bearer ${token}`;
                }
                return this.axiosInstance(originalRequest);
              })
              .catch((err) => {
                return Promise.reject(err);
              });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const refreshToken =
              typeof window !== "undefined"
                ? localStorage.getItem("refreshToken")
                : null;

            if (!refreshToken) {
              throw new Error("No refresh token available");
            }

            // Gọi API refresh token
            const response = await this.axiosInstance.post<{
              code: number;
              data: {
                accessToken: string;
                refreshToken: string;
                account: {
                  id: string;
                  email: string;
                  roles: string[];
                  isVerified: boolean;
                  user: {
                    id: string;
                    fullName: string;
                    avatarUrl?: string;
                    status: string;
                    CCCD?: string;
                    phone?: string;
                  };
                  createdAt: string;
                  updatedAt: string;
                };
              };
            }>("/auth/refresh", {
              refreshToken,
            });

            if (response.data.code === 200 && response.data.data?.accessToken) {
              const {
                accessToken,
                refreshToken: newRefreshToken,
                account,
              } = response.data.data;

              // Lưu token mới vào localStorage
              if (typeof window !== "undefined") {
                localStorage.setItem("accessToken", accessToken);
                if (newRefreshToken) {
                  localStorage.setItem("refreshToken", newRefreshToken);
                }
                
                // Lưu account_info nếu có từ response
                if (account) {
                  localStorage.setItem("account_info", JSON.stringify(account));
                } else {
                  // Nếu không có account trong response, giữ nguyên account_info cũ
                  // Không xóa để tránh mất dữ liệu user
                  console.warn("Refresh token response không có account info, giữ nguyên account_info cũ");
                }

                // Dispatch custom event để sync cookies
                window.dispatchEvent(
                  new CustomEvent("auth-token-updated", {
                    detail: { accessToken, refreshToken: newRefreshToken },
                  })
                );
              }

              // Cập nhật token trong axios instance
              this.setAuthToken(accessToken);

              // Process queue
              this.processQueue(null, accessToken);

              // Retry request ban đầu với token mới
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              }
              return this.axiosInstance(originalRequest);
            }
          } catch (refreshError) {
            this.processQueue(refreshError, null);

            // Refresh token hết hạn, chuyển về trang login
            if (typeof window !== "undefined") {
              localStorage.removeItem("accessToken");
              localStorage.removeItem("refreshToken");
              localStorage.removeItem("user");
              window.location.href = "/signin";
            }

            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  /**
   * Set authorization token
   */
  setAuthToken(token: string) {
    this.axiosInstance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${token}`;
  }

  /**
   * Remove authorization token
   */
  removeAuthToken() {
    delete this.axiosInstance.defaults.headers.common["Authorization"];
  }

  /**
   * Transform Axios response thành ApiResponse format
   */
  private transformResponse<T>(response: AxiosResponse): ApiResponse<T> {
    const data = response.data;

    // Nếu response đã theo format ApiResponse
    if (typeof data.code === "number" && typeof data.message === "string") {
      return data as ApiResponse<T>;
    }

    // Nếu không, wrap response
    return {
      code: response.status,
      message: response.statusText || "Success",
      data: data,
    };
  }

  /**
   * Handle Axios errors
   */
  private handleError(error: AxiosError): never {
    if (error.response) {
      // Server trả về error response
      const data = error.response.data as Record<string, unknown>;

      const apiError: ApiError = {
        message: (data?.message as string) || error.message || "Có lỗi xảy ra",
        status: error.response.status,
        code:
          (data?.code as number)?.toString() ||
          error.response.status.toString(),
        data: data,
      };

      throw apiError;
    } else if (error.request) {
      // Request được gửi nhưng không nhận được response
      throw {
        message: "Không thể kết nối đến server",
        status: 0,
        code: "NETWORK_ERROR",
      } as ApiError;
    } else {
      // Lỗi khác
      throw {
        message: error.message || "Có lỗi xảy ra",
        status: 0,
        code: "UNKNOWN_ERROR",
      } as ApiError;
    }
  }

  /**
   * GET request
   */
  async get<T>(
    path: string,
    params?: Record<string, unknown>,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.get<T>(path, {
        params,
        ...config,
      });
      return this.transformResponse<T>(response);
    } catch (error) {
      return this.handleError(error as AxiosError);
    }
  }

  /**
   * POST request
   */
  async post<T>(
    path: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.post<T>(path, data, config);
      return this.transformResponse<T>(response);
    } catch (error) {
      return this.handleError(error as AxiosError);
    }
  }

  /**
   * PUT request
   */
  async put<T>(
    path: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.put<T>(path, data, config);
      return this.transformResponse<T>(response);
    } catch (error) {
      return this.handleError(error as AxiosError);
    }
  }

  /**
   * PATCH request
   */
  async patch<T>(
    path: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.patch<T>(path, data, config);
      return this.transformResponse<T>(response);
    } catch (error) {
      return this.handleError(error as AxiosError);
    }
  }

  /**
   * DELETE request
   */
  async delete<T>(
    path: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.delete<T>(path, config);
      return this.transformResponse<T>(response);
    } catch (error) {
      return this.handleError(error as AxiosError);
    }
  }

  /**
   * Upload file với FormData
   */
  async upload<T>(
    path: string,
    formData: FormData,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.post<T>(path, formData, {
        ...config,
        headers: {
          "Content-Type": "multipart/form-data",
          ...config?.headers,
        },
      });
      return this.transformResponse<T>(response);
    } catch (error) {
      return this.handleError(error as AxiosError);
    }
  }

  /**
   * Request với custom config
   */
  async request<T>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.request<T>(config);
      return this.transformResponse<T>(response);
    } catch (error) {
      return this.handleError(error as AxiosError);
    }
  }

  /**
   * Get Axios instance để sử dụng trực tiếp nếu cần
   */
  getInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}

// Create singleton instance
export const apiClient = new ApiClient();

// Export class để tạo instance riêng nếu cần
export { ApiClient };
