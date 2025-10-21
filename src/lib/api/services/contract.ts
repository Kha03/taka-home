import { ContractExtensionRequest } from "@/types/contracts";
import { apiClient } from "../client";
import { ApiResponse } from "../types";

export interface EscrowBalanceResponse {
  balanceTenant: string;
  balanceLandlord: string;
  accountId: string;
}
export class ContractService {
  private basePath = "/contracts";
  async getFileUrl(id: string): Promise<ApiResponse<{ fileUrl: string }>> {
    return apiClient.get<{ fileUrl: string }>(
      `${this.basePath}/${id}/file-url`
    );
  }
  async extendContractRequest(
    contractExtensionRequest: ContractExtensionRequest
  ): Promise<ApiResponse<void>> {
    return apiClient.post<void>(
      `${this.basePath}/extensions`,
      contractExtensionRequest
    );
  }
  async getEscrowByContractId(
    contractId: string
  ): Promise<ApiResponse<EscrowBalanceResponse>> {
    return apiClient.get<EscrowBalanceResponse>(`/escrow/balance`, {
      contractId,
    });
  }
}
export const contractService = new ContractService();
