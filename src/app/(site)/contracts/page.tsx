"use client";

import { useState, useMemo, useEffect } from "react";
import ContractFilter from "@/components/contracts/contract-filter";
import StatusTab from "@/components/ui/status-tab";
import ContractCard from "@/components/contracts/contract-card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { bookingService, type Booking } from "@/lib/api/services/booking";
import { contractService } from "@/lib/api/services/contract";
import {
  paymentService,
  PaymentPurpose,
  type CreatePaymentDto,
} from "@/lib/api/services/payment";
import { invoiceService, type Invoice } from "@/lib/api/services/invoice";
import { PaymentModal } from "@/components/payment/payment-modal";
import InvoiceDetailDialog from "@/components/contracts/invoice-detail-dialog";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

interface Contract {
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
  deposit: number; // Số tiền đặt cọc
  status:
    | "active"
    | "expired"
    | "pending_signature"
    | "pending_landlord"
    | "awaiting_deposit"
    | "awaiting_landlord_deposit"
    | "ready_for_handover"; // Tenant đã đặt cọc, chờ landlord
  contractCode?: string;
  contractId?: string;
  bookingStatus: string;
  contractStatus?: string; // Status của contract từ backend
  invoices: ContractInvoice[];
}

interface ContractInvoice {
  id: number; // Số thứ tự hiển thị
  invoiceId: string; // UUID từ API để thanh toán
  month: string;
  dueDate: string;
  status: "paid" | "pending" | "overdue";
}

