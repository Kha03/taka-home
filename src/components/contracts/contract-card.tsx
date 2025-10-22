"use client";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Calendar,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  MapPin,
  Eye,
  AlertCircle,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils/utils";
import type { ContractVM } from "@/types/contracts";
import { ContractExpiryAlert } from "./contract-expiry-alert";
import { ContractExtensionDialog } from "./contract-extension-dialog";
import { EscrowBalanceCard } from "./escrow-balance-card";
import { ContractExtensionStatus } from "./contract-extension-status";

interface ContractCardProps {
  contract: ContractVM & {
    onViewContract?: (contractId: string) => void;
    onSignContract?: (bookingId: string) => void;
    onDepositPayment?: (contractId: string) => void;
    onViewInvoice?: (contractId: string, invoiceId?: string) => void;
    onPayInvoice?: (invoiceId: string) => void;
    onHandover?: (bookingId: string) => void;
  };
  userRole?: string;
}

function StatusBadge({
  status,
  userRole,
}: {
  status: ContractVM["status"];
  userRole?: string;
}) {
  const config = useMemo(() => {
    switch (status) {
      case "active":
        return {
          bg: "bg-[#00AE26]/20",
          icon: <CheckCircle className="w-6 h-6 text-green-600" />,
          text: "Còn hiệu lực",
        };
      case "expired":
        return {
          bg: "bg-[#FA0000]/10",
          icon: <CheckCircle className="w-6 h-6 text-red-600" />,
          text: "Hết hiệu lực",
        };
      case "pending_signature":
        return {
          bg: "bg-[#FFA500]/20",
          icon: <Calendar className="w-6 h-6 text-orange-600" />,
          text: "Chờ ký",
        };
      case "pending_landlord":
        return {
          bg: "bg-[#818181]/10",
          icon: <Calendar className="w-6 h-6 text-gray-600" />,
          text: userRole === "LANDLORD" ? "Chờ ký" : "Chờ duyệt",
        };
      case "awaiting_deposit":
        return {
          bg: "bg-[#3B82F6]/20",
          icon: <AlertCircle className="w-6 h-6 text-blue-600" />,
          text: "Chờ đặt cọc",
        };
      case "awaiting_landlord_deposit":
        return {
          bg: "bg-[#9333EA]/20",
          icon: <AlertCircle className="w-6 h-6 text-purple-600" />,
          text: userRole === "LANDLORD" ? "Chờ đặt cọc" : "Chờ chủ nhà",
        };
      case "ready_for_handover":
        return {
          bg: "bg-[#10B981]/20",
          icon: <CheckCircle className="w-6 h-6 text-emerald-600" />,
          text: "Sẵn sàng bàn giao",
        };
      default:
        return {
          bg: "bg-gray-100",
          icon: <Calendar className="w-6 h-6 text-gray-600" />,
          text: "Không xác định",
        };
    }
  }, [status, userRole]);

  return (
    <div
      className={`${config.bg} w-[116px] rounded-[10px] p-5 flex flex-col items-center justify-center`}
    >
      {config.icon}
      <p className="text-xs font-medium">{config.text}</p>
    </div>
  );
}

