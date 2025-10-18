"use client";
import { useMemo, useState } from "react";
import StatusTab from "@/components/ui/status-tab";
import ContractFilter from "@/components/contracts/contract-filter";
import ContractCard from "@/components/contracts/contract-card";
import { PaymentModal } from "@/components/payment/payment-modal";
import InvoiceDetailDialog from "@/components/contracts/invoice-detail-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { type Invoice } from "@/lib/api/services/invoice";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useContracts } from "@/components/contracts/useContracts";

const PAGE_SIZE = 4;

export default function ContractsPage() {
  const { contracts, loading, userRole, actions } = useContracts();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Modal states
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedContractId, setSelectedContractId] = useState<string | null>(
    null
  );
  const [paymentAmount, setPaymentAmount] = useState<number>(0);

  // Invoice dialog states
  const [showInvoiceDialog, setShowInvoiceDialog] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Handle view invoice detail
  const handleViewInvoice = async (contractId: string) => {
    try {
      const invoices = await actions.viewInvoice(contractId);
      if (invoices && invoices.length > 0) {
        setSelectedInvoice(invoices[0]); // Take first invoice
        setShowInvoiceDialog(true);
      } else {
        alert("Không tìm thấy hóa đơn");
      }
    } catch (error) {
      console.error("Error viewing invoice:", error);
      alert("Không thể tải thông tin hóa đơn");
    }
  };

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
    if (activeTab === "active")
      return list.filter((c) => c.status === "active");
    if (activeTab === "expired")
      return list.filter((c) => c.status === "expired");
    if (activeTab === "pending")
      return list.filter((c) =>
        ["pending_landlord", "pending_signature", "awaiting_deposit"].includes(
          c.status
        )
      );
    return list;
  }, [contracts, activeTab, searchQuery]);

  const contractTabs = useMemo(() => {
    const allCount = contracts.length;
    const activeCount = contracts.filter((c) => c.status === "active").length;
    const expiredCount = contracts.filter((c) => c.status === "expired").length;
    const pendingCount = contracts.filter((c) =>
      ["pending_landlord", "pending_signature", "awaiting_deposit"].includes(
        c.status
      )
    ).length;
    return [
      { id: "all", label: "Tất cả", count: allCount },
      { id: "pending", label: "Chờ xử lý", count: pendingCount },
      { id: "active", label: "Còn hiệu lực", count: activeCount },
      { id: "expired", label: "Hết hiệu lực", count: expiredCount },
    ];
  }, [contracts]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredContracts.length / PAGE_SIZE)
  );
  const current = Math.min(currentPage, totalPages);
  const pageItems = useMemo(
    () =>
      filteredContracts.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE),
    [filteredContracts, current]
  );

  // deposit flow handlers
  const handleDepositPayment = (contractId: string) => {
    const { amount } = actions.depositPayment(contractId);
    setSelectedContractId(contractId);
    setPaymentAmount(amount);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async (_method: string) => {
    if (!selectedContractId) return;
    await actions.createDepositPayment(selectedContractId, paymentAmount);
    setShowPaymentModal(false);
  };

  return (
    <div className="min-h-screen bg-[#FFF7E9] p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <StatusTab
          tabs={contractTabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <ContractFilter
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {loading ? (
          <div className="text-center py-12">
            <LoadingSpinner size="xl" text="Đang tải..." />
          </div>
        ) : pageItems.length === 0 ? (
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
          <div className="space-y-6">
            {pageItems.map((c) => (
              <ContractCard
                key={c.id}
                contract={{
                  ...c,
                  onViewContract: actions.viewContract,
                  onSignContract: actions.signContract,
                  onDepositPayment: handleDepositPayment,
                  onViewInvoice: handleViewInvoice,
                  onPayInvoice: actions.payInvoice,
                  onHandover: actions.handover,
                }}
                userRole={userRole}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination className="pt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  className={
                    current === 1 ? "pointer-events-none opacity-40" : ""
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
                      isActive={page === current}
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
                    current === totalPages
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

        {/* Payment Modal */}
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          amount={paymentAmount}
          onPaymentSuccess={handlePaymentSuccess}
        />

        {/* Invoice Detail Dialog (kept API identical for compatibility). You can wire actions.viewInvoice here if needed. */}
        <InvoiceDetailDialog
          isOpen={showInvoiceDialog}
          onClose={() => setShowInvoiceDialog(false)}
          invoice={selectedInvoice}
          onPayInvoice={actions.payInvoice}
        />
      </div>
    </div>
  );
}
