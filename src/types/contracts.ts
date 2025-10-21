import { User } from "@/lib/api";

export interface ContractInvoice {
  id: number; // Số thứ tự hiển thị
  invoiceId: string; // UUID từ API để thanh toán
  month: string;
  dueDate: string;
  status: "PAID" | "PENDING" | "OVERDUE";
}

export interface ContractVM {
  id: string;
  bookingId: string;
  type: string;
  tenant: string;
  landlord: string;
  startDate: string;
  endDate: string;
  address: string;
  propertyCode: string;
  propertyType: string;
  category: string;
  price: number;
  deposit: number;
  status:
    | "active"
    | "expired"
    | "pending_signature"
    | "pending_landlord"
    | "awaiting_deposit"
    | "awaiting_landlord_deposit"
    | "ready_for_handover";
  contractCode?: string;
  contractId?: string;
  bookingStatus: string;
  contractStatus?: string; // Status của contract từ backend
  invoices: ContractInvoice[];
}
export interface ContractExtensionRequest {
  contractId: string;
  extensionMonths: number;
  requestNote: string;
}
// export interface ContractExtension {
//   id: string;
//   contractId: string;
//   contract: ContractVM;
// }
