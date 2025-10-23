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

export interface ContractExtension {
  id: string;
  contractId: string;
  extensionMonths: number;
  newMonthlyRent: number | null;
  requestNote: string;
  responseNote: string | null;
  status:
    | "PENDING"
    | "LANDLORD_RESPONDED"
    | "AWAITING_SIGNATURES"
    | "LANDLORD_SIGNED"
    | "AWAITING_ESCROW"
    | "ESCROW_FUNDED_T"
    | "ESCROW_FUNDED_L"
    | "ACTIVE"
    | "REJECTED"
    | "CANCELLED";
  respondedAt: string;
  extensionContractFileUrl: string | null;
  landlordSignedAt: string | null;
  tenantSignedAt: string | null;
  transactionIdLandlordSign: string | null;
  transactionIdTenantSign: string | null;
  escrowDepositDueAt: string | null;
  tenantEscrowDepositFundedAt: string | null;
  landlordEscrowDepositFundedAt: string | null;
  activatedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
