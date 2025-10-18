import { apiClient } from "../client";
import type { ApiResponse } from "../types";

export interface InvoiceContract {
  id: string;
  contractCode: string;
  startDate: string;
  endDate: string;
  status: string;
  contractFileUrl: string;
  blockchainTxHash: string | null;
  smartContractAddress: string | null;
  transactionIdTenantSign: string | null;
  transactionIdLandlordSign: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceCode: string;
  contract: InvoiceContract;
  items: InvoiceItem[];
  payment: unknown | null;
  totalAmount: number;
  dueDate: string;
  status: "PENDING" | "PAID" | "OVERDUE";
  billingPeriod: string; // Định dạng YYYY-MM
  createdAt: string;
  updatedAt: string;
}

export class InvoiceService {
  private basePath = "/invoices";

  async getInvoiceByContractId(
    contractId: string
  ): Promise<ApiResponse<Invoice[]>> {
    return apiClient.get<Invoice[]>(`${this.basePath}/contract/${contractId}`);
  }
}
export const invoiceService = new InvoiceService();
