"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { bookingService, type Booking } from "@/lib/api/services/booking";
import { contractService } from "@/lib/api/services/contract";
import { invoiceService, type Invoice } from "@/lib/api/services/invoice";
import {
  paymentService,
  PaymentPurpose,
  type CreatePaymentDto,
} from "@/lib/api/services/payment";
import { bookingToContract } from "@/lib/contracts/mappers";
import type { ContractVM } from "@/types/contracts";

export function useContracts() {
  const [contracts, setContracts] = useState<ContractVM[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>("TENANT");

  const refresh = useCallback(async () => {
    try {
      setLoading(true);

      const savedUser = localStorage.getItem("account_info");
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        const roles = userData.roles || [];
        setUserRole(roles[0] || "TENANT");
      }

      const response = await bookingService.getMyBookings();
      if (!response.data) return;

      const rawContracts = response.data
        .filter(
          (b: Booking) => b.contract !== null || b.status === "PENDING_LANDLORD"
        )
        .map(bookingToContract);

      // attach invoices when needed
      const withInvoices = await Promise.all(
        rawContracts.map(async (c) => {
          if (
            (c.bookingStatus === "DUAL_ESCROW_FUNDED" ||
              c.bookingStatus === "ACTIVE") &&
            c.contractId
          ) {
            try {
              const invoiceResp = await invoiceService.getInvoiceByContractId(
                c.contractId
              );
              if (invoiceResp.data?.length) {
                const mapped = invoiceResp.data.map(
                  (apiInvoice: Invoice, index: number) => ({
                    id: index + 1,
                    invoiceId: apiInvoice.id,
                    month: new Date(
                      apiInvoice.billingPeriod
                    ).toLocaleDateString("vi-VN", {
                      month: "2-digit",
                      year: "numeric",
                    }),
                    dueDate: new Date(apiInvoice.dueDate).toLocaleDateString(
                      "vi-VN"
                    ),
                    status: apiInvoice.status,
                  })
                );
                return { ...c, invoices: mapped };
              }
            } catch (e) {
              console.error(`Invoice fetch failed for ${c.contractId}:`, e);
            }
          }
          return c;
        })
      );

      setContracts(withInvoices as ContractVM[]);
    } catch (e) {
      console.error(e);
      toast.error("Không thể tải danh sách hợp đồng");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  // actions
  const viewContract = async (contractId: string) => {
    try {
      const response = await contractService.getFileUrl(contractId);
      if (response.data?.fileUrl) window.open(response.data.fileUrl, "_blank");
      else toast.error("Không tìm thấy file hợp đồng");
    } catch (e) {
      console.error(e);
      toast.error("Không thể mở file hợp đồng");
    }
  };

  const signContract = async (bookingId: string) => {
    try {
      await bookingService.signContract(bookingId);
      toast.success("Yêu cầu ký hợp đồng đã được thực hiện thành công");
      await refresh();
    } catch (e) {
      console.error(e);
      toast.error("Không thể ký hợp đồng. Vui lòng thử lại");
      throw e;
    }
  };

  const depositPayment = (contractId: string) => {
    const c = contracts.find((x) => x.contractId === contractId);
    if (!c) {
      toast.error("Không tìm thấy hợp đồng");
      return { amount: 0 };
    }
    return { amount: c.deposit };
  };

  const createDepositPayment = async (contractId: string, amount: number) => {
    try {
      const purpose =
        userRole === "TENANT"
          ? PaymentPurpose.TENANT_ESCROW_DEPOSIT
          : PaymentPurpose.LANDLORD_ESCROW_DEPOSIT;
      const paymentDto: CreatePaymentDto = {
        contractId,
        amount,
        method: "VNPAY",
        purpose,
      };
      const response = await paymentService.createPayment(paymentDto);
      if (response.data?.paymentUrl) {
        toast.success("Đang chuyển đến trang thanh toán...");
        window.location.href = response.data.paymentUrl;
      } else toast.error("Không thể tạo thanh toán");
    } catch (e) {
      console.error(e);
      toast.error("Không thể tạo thanh toán. Vui lòng thử lại");
    }
  };

  const viewInvoice = async (contractId: string) => {
    try {
      const response = await invoiceService.getInvoiceByContractId(contractId);
      return response.data || [];
    } catch (e) {
      console.error(e);
      toast.error("Không thể tải thông tin hóa đơn");
      return [];
    }
  };

  const payInvoice = async (invoiceId: string) => {
    try {
      toast.loading("Đang tạo thanh toán...");

      // Fetch invoice details to get contractId and amount
      const invoiceResponse = await invoiceService.getInvoiceById(invoiceId);

      if (!invoiceResponse.data) {
        toast.dismiss();
        toast.error("Không tìm thấy thông tin hóa đơn");
        return;
      }

      const invoice = invoiceResponse.data;

      // Create payment with FIRST_MONTH_RENT purpose
      const response = await paymentService.createPayment({
        contractId: invoice.contract.id,
        amount: invoice.totalAmount,
        method: "VNPAY",
        purpose: PaymentPurpose.FIRST_MONTH_RENT,
      });

      toast.dismiss();

      if (response.data?.paymentUrl) {
        toast.success("Đang chuyển đến trang thanh toán...");
        window.location.href = response.data.paymentUrl;
      } else {
        toast.error("Không thể tạo thanh toán");
      }
    } catch (e) {
      console.error(e);
      toast.dismiss();
      toast.error("Không thể tạo thanh toán. Vui lòng thử lại");
    }
  };

  const handover = async (bookingId: string) => {
    try {
      toast.loading("Đang xác nhận bàn giao...");
      await bookingService.handover(bookingId);
      toast.dismiss();
      toast.success("Bàn giao thành công! Hợp đồng đã được kích hoạt.");
      await refresh();
    } catch (e) {
      console.error(e);
      toast.dismiss();
      toast.error("Không thể xác nhận bàn giao. Vui lòng thử lại");
    }
  };

  return {
    contracts,
    loading,
    userRole,
    refresh,
    actions: {
      viewContract,
      signContract,
      depositPayment,
      createDepositPayment,
      viewInvoice,
      payInvoice,
      handover,
    },
  };
}
