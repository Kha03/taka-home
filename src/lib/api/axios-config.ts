/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Axios Configuration Utilities
 * Tạo và quản lý các Axios instances cho different APIs
 */

import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
/**
 * Common request interceptor
 */
export const requestInterceptor = (
  config: InternalAxiosRequestConfig & { params?: any }
) => {
  // Add timestamp để tránh cache
  if (config.method === "get") {
    config.params = { ...config.params, _t: Date.now() };
  }

  console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, {
    data: config.data,
    params: config.params,
  });

  return config;
};

/**
 * Common response interceptor
 */
export const responseInterceptor = (response: AxiosResponse) => {
  console.log(`✅ Response ${response.status}:`, {
    url: response.config.url,
    data: response.data,
  });
  return response;
};

/**
 * Common error interceptor
 */
export const errorInterceptor = (error: AxiosError) => {
  console.error(`❌ API Error:`, {
    url: error.config?.url,
    status: error.response?.status,
    data: error.response?.data,
    message: error.message,
  });
  return Promise.reject(error);
};

/**
 * Create Axios instance với common configuration
 */
export function createAxiosInstance(config: AxiosRequestConfig): AxiosInstance {
  const instance = axios.create({
    timeout: 30000,
    ...config,
  });

  // Add common interceptors
  instance.interceptors.request.use(requestInterceptor, errorInterceptor);
  instance.interceptors.response.use(responseInterceptor, errorInterceptor);

  return instance;
}

/**
 * Create instance cho main API (backend)
 */
export function createMainApiInstance(baseURL: string): AxiosInstance {
  const instance = createAxiosInstance({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Add auth interceptor cho main API
  instance.interceptors.request.use((config) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Handle 401 cho main API
  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("auth_token");
          localStorage.removeItem("user");
          window.location.href = "/signin";
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
}

/**
 * Create instance cho third-party APIs
 */
export function createThirdPartyApiInstance(baseURL: string): AxiosInstance {
  return createAxiosInstance({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

/**
 * Retry configuration cho network issues
 */
export function addRetryInterceptor(instance: AxiosInstance, retries = 3) {
  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const config = error.config as AxiosRequestConfig & {
        __retryCount?: number;
        __isRetryRequest?: boolean;
      };

      if (!config || config.__isRetryRequest) {
        return Promise.reject(error);
      }

      config.__retryCount = config.__retryCount || 0;

      if (config.__retryCount >= retries) {
        return Promise.reject(error);
      }

      config.__retryCount += 1;
      config.__isRetryRequest = true;

      console.log(
        `🔄 Retrying request (${config.__retryCount}/${retries}): ${config.url}`
      );

      // Exponential backoff
      const backoff = Math.pow(2, config.__retryCount) * 1000;
      await new Promise((resolve) => setTimeout(resolve, backoff));

      return instance(config);
    }
  );
}

/**
 * Add request/response logging
 */
export function addLoggingInterceptor(instance: AxiosInstance, prefix = "API") {
  instance.interceptors.request.use((config) => {
    console.log(`📤 ${prefix} Request:`, {
      method: config.method?.toUpperCase(),
      url: config.url,
      data: config.data,
      params: config.params,
    });
    return config;
  });

  instance.interceptors.response.use(
    (response) => {
      console.log(`📥 ${prefix} Response:`, {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
      return response;
    },
    (error: AxiosError) => {
      console.error(`🚫 ${prefix} Error:`, {
        status: error.response?.status,
        url: error.config?.url,
        message: error.message,
        data: error.response?.data,
      });
      return Promise.reject(error);
    }
  );
}
