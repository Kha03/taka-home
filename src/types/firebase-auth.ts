// Types for Firebase Phone Authentication

export interface PhoneAuthRequest {
  phoneNumber: string;
}

export interface VerifyOTPRequest {
  otp: string;
  newPassword: string;
}

export interface ResetPasswordRequest {
  idToken: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface FirebaseAuthError {
  code: string;
  message: string;
}
