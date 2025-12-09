/**
 * SmartCA Service
 * Xử lý các API calls liên quan đến chữ ký số và SmartCA
 */

import { apiClient } from "../client";
import type { ApiResponse } from "../types";

/**
 * Thông tin người ký
 */
export interface SignerInfo {
  commonName: string;
  serialNumber: string;
  issuedBy: string;
  validFrom: string;
  validTo: string;
}

/**
 * Thông tin chữ ký
 */
export interface SignatureInfo {
  byteRange: number[];
  contentDigest: string;
}

/**
 * Kết quả xác minh chữ ký
 */
export interface VerifySignatureResult {
  isValid: boolean;
  signerInfo: SignerInfo;
  signatureInfo: SignatureInfo;
}

/**
 * Response từ API verify signature
 */
export interface VerifySignatureResponse {
  success: boolean;
  message: string;
  data?: VerifySignatureResult;
  error?: string;
}

export class SmartCAService {
  private basePath = "/smartca";

  /**
   * Xác minh chữ ký số SELF_CA trong file PDF
   * @param pdfFile - File PDF cần kiểm tra
   * @param signatureIndex - Chỉ số chữ ký (0: chữ ký đầu tiên, 1: chữ ký thứ hai)
   * @returns Promise<ApiResponse<VerifySignatureResult>>
   */
  async verifySelfCASignature(
    pdfFile: File,
    signatureIndex: number = 0
  ): Promise<ApiResponse<VerifySignatureResult>> {
    const formData = new FormData();
    formData.append("pdf", pdfFile);
    formData.append("signatureIndex", signatureIndex.toString());

    return await apiClient.post<VerifySignatureResult>(
      `${this.basePath}/verify-self-ca-signature`,
      formData
    );
  }
}

// Export singleton instance
export const smartcaService = new SmartCAService();