function SigningDialog({
  open,
  step,
  onClose,
  onConfirm,
}: {
  open: boolean;
  step: "confirm" | "signing" | "success";
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {step === "confirm"
              ? "Xác nhận ký hợp đồng"
              : step === "signing"
              ? "Đang xử lý yêu cầu ký..."
              : "Ký hợp đồng thành công"}
          </DialogTitle>
          <DialogDescription>
            {step === "confirm"
              ? "Vui lòng xác nhận để tiếp tục"
              : step === "signing"
              ? "Vui lòng kiểm tra điện thoại"
              : "Thông tin quan trọng"}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {step === "confirm" && (
            <>
              <Card className="border-orange-200 bg-orange-50">
                <CardContent className="pt-6">
                  <div className="flex gap-3">
                    <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5" />
                    <div className="space-y-2">
                      <p className="font-medium text-orange-900">
                        Xác nhận ký hợp đồng
                      </p>
                      <p className="text-sm text-orange-800">
                        Bạn có chắc chắn muốn ký hợp đồng này? Sau khi xác nhận,
                        hệ thống sẽ gửi yêu cầu ký đến điện thoại của bạn.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="text-primary"
                >
                  Hủy
                </Button>
                <Button onClick={onConfirm}>Xác nhận ký</Button>
              </div>
            </>
          )}
          {step === "signing" && (
            <>
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="pt-6">
                  <div className="flex gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div className="space-y-2">
                      <p className="font-medium text-blue-900">
                        Vui lòng kiểm tra điện thoại
                      </p>
                      <p className="text-sm text-blue-800">
                        Hệ thống đang gửi yêu cầu ký hợp đồng đến điện thoại của
                        bạn. Vui lòng mở ứng dụng <strong>VNPT SmartCA</strong>{" "}
                        để ký xác nhận.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
          {step === "success" && (
            <>
              <Card className="border-green-200 bg-green-50">
                <CardContent className="pt-6">
                  <div className="flex gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div className="space-y-2">
                      <p className="font-medium text-green-900">
                        Đã ký thành công!
                      </p>
                      <p className="text-sm text-green-800">
                        Bạn và chủ nhà hãy đặt cọc cho hợp đồng. Hệ thống sẽ tự
                        động cập nhật trạng thái sau khi hoàn tất.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="flex justify-end">
                <Button onClick={onClose}>Đóng</Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function ContractCard({
  contract,
  userRole,
}: ContractCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogStep, setDialogStep] = useState<
    "confirm" | "signing" | "success"
  >("confirm");
  const [extensionDialogOpen, setExtensionDialogOpen] = useState(false);

  // Calculate days remaining until contract end
  const daysUntilEnd = useMemo(() => {
    if (!contract.endDate) return null;

    try {
      // Parse endDate - handle both ISO and DD/MM/YYYY formats
      let endDate: Date;

      // Check if it's DD/MM/YYYY format (e.g., "15/11/2025")
      if (contract.endDate.includes("/")) {
        const [day, month, year] = contract.endDate.split("/").map(Number);
        endDate = new Date(year, month - 1, day); // month is 0-indexed
      } else {
        // Assume ISO format or other parseable format
        endDate = new Date(contract.endDate);
      }

      // Validate the date
      if (isNaN(endDate.getTime())) {
        return null;
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);

      const diffTime = endDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return diffDays;
    } catch {
      return null;
    }
  }, [contract.endDate]);

  // Show extension alert if contract is active and expires within 60 days
  const shouldShowExtensionAlert = useMemo(() => {
    return (
      userRole === "TENANT" &&
      contract.status === "active" &&
      daysUntilEnd !== null &&
      daysUntilEnd > 0 &&
      daysUntilEnd <= 60
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [daysUntilEnd]);

  const mostRecentInvoice = contract.invoices[0];
  const remainingInvoices = contract.invoices.slice(1);
  const PAGE_SIZE = 4;
  const totalPages = Math.ceil(remainingInvoices.length / PAGE_SIZE);
  const start = (page - 1) * PAGE_SIZE;
  const pageInvoices = remainingInvoices.slice(start, start + PAGE_SIZE);

  useEffect(() => setPage(1), [isExpanded, remainingInvoices.length]);
  console.log(mostRecentInvoice?.status);
  const toggle = () => setIsExpanded((v) => !v);
  const handleSign = async () => {
    setDialogStep("signing");
    try {
      await contract.onSignContract?.(contract.bookingId);
      setDialogStep("success");
    } catch {
      setDialogOpen(false);
      setDialogStep("confirm");
    }
  };

  return (
    <Card className="bg-primary-foreground shadow-sm rounded-2xl border-none px-5 pt-2 pb-9 gap-2">
      <CardHeader className="p-0">
        <div className="flex items-start justify-between ">
          <div className="flex  gap-9 ">
            <div className="flex flex-col gap-2 items-center">
              <div className="relative inline-flex items-center">
                <span className="bg-secondary max-w-[168px] text-primary font-bold text-sm px-3 py-1.5 rounded-full truncate overflow-hidden whitespace-nowrap">
                  {contract.contractCode || contract.id}
                </span>
                <span className="absolute left-full top-1/2 -translate-y-1/2 flex items-center">
                  <span className="w-5 h-px bg-[#B3B3B3]" />
                  <span className="w-2 h-2 bg-[#B3B3B3] rounded-full" />
                </span>
              </div>
              <StatusBadge status={contract.status} userRole={userRole} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-bold text-primary text-lg">
                  {contract.type}
                </span>
                <span className="text-[#4F4F4F]">•</span>
                <span className="text-[#4F4F4F] text-sm">
                  Người thuê:
                  <span className="text-secondary font-bold text-sm ml-1">
                    {contract.tenant}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-1 text-sm text-[#4f4f4f]">
                <div className="w-6 h-6 rounded-full bg-[#e5e5e5] flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-primary" />
                </div>
                <span>
                  Thời hạn hợp đồng:
                  <strong className="ml-1">
                    {contract.startDate} - {contract.endDate}
                  </strong>
                </span>
              </div>
              <div className="flex items-center gap-1 text-sm text-[#4f4f4f] mt-3">
                <div className="w-6 h-6 rounded-full bg-[#e5e5e5] flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <span>{contract.address}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-3 mb-2">
              <div className="text-center p-3 border border-dashed rounded-lg border-[#e5e5e5]">
                <div className="text-xs text-[#8d8d8d]">Mã bất động sản</div>
                <div className="font-medium text-primary">
                  {contract.propertyCode}
                </div>
              </div>
              <div className="text-center p-3 border border-dashed rounded-lg border-[#e5e5e5]">
                <div className="text-xs text-[#8d8d8d]">
                  Tình trạng nội thất
                </div>
                <div className="font-medium text-primary">
                  {contract.propertyType}
                </div>
              </div>
              <div className="text-center p-3 border border-dashed rounded-lg border-[#e5e5e5]">
                <div className="text-xs text-[#8d8d8d]">Danh mục</div>
                <div className="font-medium text-primary">
                  {contract.category}
                </div>
              </div>
            </div>
            <div className="flex bg-[#f5f5f5] rounded-2xl py-2 justify-center">
              <div className="text-sm text-muted-foreground">Giá thuê:</div>
              <div className="text-sm font-bold text-secondary ml-1">
                {contract.price.toLocaleString("vi-VN")} VND
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      {/* Actions by status */}
      {contract.status === "pending_signature" && contract.contractId && (
        <div className="ml-35 mb-4 flex gap-3">
          <Button
            variant="outline"
            className="flex-1 text-primary"
            onClick={() => contract.onViewContract?.(contract.contractId!)}
          >
            <Eye className="w-4 h-4 mr-2" />
            Xem hợp đồng
          </Button>
          <Button
            className="flex-1"
            onClick={() => {
              setDialogStep("confirm");
              setDialogOpen(true);
            }}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Ký hợp đồng
          </Button>
        </div>
      )}

      {contract.status === "pending_landlord" && (
        <div className="ml-35 mb-2">
          <Card className="bg-yellow-50 border-yellow-200 p-1">
            <CardContent className="py-2">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div className="space-y-2 flex-1">
                  <p className="text-sm font-semibold text-yellow-900">
                    {userRole === "LANDLORD"
                      ? "Yêu cầu ký hợp đồng"
                      : "Chờ duyệt"}
                  </p>
                  <p className="text-sm text-yellow-800">
                    {userRole === "LANDLORD"
                      ? "Người thuê đã gửi yêu cầu thuê. Vui lòng xem xét và ký hợp đồng."
                      : "Đang chờ chủ nhà duyệt yêu cầu thuê."}
                  </p>
                  {userRole === "LANDLORD" &&
                    contract.bookingId &&
                    contract.onSignContract && (
                      <div className="flex gap-2 mt-2">
                        {contract.contractId && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-primary"
                            onClick={() =>
                              contract.onViewContract?.(contract.contractId!)
                            }
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Xem hợp đồng
                          </Button>
                        )}
                        <Button
                          size="sm"
                          onClick={() =>
                            contract.onSignContract?.(contract.bookingId)
                          }
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Ký hợp đồng
                        </Button>
                      </div>
                    )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {contract.status === "awaiting_deposit" && (
        <div className="ml-35 mb-2">
          <Card className="bg-blue-50 border-blue-200 p-1">
            <CardContent className="py-2">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="space-y-2 flex-1">
                  <p className="text-sm font-semibold text-blue-900">
                    Yêu cầu đặt cọc
                  </p>
                  <p className="text-sm text-blue-800">
                    Bạn và chủ nhà cần đặt cọc để kích hoạt hợp đồng. Vui lòng
                    hoàn tất việc đặt cọc trong thời gian quy định.
                  </p>
                  <div className="flex gap-2 mt-2">
                    {contract.contractId && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-primary"
                        onClick={() =>
                          contract.onViewContract?.(contract.contractId!)
                        }
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Xem hợp đồng
                      </Button>
                    )}
                    {contract.contractId && contract.onDepositPayment && (
                      <Button
                        size="sm"
                        onClick={() =>
                          contract.onDepositPayment?.(contract.contractId!)
                        }
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Đặt cọc ngay
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {contract.status === "awaiting_landlord_deposit" && (
        <div className="ml-35 mb-2">
          <Card className="bg-purple-50 border-purple-200 p-1">
            <CardContent className="py-2">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-purple-600 mt-0.5" />
                <div className="space-y-2 flex-1">
                  <p className="text-sm font-semibold text-purple-900">
                    {userRole === "LANDLORD" ? "Yêu cầu đặt cọc" : "Đã đặt cọc"}
                  </p>
                  <p className="text-sm text-purple-800">
                    {userRole === "LANDLORD"
                      ? "Người thuê đã đặt cọc. Đến lượt bạn đặt cọc để kích hoạt hợp đồng."
                      : "Bạn đã hoàn tất đặt cọc. Đang chờ chủ nhà đặt cọc để kích hoạt hợp đồng."}
                  </p>
                  <div className="flex gap-2 mt-2">
                    {contract.contractId && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-primary"
                        onClick={() =>
                          contract.onViewContract?.(contract.contractId!)
                        }
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Xem hợp đồng
                      </Button>
                    )}
                    {userRole === "LANDLORD" &&
                      contract.contractId &&
                      contract.onDepositPayment && (
                        <Button
                          size="sm"
                          onClick={() =>
                            contract.onDepositPayment?.(contract.contractId!)
                          }
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Đặt cọc ngay
                        </Button>
                      )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {contract.status === "ready_for_handover" && (
        <div className="ml-35 mb-2">
          <Card className="bg-emerald-50 border-emerald-200 p-1">
            <CardContent className="py-2">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5" />
                <div className="space-y-2 flex-1">
                  <p className="text-sm font-semibold text-emerald-900">
                    {userRole === "LANDLORD"
                      ? "Sẵn sàng bàn giao"
                      : "Chờ bàn giao"}
                  </p>
                  <p className="text-sm text-emerald-800">
                    {userRole === "LANDLORD"
                      ? "Cả hai bên đã hoàn tất đặt cọc. Vui lòng xác nhận bàn giao để kích hoạt hợp đồng."
                      : "Cả hai bên đã hoàn tất đặt cọc. Đang chờ chủ nhà xác nhận bàn giao để kích hoạt hợp đồng."}
                  </p>
                  <div className="flex gap-2 mt-2">
                    {contract.contractId && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-primary"
                        onClick={() =>
                          contract.onViewContract?.(contract.contractId!)
                        }
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Xem hợp đồng
                      </Button>
                    )}
                    {userRole === "LANDLORD" &&
                      contract.bookingId &&
                      contract.onHandover && (
                        <Button
                          size="sm"
                          onClick={() =>
                            contract.onHandover?.(contract.bookingId)
                          }
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Xác nhận bàn giao
                        </Button>
                      )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Extension Alert for Tenant */}
      {shouldShowExtensionAlert && daysUntilEnd && (
        <div className="ml-35 mb-4">
          <ContractExpiryAlert
            endDate={contract.endDate}
            daysRemaining={daysUntilEnd}
            onExtendClick={() => setExtensionDialogOpen(true)}
          />
        </div>
      )}

      {contract.status === "active" && contract.contractId && (
        <div className="ml-35 mb-2">
          <Button
            variant="outline"
            onClick={() => contract.onViewContract?.(contract.contractId!)}
            className="text-primary"
          >
            <Eye className="w-4 h-4 mr-2" />
            Xem hợp đồng
          </Button>
        </div>
      )}

      {/* Escrow Balance */}
      {contract.status === "active" && contract.contractId && (
        <div className="ml-35 mb-4">
          <EscrowBalanceCard contractId={contract.contractId} />
        </div>
      )}

      {/* Extension Requests Button */}
      {contract.status === "active" && contract.contractId && userRole && (
        <div className="ml-35 mb-4">
          <ContractExtensionStatus
            contractId={contract.contractId}
            userRole={userRole}
            propertyType={contract.propertyType}
          />
        </div>
      )}

      {/* Invoices */}
      {contract.status === "active" &&
        (contract.bookingStatus === "DUAL_ESCROW_FUNDED" ||
          contract.bookingStatus === "ACTIVE") &&
        contract.invoices.length === 0 && (
          <CardContent className="ml-35 relative rounded-2xl border border-dashed border-[#E5E5E5] p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-500" />
                <div>
                  <div className="font-semibold text-foreground">
                    Hóa đơn thanh toán
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Xem chi tiết hóa đơn của bạn
                  </div>
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => contract.onViewInvoice?.(contract.contractId!)}
                className="bg-[#D4A574] hover:bg-[#D4A574]/90"
              >
                <Eye className="w-4 h-4 mr-2" />
                Xem hóa đơn
              </Button>
            </div>
          </CardContent>
        )}

      {contract.status === "active" && contract.invoices.length > 0 && (
        <CardContent className="ml-35 relative rounded-2xl border border-dashed border-[#E5E5E5] p-6">
          <Collapsible open={isExpanded} onOpenChange={toggle}>
            <span className="absolute -top-3 left-6 inline-flex items-center rounded-full bg-[#13337A] px-3 py-1 text-xs font-semibold text-white shadow-sm">
              Lịch sử hóa đơn ({contract.invoices.length})
            </span>
            <Button
              size="sm"
              variant="ghost"
              className="absolute -top-3 right-6 rounded-full bg-secondary text-primary-foreground hover:bg-secondary/85 hover:text-primary"
            >
              Nhắn tin
            </Button>

            {/* most recent */}
            {mostRecentInvoice && (
              <div className="flex items-center justify-between rounded-lg bg-[#f5f5f5] py-3 px-4 mt-2">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "grid h-6 w-6 place-items-center rounded-full",
                      mostRecentInvoice.status === "PAID"
                        ? "bg-[#00AE26]"
                        : "bg-secondary"
                    )}
                  >
                    <span className="text-xs font-semibold text-primary-foreground">
                      {mostRecentInvoice.id}
                    </span>
                  </div>
                  <div>
                    <div className="font-bold text-foreground">
                      Hóa đơn thuê nhà {mostRecentInvoice.month}
                    </div>
                    <div className="text-xs text-[#4f4f4f]">
                      Hạn thanh toán:{" "}
                      <strong>{mostRecentInvoice.dueDate}</strong>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {(contract.bookingStatus === "DUAL_ESCROW_FUNDED" ||
                    contract.bookingStatus === "ACTIVE") &&
                    contract.contractId && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs text-primary"
                        onClick={() =>
                          contract.onViewInvoice?.(
                            contract.contractId!,
                            mostRecentInvoice.invoiceId
                          )
                        }
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Chi tiết
                      </Button>
                    )}
                  {mostRecentInvoice.status === "PAID" ? (
                    <div className="flex items-center gap-2 text-xs text-foreground">
                      <div className="h-4 w-4 rounded-full bg-[#00AE26] flex items-center justify-center">
                        <Check className="h-3 w-3 text-primary-foreground" />
                      </div>
                      <span>Đã thanh toán</span>
                    </div>
                  ) : mostRecentInvoice.status === "PENDING" ? (
                    <Button
                      size="sm"
                      className="rounded-full bg-secondary text-primary-foreground hover:bg-secondary/85"
                      onClick={() =>
                        contract.onPayInvoice?.(mostRecentInvoice.invoiceId)
                      }
                    >
                      Thanh toán
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2 text-xs text-foreground">
                      <div className="h-4 w-4 rounded-full bg-red-500 flex items-center justify-center">
                        <AlertCircle className="h-3 w-3 text-white" />
                      </div>
                      <span>Quá hạn</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* rest */}
            <CollapsibleContent className="space-y-2">
              {pageInvoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between rounded-lg bg-[#f5f5f5] py-3 px-4 mt-2"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "grid h-6 w-6 place-items-center rounded-full",
                        invoice.status === "PAID"
                          ? "bg-[#00AE26]"
                          : "bg-secondary"
                      )}
                    >
                      <span className="text-xs font-semibold text-primary-foreground">
                        {invoice.id}
                      </span>
                    </div>
                    <div>
                      <div className="font-bold text-foreground">
                        Hóa đơn thuê nhà {invoice.month}
                      </div>
                      <div className="text-xs text-[#4f4f4f]">
                        Hạn thanh toán: <strong>{invoice.dueDate}</strong>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {(contract.bookingStatus === "DUAL_ESCROW_FUNDED" ||
                      contract.bookingStatus === "ACTIVE") &&
                      contract.contractId && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs text-primary"
                          onClick={() =>
                            contract.onViewInvoice?.(
                              contract.contractId!,
                              invoice.invoiceId
                            )
                          }
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Chi tiết
                        </Button>
                      )}
                    {invoice.status === "PAID" ? (
                      <div className="flex items-center gap-2 text-xs text-foreground">
                        <div className="h-4 w-4 rounded-full bg-[#00AE26] flex items-center justify-center">
                          <Check className="h-3 w-3 text-primary-foreground" />
                        </div>
                        <span>Đã thanh toán</span>
                      </div>
                    ) : invoice.status === "PENDING" ? (
                      <Button
                        size="sm"
                        className="rounded-full bg-secondary text-primary-foreground hover:bg-secondary/85"
                        onClick={() =>
                          contract.onPayInvoice?.(invoice.invoiceId)
                        }
                      >
                        Thanh toán
                      </Button>
                    ) : (
                      <div className="flex items-center gap-2 text-xs text-foreground">
                        <div className="h-4 w-4 rounded-full bg-red-500 flex items-center justify-center">
                          <AlertCircle className="h-3 w-3 text-white" />
                        </div>
                        <span>Quá hạn</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </CollapsibleContent>

            {remainingInvoices.length > 0 && (
              <div className="flex justify-between items-center pt-2">
                <div className="flex-1" />
                <div className="flex-1 flex justify-center">
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="outline"
                      className="inline-flex items-center gap-1 bg-transparent px-4 py-2 text-muted-foreground border-none shadow-none"
                    >
                      {isExpanded ? (
                        <>
                          <div className="h-5 w-5 bg-secondary rounded-full flex items-center justify-center">
                            <ChevronUp className="h-4 w-4 text-primary-foreground" />
                          </div>
                          <span>Ẩn bớt</span>
                        </>
                      ) : (
                        <>
                          <div className="h-5 w-5 bg-secondary rounded-full flex items-center justify-center">
                            <ChevronDown className="w-4 h-4 text-primary-foreground" />
                          </div>
                          <span>
                            Xem thêm {remainingInvoices.length} hóa đơn
                          </span>
                        </>
                      )}
                    </Button>
                  </CollapsibleTrigger>
                </div>
                <div className="flex-1">
                  {isExpanded && totalPages > 1 && (
                    <Pagination className="justify-end">
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              setPage((p) => Math.max(1, p - 1));
                            }}
                            className="h-7 w-7 rounded-full"
                          />
                        </PaginationItem>
                        {Array.from(
                          { length: totalPages },
                          (_, i) => i + 1
                        ).map((n) => (
                          <PaginationItem key={n}>
                            <PaginationLink
                              href="#"
                              isActive={n === page}
                              onClick={(e) => {
                                e.preventDefault();
                                setPage(n);
                              }}
                              className="h-7 w-7 rounded-full p-0 data-[active]:bg-primary data-[active]:text-primary-foreground"
                            >
                              {n}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        <PaginationItem>
                          <PaginationNext
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              setPage((p) => Math.min(totalPages, p + 1));
                            }}
                            className="h-7 w-7 rounded-full"
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  )}
                </div>
              </div>
            )}
          </Collapsible>
        </CardContent>
      )}

      {/* Extension Dialog */}
      <ContractExtensionDialog
        contractId={contract.contractId || contract.id}
        currentEndDate={contract.endDate}
        open={extensionDialogOpen}
        onOpenChange={setExtensionDialogOpen}
        onSuccess={() => {
          // Could trigger a refresh here if needed
          console.log("Extension request sent successfully");
        }}
      />

      <SigningDialog
        open={dialogOpen}
        step={dialogStep}
        onClose={() => {
          setDialogOpen(false);
          setDialogStep("confirm");
        }}
        onConfirm={handleSign}
      />
    </Card>
  );
}
