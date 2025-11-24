/**
 * Error Message Translator Utility
 * Maps backend error codes to i18n translation keys
 */

/**
 * Map backend error codes to i18n keys
 */
const ERROR_CODE_MAP: Record<string, string> = {
  // Auth errors
  EMAIL_ALREADY_REGISTERED: "errors.auth.EMAIL_ALREADY_REGISTERED",
  ACCOUNT_NOT_FOUND: "errors.auth.ACCOUNT_NOT_FOUND",
  INVALID_CREDENTIALS: "errors.auth.INVALID_CREDENTIALS",
  GOOGLE_AUTH_FAILED: "errors.auth.GOOGLE_AUTH_FAILED",
  INVALID_TOKEN: "errors.auth.INVALID_TOKEN",
  TOKEN_EXPIRED: "errors.auth.TOKEN_EXPIRED",
  INVALID_PHONE_NUMBER: "errors.auth.INVALID_PHONE_NUMBER",
  ACCOUNT_NOT_ACTIVATED: "errors.auth.ACCOUNT_NOT_ACTIVATED",

  // User errors
  USER_NOT_FOUND: "errors.user.USER_NOT_FOUND",
  FILE_SIZE_TOO_LARGE: "errors.user.FILE_SIZE_TOO_LARGE",
  INVALID_FILE_TYPE: "errors.user.INVALID_FILE_TYPE",
  INVALID_IMAGE_TYPE: "errors.user.INVALID_IMAGE_TYPE",
  USER_NOT_VERIFIED_FOR_ACTION: "errors.user.USER_NOT_VERIFIED_FOR_ACTION",

  // Wallet errors
  INSUFFICIENT_BALANCE: "errors.wallet.INSUFFICIENT_BALANCE",
  WALLET_NOT_FOUND: "errors.wallet.WALLET_NOT_FOUND",
  AMOUNT_MUST_BE_POSITIVE: "errors.wallet.AMOUNT_MUST_BE_POSITIVE",

  // Property errors
  PROPERTY_NOT_FOUND: "errors.property.PROPERTY_NOT_FOUND",
  ROOM_NOT_FOUND: "errors.property.ROOM_NOT_FOUND",
  PROPERTY_NOT_OWNED_BY_USER: "errors.property.PROPERTY_NOT_OWNED_BY_USER",
  FORBIDDEN_NOT_OWNER: "errors.property.FORBIDDEN_NOT_OWNER",
  PROPERTY_HAS_ACTIVE_BOOKINGS: "errors.property.PROPERTY_HAS_ACTIVE_BOOKINGS",

  // Payment errors
  INVOICE_NOT_FOUND: "errors.payment.INVOICE_NOT_FOUND",
  PAYMENT_NOT_FOUND: "errors.payment.PAYMENT_NOT_FOUND",
  INVALID_PAYMENT_METHOD: "errors.payment.INVALID_PAYMENT_METHOD",
  WALLET_PAYMENT_FAILED: "errors.payment.WALLET_PAYMENT_FAILED",
  VNPAY_PAYMENT_FAILED: "errors.payment.VNPAY_PAYMENT_FAILED",

  // Contract errors
  CONTRACT_NOT_FOUND: "errors.contract.CONTRACT_NOT_FOUND",
  CONTRACT_NOT_OWNED_BY_USER: "errors.contract.CONTRACT_NOT_OWNED_BY_USER",
  CONTRACT_ALREADY_SIGNED: "errors.contract.CONTRACT_ALREADY_SIGNED",
  CONTRACT_NOT_ACTIVE: "errors.contract.CONTRACT_NOT_ACTIVE",
  CONTRACT_EXPIRED: "errors.contract.CONTRACT_EXPIRED",
  ONLY_TENANT_CAN_SIGN: "errors.contract.ONLY_TENANT_CAN_SIGN",
  ONLY_LANDLORD_CAN_SIGN: "errors.contract.ONLY_LANDLORD_CAN_SIGN",

  // Booking errors
  BOOKING_NOT_FOUND: "errors.booking.BOOKING_NOT_FOUND",
  BOOKING_NOT_OWNED_BY_USER: "errors.booking.BOOKING_NOT_OWNED_BY_USER",
  BOOKING_NOT_APPROVED: "errors.booking.BOOKING_NOT_APPROVED",
  BOOKING_ALREADY_HAS_CONTRACT: "errors.booking.BOOKING_ALREADY_HAS_CONTRACT",
  PROPERTY_ALREADY_BOOKED: "errors.booking.PROPERTY_ALREADY_BOOKED",
  ROOM_ALREADY_BOOKED: "errors.booking.ROOM_ALREADY_BOOKED",

  // Invoice errors
  INVALID_SERVICE_TYPE: "errors.invoice.INVALID_SERVICE_TYPE",
  SERVICE_LIST_EMPTY: "errors.invoice.SERVICE_LIST_EMPTY",
  NOT_AUTHORIZED_FOR_CONTRACT: "errors.invoice.NOT_AUTHORIZED_FOR_CONTRACT",

  // Chatroom errors
  CHATROOM_NOT_FOUND: "errors.chatroom.CHATROOM_NOT_FOUND",
  CANNOT_CHAT_WITH_SELF: "errors.chatroom.CANNOT_CHAT_WITH_SELF",

  // Generic errors
  INTERNAL_SERVER_ERROR: "errors.generic.INTERNAL_SERVER_ERROR",
  BAD_REQUEST: "errors.generic.BAD_REQUEST",
  UNAUTHORIZED: "errors.generic.UNAUTHORIZED",
  FORBIDDEN: "errors.generic.FORBIDDEN",
  NOT_FOUND: "errors.generic.NOT_FOUND",
  VALIDATION_ERROR: "errors.generic.VALIDATION_ERROR",

  // Report errors
  REPORTER_NO_RENTED_PROPERTY: "errors.report.REPORTER_NO_RENTED_PROPERTY",
  REPORT_ALREADY_EXISTS: "errors.report.REPORT_ALREADY_EXISTS",

  // Favorite errors
  FAVORITE_NOT_FOUND: "errors.favorite.FAVORITE_NOT_FOUND",
  JUST_ONE_OF_PROPERTY_ROOMTYPE_REQUIRED:
    "errors.favorite.JUST_ONE_OF_PROPERTY_ROOMTYPE_REQUIRED",
};

/**
 * Get i18n translation key for error code
 * @param errorCode - Backend error code (e.g., "USER_NOT_FOUND")
 * @returns Translation key (e.g., "errors.user.USER_NOT_FOUND")
 */
export function getErrorTranslationKey(errorCode: string): string | null {
  return ERROR_CODE_MAP[errorCode] || null;
}

/**
 * Extract error code from API response
 * @param error - Error object from API
 * @returns Error code or null
 */
export function extractErrorCode(error: unknown): string | null {
  if (!error) return null;

  // Handle different error formats
  if (typeof error === "string") return error;

  if (typeof error === "object") {
    const err = error as Record<string, unknown>;

    // Check common error properties
    if (typeof err.message === "string") return err.message;
    if (typeof err.code === "string") return err.code;
    if (typeof err.error === "string") return err.error;
  }

  return null;
}

/**
 * Check if error code has translation
 * @param errorCode - Backend error code
 * @returns True if translation exists
 */
export function hasErrorTranslation(errorCode: string): boolean {
  return errorCode in ERROR_CODE_MAP;
}
