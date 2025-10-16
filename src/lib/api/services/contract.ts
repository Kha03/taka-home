import { apiClient } from "../client";
import { ApiResponse } from "../types";
export class ContractService {
  private basePath = "/contracts";
  async getFileUrl(id: string): Promise<ApiResponse<{ fileUrl: string }>> {
    return apiClient.get<{ fileUrl: string }>(
      `${this.basePath}/${id}/file-url`
    );
  }
}
export const contractService = new ContractService();