export default function ContractsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>("TENANT");

  // Payment modal states
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedContractId, setSelectedContractId] = useState<string | null>(
    null
  );
  const [paymentAmount, setPaymentAmount] = useState<number>(0);

  // Invoice modal states
  const [showInvoiceDialog, setShowInvoiceDialog] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [selectedInvoices, setSelectedInvoices] = useState<Invoice[]>([]);
  const [loadingInvoice, setLoadingInvoice] = useState(false);

  const PAGE_SIZE = 4;

  // Fetch bookings when component mounts
  useEffect(() => {
    const fetchContracts = async () => {
      try {
        setLoading(true);

        // Get user role from localStorage
        const savedUser = localStorage.getItem("account_info");
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          console.log("🔍 userData:", userData);
          // roles is an array, get the first role
          const roles = userData.roles || [];
          console.log("🔍 roles array:", roles);
          const finalRole = roles[0] || "TENANT";
          console.log("🔍 Final userRole:", finalRole);
          setUserRole(finalRole);
        }

        // Fetch all bookings
        const response = await bookingService.getMyBookings();

        if (response.data) {
          setBookings(response.data);

          // Convert bookings to contracts
          // Chỉ PENDING_LANDLORD là chưa có contract, các status khác đều có contract
          const contractsData = response.data
            .filter((booking) => {
              // Giữ tất cả bookings có contract HOẶC đang chờ duyệt
              return (
                booking.contract !== null ||
                booking.status === "PENDING_LANDLORD"
              );
            })
            .map((booking) => bookingToContract(booking));

          // Fetch invoices for DUAL_ESCROW_FUNDED and ACTIVE contracts
          const contractsWithInvoices = await Promise.all(
            contractsData.map(async (contract) => {
              if (
                (contract.bookingStatus === "DUAL_ESCROW_FUNDED" ||
                  contract.bookingStatus === "ACTIVE") &&
                contract.contractId
              ) {
                try {
                  const invoiceResponse =
                    await invoiceService.getInvoiceByContractId(
                      contract.contractId
                    );
                  if (invoiceResponse.data && invoiceResponse.data.length > 0) {
                    // Map API invoices to contract invoice format
                    const mappedInvoices = invoiceResponse.data.map(
                      (apiInvoice, index) => ({
                        id: index + 1, // Số thứ tự hiển thị
                        invoiceId: apiInvoice.id, // UUID từ API
                        month: new Date(
                          apiInvoice.billingPeriod
                        ).toLocaleDateString("vi-VN", {
                          month: "2-digit",
                          year: "numeric",
                        }),
                        dueDate: new Date(
                          apiInvoice.dueDate
                        ).toLocaleDateString("vi-VN"),
                        status:
                          apiInvoice.status === "PAID"
                            ? ("paid" as const)
                            : apiInvoice.status === "OVERDUE"
                            ? ("overdue" as const)
                            : ("pending" as const),
                      })
                    );
                    return { ...contract, invoices: mappedInvoices };
                  }
                } catch (error) {
                  console.error(
                    `Error fetching invoices for contract ${contract.contractId}:`,
                    error
                  );
                }
              }
              return contract;
            })
          );

          setContracts(contractsWithInvoices);
        }
      } catch (error) {
        console.error("Error fetching contracts:", error);
        toast.error("Không thể tải danh sách hợp đồng");
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, []);

  // Convert booking to contract format
  const bookingToContract = (booking: Booking): Contract => {
    const property = booking.property;
    const room = booking.room;
    const roomType = room?.roomType;
    const isBoarding = property.type === "BOARDING";

    const price = isBoarding
      ? parseFloat(roomType?.price || "0")
      : property.price || 0;

    // Calculate deposit based on property type
    const deposit = isBoarding
      ? parseFloat(roomType?.deposit || "0")
      : parseFloat(property.deposit || "0");

    const propertyCode = isBoarding
      ? room?.name || "N/A"
      : (typeof property.unit === "string"
          ? property.unit
          : property.unit?.name) || "N/A";
    const furnishing = isBoarding
      ? roomType?.furnishing || "Chưa có thông tin"
      : property.furnishing || "Chưa có thông tin";

    // Map booking status to contract status based on booking status AND contract status
    let contractStatus: Contract["status"] = "pending_landlord";

    console.log("🔍 Booking:", {
      bookingId: booking.id,
      bookingStatus: booking.status,
      contractStatus: booking.contract?.status,
      contractId: booking.contract?.id,
    });

    if (booking.status === "ACTIVE") {
      contractStatus = "active";
    } else if (booking.status === "PENDING_LANDLORD") {
      contractStatus = "pending_landlord";
      console.log("✅ Set status to pending_landlord");
    } else if (booking.status === "PENDING_SIGNATURE") {
      // Xem xét contract status để biết ai cần ký
      const backendStatus = booking.contract?.status;
      console.log("🔍 Backend contract status:", backendStatus);
      if (backendStatus === "PENDING_LANDLORD_SIGNATURE") {
        // Chờ landlord ký
        contractStatus = "pending_landlord";
        console.log("✅ Set status to pending_landlord (waiting for landlord)");
      } else if (backendStatus === "PENDING_TENANT_SIGNATURE") {
        // Chờ tenant ký
        contractStatus = "pending_signature";
        console.log("✅ Set status to pending_signature (waiting for tenant)");
      } else {
        // Mặc định chờ ký (có thể là cả 2 chưa ký)
        contractStatus = "pending_signature";
        console.log("✅ Set status to pending_signature (default)");
      }
    } else if (booking.status === "AWAITING_DEPOSIT") {
      // Khi đang chờ đặt cọc và contract status là SIGNED
      // thì hiển thị yêu cầu đặt cọc
      if (booking.contract?.status === "SIGNED") {
        contractStatus = "awaiting_deposit";
      } else {
        contractStatus = "pending_signature";
      }
    } else if (booking.status === "ESCROW_FUNDED_T") {
      // Tenant đã đặt cọc, chờ landlord đặt cọc
      contractStatus = "awaiting_landlord_deposit";
    } else if (booking.status === "ESCROW_FUNDED_L") {
      // Landlord đã đặt cọc, chờ tenant đặt cọc
      contractStatus = "awaiting_deposit";
    } else if (booking.status === "DUAL_ESCROW_FUNDED") {
      // Cả hai bên đã đặt cọc, hợp đồng đang hoạt động
      contractStatus = "active";
    } else if (booking.status === "READY_FOR_HANDOVER") {
      // Sẵn sàng bàn giao
      contractStatus = "ready_for_handover";
    } else if (["SETTLED", "CANCELLED"].includes(booking.status)) {
      contractStatus = "expired";
    }

    console.log("✅ Final mapped status:", contractStatus);

    return {
      id: booking.contract?.contractCode || booking.id,
      bookingId: booking.id,
      type: "Hợp đồng thuê nhà",
      tenant: booking.tenant.fullName,
      landlord: property.landlord.fullName,
      startDate: booking.contract?.startDate
        ? new Date(booking.contract.startDate).toLocaleDateString("vi-VN")
        : "Chưa xác định",
      endDate: booking.contract?.endDate
        ? new Date(booking.contract.endDate).toLocaleDateString("vi-VN")
        : "Chưa xác định",
      address: `${property.address}, ${property.ward}, ${property.province}`,
      propertyCode: propertyCode,
      propertyType: furnishing,
      category: property.type === "APARTMENT" ? "Chung cư" : "Nhà trọ",
      price: price,
      deposit: deposit, // Số tiền đặt cọc
      status: contractStatus,
      contractCode: booking.contract?.contractCode,
      contractId: booking.contract?.id,
      bookingStatus: booking.status,
      contractStatus: booking.contract?.status, // Thêm contract status từ backend
      invoices: [], // Will be populated for DUAL_ESCROW_FUNDED status
    };
  };

  // Handle view contract file
  const handleViewContract = async (contractId: string) => {
    try {
      const response = await contractService.getFileUrl(contractId);
      if (response.data?.fileUrl) {
        window.open(response.data.fileUrl, "_blank");
      } else {
        toast.error("Không tìm thấy file hợp đồng");
      }
    } catch (error) {
      console.error("Error viewing contract:", error);
      toast.error("Không thể mở file hợp đồng");
    }
  };

  // Handle sign contract
  const handleSignContract = async (bookingId: string) => {
    try {
      await bookingService.signContract(bookingId);
      toast.success("Yêu cầu ký hợp đồng đã được thực hiện thành công");

      // Refresh contracts - không filter để giữ tất cả bookings
      const response = await bookingService.getMyBookings();
      if (response.data) {
        const contractsData = response.data.map((booking) =>
          bookingToContract(booking)
        );
        setContracts(contractsData);
      }
    } catch (error) {
      console.error("Error signing contract:", error);
      toast.error("Không thể ký hợp đồng. Vui lòng thử lại");
    }
  };

  // Handle deposit payment - open modal
  const handleDepositPayment = (contractId: string) => {
    const contract = contracts.find((c) => c.contractId === contractId);
    if (!contract) {
      toast.error("Không tìm thấy hợp đồng");
      return;
    }

    setSelectedContractId(contractId);
    setPaymentAmount(contract.deposit); // Số tiền đặt cọc từ deposit field
    setShowPaymentModal(true);
  };

  // Process deposit payment when user confirms in modal
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handlePaymentSuccess = async (_method: string) => {
    if (!selectedContractId) return;

    try {
      // Determine payment purpose based on user role
      const purpose =
        userRole === "TENANT"
          ? PaymentPurpose.TENANT_ESCROW_DEPOSIT
          : PaymentPurpose.LANDLORD_ESCROW_DEPOSIT;

      const paymentDto: CreatePaymentDto = {
        contractId: selectedContractId,
        amount: paymentAmount,
        method: "VNPAY", // Currently only VNPAY is supported
        purpose: purpose,
      };

      const response = await paymentService.createPayment(paymentDto);

      if (response.data?.paymentUrl) {
        // Close modal and redirect to payment URL
        setShowPaymentModal(false);
        toast.success("Đang chuyển đến trang thanh toán...");

        // Redirect to VNPay
        window.location.href = response.data.paymentUrl;
      } else {
        toast.error("Không thể tạo thanh toán");
      }
    } catch (error) {
      console.error("Error creating payment:", error);
      toast.error("Không thể tạo thanh toán. Vui lòng thử lại");
    }
  };

  // Handle view invoice detail
  const handleViewInvoice = async (contractId: string) => {
    try {
      setLoadingInvoice(true);
      toast.loading("Đang tải thông tin hóa đơn...");
      const response = await invoiceService.getInvoiceByContractId(contractId);

      console.log("📄 Invoice Response:", response);
      console.log("📄 Invoice Data:", response.data);

      toast.dismiss();

      if (response.data && response.data.length > 0) {
        // API returns an array of invoices, take the first one (or latest)
        const invoice = response.data[0];
        console.log("📄 Selected Invoice:", invoice);

        setSelectedInvoice(invoice);
        setSelectedInvoices(response.data);
        setShowInvoiceDialog(true);
      } else {
        toast.error("Không tìm thấy hóa đơn");
      }
    } catch (error) {
      console.error("Error fetching invoice:", error);
      toast.dismiss();
      toast.error("Không thể tải thông tin hóa đơn");
    } finally {
      setLoadingInvoice(false);
    }
  };

  // Handle pay invoice
  const handlePayInvoice = async (invoiceId: string) => {
    try {
      toast.loading("Đang tạo thanh toán...");

      const response = await paymentService.createPaymentByInvoice(
        invoiceId,
        "VNPAY"
      );

      toast.dismiss();

      if (response.data?.paymentUrl) {
        toast.success("Đang chuyển đến trang thanh toán...");
        // Redirect to VNPay
        window.location.href = response.data.paymentUrl;
      } else {
        toast.error("Không thể tạo thanh toán");
      }
    } catch (error) {
      console.error("Error creating payment:", error);
      toast.dismiss();
      toast.error("Không thể tạo thanh toán. Vui lòng thử lại");
    }
  };

  // Handle handover - chủ nhà xác nhận bàn giao
  const handleHandover = async (bookingId: string) => {
    try {
      toast.loading("Đang xác nhận bàn giao...");

      await bookingService.handover(bookingId);

      toast.dismiss();
      toast.success("Bàn giao thành công! Hợp đồng đã được kích hoạt.");

      // Refresh contracts list
      const response = await bookingService.getMyBookings();
      if (response.data) {
        const contractsData = response.data
          .filter((booking) => {
            return (
              booking.contract !== null || booking.status === "PENDING_LANDLORD"
            );
          })
          .map((booking) => bookingToContract(booking));

        // Fetch invoices for DUAL_ESCROW_FUNDED contracts
        const contractsWithInvoices = await Promise.all(
          contractsData.map(async (contract) => {
            if (
              (contract.bookingStatus === "DUAL_ESCROW_FUNDED" ||
                contract.bookingStatus === "ACTIVE") &&
              contract.contractId
            ) {
              try {
                const invoiceResponse =
                  await invoiceService.getInvoiceByContractId(
                    contract.contractId
                  );
                if (invoiceResponse.data && invoiceResponse.data.length > 0) {
                  const mappedInvoices = invoiceResponse.data.map(
                    (apiInvoice, index) => ({
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
                      status:
                        apiInvoice.status === "PAID"
                          ? ("paid" as const)
                          : apiInvoice.status === "OVERDUE"
                          ? ("overdue" as const)
                          : ("pending" as const),
                    })
                  );
                  return { ...contract, invoices: mappedInvoices };
                }
              } catch (error) {
                console.error(
                  `Error fetching invoices for contract ${contract.contractId}:`,
                  error
                );
              }
            }
            return contract;
          })
        );

        setContracts(contractsWithInvoices);
      }
    } catch (error) {
      console.error("Error handover:", error);
      toast.dismiss();
      toast.error("Không thể xác nhận bàn giao. Vui lòng thử lại");
    }
  };

  // Filter contracts based on tab and search
  const filteredContracts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let list = contracts;

    if (q) {
      list = list.filter(
        (c) =>
          c.id.toLowerCase().includes(q) ||
          c.tenant.toLowerCase().includes(q) ||
          c.propertyCode.toLowerCase().includes(q) ||
          c.address.toLowerCase().includes(q)
      );
    }

    if (activeTab === "active") {
      return list.filter((c) => c.status === "active");
    }
    if (activeTab === "expired") {
      return list.filter((c) => c.status === "expired");
    }
    if (activeTab === "pending") {
      // Chờ xử lý bao gồm: chờ duyệt, chờ ký và chờ đặt cọc
      return list.filter(
        (c) =>
          c.status === "pending_landlord" ||
          c.status === "pending_signature" ||
          c.status === "awaiting_deposit"
      );
    }
    return list;
  }, [contracts, activeTab, searchQuery]);

  // Update tab counts
  const contractTabs = useMemo(() => {
    const allCount = contracts.length;
    const activeCount = contracts.filter((c) => c.status === "active").length;
    const expiredCount = contracts.filter((c) => c.status === "expired").length;
    const pendingCount = contracts.filter(
      (c) =>
        c.status === "pending_landlord" ||
        c.status === "pending_signature" ||
        c.status === "awaiting_deposit"
    ).length;

    return [
      { id: "all", label: "Tất cả", count: allCount },
      { id: "pending", label: "Chờ xử lý", count: pendingCount },
      { id: "active", label: "Còn hiệu lực", count: activeCount },
      { id: "expired", label: "Hết hiệu lực", count: expiredCount },
    ];
  }, [contracts]);

  const totalPages = Math.ceil(filteredContracts.length / PAGE_SIZE) || 1;

  // Ensure current page within bounds when filters change
  if (currentPage > totalPages) {
    // Simple corrective set (render-time) – safe because value only changes when out of bounds
    setCurrentPage(totalPages);
  }

  const paginatedContracts = useMemo(
    () =>
      filteredContracts.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
      ),
    [filteredContracts, currentPage]
  );

  return (
    <div className="min-h-screen bg-[#FFF7E9] p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Tabs */}
        <StatusTab
          tabs={contractTabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* Search and Navigation Bar */}
        <ContractFilter
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <LoadingSpinner size="xl" text="Đang tải..." />
          </div>
        ) : paginatedContracts.length === 0 ? (
          <div className="text-center py-12">
            <Card className="bg-primary-foreground p-8">
              <CardContent>
                <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Không tìm thấy hợp đồng nào
                </h3>
                <p className="text-gray-500">
                  {searchQuery
                    ? "Thử thay đổi từ khóa tìm kiếm"
                    : "Bạn chưa có hợp đồng nào"}
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          <>
            {/* Contracts List */}
            <div className="space-y-6">
              {paginatedContracts.map((contract) => (
                <ContractCard
                  key={contract.id}
                  contract={{
                    ...contract,
                    onViewContract: handleViewContract,
                    onSignContract: handleSignContract,
                    onDepositPayment: handleDepositPayment,
                    onViewInvoice: handleViewInvoice,
                    onPayInvoice: handlePayInvoice,
                    onHandover: handleHandover,
                  }}
                  userRole={userRole}
                />
              ))}
            </div>
          </>
        )}

        {/* Payment Modal */}
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          amount={paymentAmount}
          onPaymentSuccess={handlePaymentSuccess}
        />

        {/* Invoice Detail Dialog */}
        <InvoiceDetailDialog
          isOpen={showInvoiceDialog}
          onClose={() => setShowInvoiceDialog(false)}
          invoice={selectedInvoice}
          onPayInvoice={handlePayInvoice}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination className="pt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-40" : ""
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage((p) => Math.max(1, p - 1));
                  }}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      isActive={page === currentPage}
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(page);
                      }}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-40"
                      : ""
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage((p) => Math.min(totalPages, p + 1));
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
}
