/**
 * Example Usage of Error Translation System
 * 
 * This file demonstrates how to use the error translation system
 * to display Vietnamese error messages from backend error codes.
 */

import { translateError, getErrorMessage } from "@/lib/constants/error-messages";
import { getApiErrorMessage } from "@/lib/utils/error-handler";

// ==================== EXAMPLE 1: Direct Error Code Translation ====================
export function example1_DirectErrorCode() {
  // Backend returns: { "message": "ACCOUNT_NOT_FOUND", "statusCode": 404 }
  const errorCode = "ACCOUNT_NOT_FOUND";
  
  const vietnameseMessage = getErrorMessage(errorCode);
  console.log(vietnameseMessage); // Output: "Không tìm thấy thông tin tài khoản"
  
  // With custom fallback
  const message = getErrorMessage("UNKNOWN_ERROR_CODE", "Lỗi không xác định");
  console.log(message); // Output: "Lỗi không xác định"
}

// ==================== EXAMPLE 2: API Error Translation ====================
export async function example2_APIError() {
  try {
    // Simulate API call that fails
    throw {
      message: "INVALID_CREDENTIALS",
      status: 401
    };
  } catch (error) {
    // Translate error to Vietnamese
    const errorMessage = translateError(error, "Đã có lỗi xảy ra");
    console.log(errorMessage); // Output: "Mật khẩu không đúng"
    
    // Display to user
    alert(errorMessage);
  }
}

// ==================== EXAMPLE 3: Using getApiErrorMessage Helper ====================
export async function example3_HelperFunction() {
  try {
    // Simulate API call
    const response = await fetch("/api/login");
    if (!response.ok) {
      const data = await response.json();
      throw data;
    }
  } catch (error) {
    // This will automatically translate the error
    const errorMessage = getApiErrorMessage(error, "Đăng nhập thất bại");
    console.log(errorMessage);
  }
}

// ==================== EXAMPLE 4: React Component Usage ====================
export function LoginComponent() {
  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (data.code !== 200) {
        // Backend error format: { "message": "ACCOUNT_NOT_FOUND", "statusCode": 404 }
        const errorMessage = translateError(
          data.message, 
          "Đăng nhập thất bại. Vui lòng thử lại."
        );
        
        // Show error to user
        alert(errorMessage);
        return;
      }
      
      // Success case
      console.log("Login successful!");
      
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = translateError(error, "Không thể kết nối đến server");
      alert(errorMessage);
    }
  };
  
  return null; // Your component JSX here
}

// ==================== EXAMPLE 5: Common Backend Error Codes ====================
export function example5_CommonErrorCodes() {
  const examples = [
    { code: "ACCOUNT_NOT_FOUND", expected: "Không tìm thấy thông tin tài khoản" },
    { code: "INVALID_CREDENTIALS", expected: "Mật khẩu không đúng" },
    { code: "EMAIL_ALREADY_REGISTERED", expected: "Email đã được đăng ký" },
    { code: "TOKEN_EXPIRED", expected: "Token đã hết hạn" },
    { code: "INSUFFICIENT_BALANCE", expected: "Số dư không đủ" },
    { code: "PROPERTY_NOT_FOUND", expected: "Không tìm thấy bất động sản" },
    { code: "CONTRACT_NOT_FOUND", expected: "Không tìm thấy hợp đồng" },
    { code: "BOOKING_ALREADY_HAS_CONTRACT", expected: "Đặt phòng đã có hợp đồng" },
  ];
  
  examples.forEach(({ code, expected }) => {
    const actual = getErrorMessage(code);
    console.log(`${code}: ${actual}`);
    console.assert(actual === expected, `Expected: ${expected}, Got: ${actual}`);
  });
}

// ==================== EXAMPLE 6: Error Handler Wrapper ====================
export async function example6_ErrorHandlerWrapper<T>(
  apiCall: () => Promise<T>,
  errorContext: string = "Thao tác"
): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    const data = await apiCall();
    return { success: true, data };
  } catch (error) {
    console.error(`${errorContext} error:`, error);
    const errorMessage = translateError(error, `${errorContext} thất bại`);
    return { success: false, error: errorMessage };
  }
}

// Usage of wrapper
export async function useErrorWrapper() {
  const result = await example6_ErrorHandlerWrapper(
    async () => {
      const response = await fetch("/api/data");
      return response.json();
    },
    "Tải dữ liệu"
  );
  
  if (!result.success) {
    console.error(result.error); // Will show Vietnamese error message
  } else {
    console.log(result.data);
  }
}

// ==================== EXAMPLE 7: Testing Error Responses ====================
export function example7_TestErrorResponses() {
  // Test case 1: Backend API error format
  const backendError = {
    message: "USER_NOT_FOUND",
    error: "Not Found",
    statusCode: 404
  };
  console.log("Backend error:", translateError(backendError));
  // Output: "Không tìm thấy người dùng"
  
  // Test case 2: JavaScript Error object
  const jsError = new Error("NETWORK_ERROR");
  console.log("JS error:", translateError(jsError));
  // Output: "Lỗi kết nối mạng"
  
  // Test case 3: String error
  const stringError = "INVALID_TOKEN";
  console.log("String error:", translateError(stringError));
  // Output: "Token không hợp lệ"
  
  // Test case 4: Unknown error code
  const unknownError = { message: "SOME_UNKNOWN_CODE" };
  console.log("Unknown error:", translateError(unknownError, "Lỗi không xác định"));
  // Output: "Lỗi không xác định"
}

// ==================== EXAMPLE 8: Integration with Toast Notifications ====================
export function example8_WithToastNotifications() {
  // Assuming you have a toast notification system
  const toast = {
    error: (message: string) => console.error("Toast:", message),
    success: (message: string) => console.log("Toast:", message)
  };
  
  async function handleSubmit() {
    try {
      // API call
      throw { message: "PROPERTY_HAS_ACTIVE_BOOKINGS", status: 400 };
    } catch (error) {
      const errorMessage = translateError(
        error, 
        "Không thể thực hiện thao tác này"
      );
      toast.error(errorMessage);
      // Will show: "Bất động sản có đặt phòng đang hoạt động"
    }
  }
  
  handleSubmit();
}
