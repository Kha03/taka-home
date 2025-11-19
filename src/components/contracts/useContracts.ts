"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  bookingService,
  type Booking,
  signingOption,
} from "@/lib/api/services/booking";
import { contractService } from "@/lib/api/services/contract";
import { invoiceService, type Invoice } from "@/lib/api/services/invoice";
import {
  paymentService,
  PaymentPurpose,
  type CreatePaymentDto,
} from "@/lib/api/services/payment";
import { bookingToContract } from "@/lib/contracts/mappers";
import type { ContractVM } from "@/types/contracts";
import { translateError } from "@/lib/constants/error-messages";

// Cache for invoice data with TTL
type InvoiceCacheEntry = { data: Invoice[]; timestamp: number };
const invoiceCache = new Map<string, InvoiceCacheEntry>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export function useContracts() {
  const [contracts, setContracts] = useState<ContractVM[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>("TENANT");

  // Optimized: Batch fetch invoices instead of individual calls
  const fetchInvoicesForContracts = useCallback(
    async (contractIds: string[]) => {
      if (contractIds.length === 0) return new Map();

      try {
        // Check cache first
        const cachedResults = new Map<string, Invoice[]>();
        const uncachedIds: string[] = [];
        const now = Date.now();

        contractIds.forEach((id) => {
          const cached = invoiceCache.get(id);
          if (cached && now - cached.timestamp < CACHE_TTL) {
            cachedResults.set(id, cached.data);
          } else {
            uncachedIds.push(id);
          }
        });

        // Batch fetch uncached invoices
        if (uncachedIds.length > 0) {
          const batchPromises = uncachedIds.map(async (contractId) => {
            try {
              const response = await invoiceService.getInvoiceByContractId(
                contractId
              );
              const invoices = response.data || [];

              // Cache the result
              invoiceCache.set(contractId, {
                data: invoices,
                timestamp: now,
              });

              return { contractId, invoices };
            } catch (error) {
              console.error(`Invoice fetch failed for ${contractId}:`, error);
              return { contractId, invoices: [] };
            }
          });

          const batchResults = await Promise.all(batchPromises);
          batchResults.forEach(({ contractId, invoices }) => {
            cachedResults.set(contractId, invoices);
          });
        }

        return cachedResults;
      } catch (error) {
        console.error("Batch invoice fetch failed:", error);
        return new Map();
      }
    },
    []
  );

  const refresh = useCallback(async () => {
    try {
      setLoading(true);

      // Get user role from localStorage (cached)
      const savedUser = localStorage.getItem("account_info");
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        const roles = userData.roles || [];
        setUserRole(roles[0] || "TENANT");
      }

      // Fetch bookings
      const response = await bookingService.getMyBookings();
      if (!response.data) return;

      // Transform bookings to contracts
      const rawContracts = response.data
        .filter(
          (b: Booking) => b.contract !== null || b.status === "PENDING_LANDLORD"
        )
        .map(bookingToContract);

      // Get contract IDs that need invoices
      const contractIdsNeedingInvoices = rawContracts
        .filter(
          (c) =>
            (c.bookingStatus === "DUAL_ESCROW_FUNDED" ||
              c.bookingStatus === "ACTIVE") &&
            c.contractId
        )
        .map((c) => c.contractId!)
        .filter(Boolean);

      // Batch fetch invoices
      const invoicesMap = await fetchInvoicesForContracts(
        contractIdsNeedingInvoices
      );

      // Attach invoices to contracts
      const withInvoices = rawContracts.map((c) => {
        if (c.contractId && invoicesMap.has(c.contractId)) {
          const invoices = invoicesMap.get(c.contractId)!;
          const mapped = invoices.map((apiInvoice: Invoice, index: number) => ({
            id: index + 1,
            invoiceId: apiInvoice.id,
            month: new Date(apiInvoice.billingPeriod).toLocaleDateString(
              "vi-VN",
              {
                month: "2-digit",
                year: "numeric",
              }
            ),
            dueDate: new Date(apiInvoice.dueDate).toLocaleDateString("vi-VN"),
            status: apiInvoice.status,
          }));
          return { ...c, invoices: mapped };
        }
        return c;
      });

      setContracts(withInvoices as ContractVM[]);
    } catch (e) {
      console.error(e);
      toast.error("Không thể tải danh sách hợp đồng");
    } finally {
      setLoading(false);
    }
  }, [fetchInvoicesForContracts]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  // Memoized actions
  const actions = useMemo(
    () => ({
      viewContract: async (contractId: string) => {
        try {
          const response = await contractService.getFileUrl(contractId);
          if (response.data?.fileUrl) {
            window.open(response.data.fileUrl, "_blank");
          } else {
            toast.error("Không tìm thấy file hợp đồng");
          }
        } catch (e) {
          console.error(e);
          toast.error("Không thể mở file hợp đồng");
        }
      },

      signContract: async (bookingId: string, method: signingOption) => {
        try {
          await bookingService.signContract(bookingId, method);
          toast.success("Yêu cầu ký hợp đồng đã được thực hiện thành công");
          await refresh();
        } catch (e) {
          console.error(e);
          toast.error("Không thể ký hợp đồng. Vui lòng thử lại");
          throw e;
        }
      },

      depositPayment: (contractId: string) => {
        const c = contracts.find((x) => x.contractId === contractId);
        if (!c) {
          toast.error("Không tìm thấy hợp đồng");
          return { amount: 0 };
        }
        return { amount: c.deposit };
      },

      createDepositPayment: async (
        contractId: string,
        amount: number,
        method: "VNPAY" | "WALLET"
      ) => {
        try {
          const purpose =
            userRole === "TENANT"
              ? PaymentPurpose.TENANT_ESCROW_DEPOSIT
              : PaymentPurpose.LANDLORD_ESCROW_DEPOSIT;

          const paymentDto: CreatePaymentDto = {
            contractId,
            amount,
            method,
            purpose,
          };

          const response = await paymentService.createPayment(paymentDto);

          // Nếu thanh toán bằng WALLET, response sẽ có status PAID và không có paymentUrl
          if (method === "WALLET") {
            if (response.data?.status === "PAID") {
              toast.success("Thanh toán thành công!");
              await refresh();
            } else {
              toast.error("Thanh toán thất bại. Vui lòng kiểm tra số dư ví");
            }
          } else {
            // Nếu thanh toán bằng VNPAY, chuyển hướng đến trang thanh toán
            if (response.data?.paymentUrl) {
              toast.success("Đang chuyển đến trang thanh toán...");
              window.location.href = response.data.paymentUrl;
            } else {
              toast.error("Không thể tạo thanh toán");
            }
          }
        } catch (e) {
          console.error(e);
          toast.error("Không thể tạo thanh toán. Vui lòng thử lại");
        }
      },

      // Optimized: Use cached data first, fallback to API
      viewInvoice: async (contractId: string) => {
        try {
          // Try cache first
          const cached = invoiceCache.get(contractId);
          const now = Date.now();

          if (cached && now - cached.timestamp < CACHE_TTL) {
            return cached.data;
          }

          // Fallback to API
          const response = await invoiceService.getInvoiceByContractId(
            contractId
          );
          const invoices = response.data || [];

          // Update cache
          invoiceCache.set(contractId, {
            data: invoices,
            timestamp: now,
          });

          return invoices;
        } catch (e) {
          console.error(e);
          toast.error("Không thể tải thông tin hóa đơn");
          return [];
        }
      },

      // Optimized: Use cached invoice data to avoid extra API call
      payInvoice: async (invoiceId: string, method: "VNPAY" | "WALLET") => {
        try {
          toast.loading("Đang tạo thanh toán...");

          // Find invoice in cached data first
          let foundInvoice: Invoice | null = null;
          for (const [, cacheEntry] of invoiceCache) {
            const invoice = cacheEntry.data.find((inv) => inv.id === invoiceId);
            if (invoice) {
              foundInvoice = invoice;
              break;
            }
          }

          // Fallback to API if not found in cache
          if (!foundInvoice) {
            const invoiceResponse = await invoiceService.getInvoiceById(
              invoiceId
            );
            foundInvoice = invoiceResponse.data || null;
          }

          if (!foundInvoice) {
            toast.dismiss();
            toast.error("Không tìm thấy thông tin hóa đơn");
            return;
          }

          // Create payment
          const response = await paymentService.createPaymentByInvoice(
            foundInvoice.id,
            method
          );

          toast.dismiss();

          // Nếu thanh toán bằng WALLET, response sẽ có status PAID và không có paymentUrl
          if (method === "WALLET") {
            if (response.data?.status === "PAID") {
              toast.success("Thanh toán thành công!");
              // Clear cache and refresh
              invoiceCache.clear();
              await refresh();
            } else {
              toast.error("Thanh toán thất bại. Vui lòng kiểm tra số dư ví");
            }
          } else {
            // Nếu thanh toán bằng VNPAY, chuyển hướng đến trang thanh toán
            if (response.data?.paymentUrl) {
              toast.success("Đang chuyển đến trang thanh toán...");
              window.location.href = response.data.paymentUrl;
            } else {
              toast.error("Không thể tạo thanh toán");
            }
          }
        } catch (e) {
          console.error(e);
          toast.dismiss();
          const errorMessage = translateError(
            e,
            "Kh\u00f4ng th\u1ec3 t\u1ea1o thanh to\u00e1n. Vui l\u00f2ng th\u1eed l\u1ea1i"
          );
          toast.error(errorMessage);
        }
      },

      handover: async (bookingId: string) => {
        try {
          toast.loading("Đang xác nhận bàn giao...");
          await bookingService.handover(bookingId);
          toast.dismiss();
          toast.success("Bàn giao thành công! Hợp đồng đã được kích hoạt.");

          // Clear cache to force refresh
          invoiceCache.clear();
          await refresh();
        } catch (e) {
          console.error(e);
          toast.dismiss();
          const errorMessage = translateError(
            e,
            "Kh\u00f4ng th\u1ec3 x\u00e1c nh\u1eadn b\u00e0n giao. Vui l\u00f2ng th\u1eed l\u1ea1i"
          );
          toast.error(errorMessage);
        }
      },
    }),
    [contracts, userRole, refresh]
  );

  // Clear cache on unmount
  useEffect(() => {
    return () => {
      invoiceCache.clear();
    };
  }, []);

  return {
    contracts,
    loading,
    userRole,
    refresh,
    actions,
  };
}
