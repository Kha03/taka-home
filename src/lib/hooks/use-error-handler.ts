/**
 * Error Handler Hook
 * Provides error translation functionality using i18n
 */

import { useTranslations } from "next-intl";
import {
  getErrorTranslationKey,
  extractErrorCode,
} from "@/lib/utils/error-translator";

export function useErrorHandler() {
  const t = useTranslations();

  /**
   * Translate error to user-friendly message
   * @param error - Error object from API or Error instance
   * @param fallbackMessage - Default message if translation not found
   * @returns Translated error message
   */
  const translateError = (error: unknown, fallbackMessage?: string): string => {
    // Extract error code from various error formats
    const errorCode = extractErrorCode(error);

    if (errorCode) {
      // Get translation key for error code
      const translationKey = getErrorTranslationKey(errorCode);

      if (translationKey) {
        try {
          // Return translated message
          return t(translationKey);
        } catch (e) {
          console.warn(`Translation key not found: ${translationKey}`);
        }
      }
    }

    // Return fallback message or generic error
    return fallbackMessage || t("errors.generic.INTERNAL_SERVER_ERROR");
  };

  return { translateError };
}
