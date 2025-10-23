"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Clock,
  FileText,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileSignature,
  Wallet,
  History,
} from "lucide-react";
import {
  contractService,
  type EscrowBalanceResponse,
} from "@/lib/api/services/contract";
import { ContractExtension } from "@/types/contracts";
import { LandlordResponseDialog } from "./landlord-response-dialog";
import { TenantDecisionDialog } from "./tenant-decision-dialog";
import { SignatureDialog } from "./signature-dialog";
import { ExtensionEscrowDepositDialog } from "./extension-escrow-deposit-dialog";

interface ContractExtensionStatusProps {
  contractId: string;
  userRole: string;
  requiredDeposit: number; // Số tiền cọc yêu cầu
}

export function ContractExtensionStatus({
  contractId,
  userRole,
  requiredDeposit,
}: ContractExtensionStatusProps) {
  const [extensions, setExtensions] = useState<ContractExtension[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedExtension, setSelectedExtension] =
    useState<ContractExtension | null>(null);
  const [landlordDialogOpen, setLandlordDialogOpen] = useState(false);
  const [tenantDialogOpen, setTenantDialogOpen] = useState(false);
  const [signatureDialogOpen, setSignatureDialogOpen] = useState(false);
  const [escrowDepositDialogOpen, setEscrowDepositDialogOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState(0);
  const [escrowBalance, setEscrowBalance] =
    useState<EscrowBalanceResponse | null>(null);

  useEffect(() => {
    const fetchExtensions = async () => {
      try {
        const response =
          await contractService.getContractExtensionRequestsByContractId(
            contractId
          );
        if (response.code === 200 && response.data) {
          setExtensions(response.data);
        }
      } catch (err) {
        console.error("Error fetching extensions:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchEscrowBalance = async () => {
      try {
        const response = await contractService.getEscrowByContractId(
          contractId
        );
        if (response.code === 200 && response.data) {
          setEscrowBalance(response.data);
        }
      } catch (err) {
        console.error("Error fetching escrow balance:", err);
      }
    };

    fetchExtensions();
    fetchEscrowBalance();
  }, [contractId]);

  const fetchExtensions = async () => {
    try {
      const response =
        await contractService.getContractExtensionRequestsByContractId(
          contractId
        );
      if (response.code === 200 && response.data) {
        setExtensions(response.data);
      }
    } catch (err) {
      console.error("Error fetching extensions:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEscrowBalance = async () => {
    try {
      const response = await contractService.getEscrowByContractId(contractId);
      if (response.code === 200 && response.data) {
        setEscrowBalance(response.data);
      }
    } catch (err) {
      console.error("Error fetching escrow balance:", err);
    }
  };

  const getStatusConfig = (status: ContractExtension["status"]) => {
    switch (status) {
      case "PENDING":
        return {
          label: "Chờ phản hồi",
          color:
            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
          icon: <Clock className="w-4 h-4" />,
        };
      case "LANDLORD_RESPONDED":
        return {
          label: "Chủ nhà đã phản hồi",
          color:
            "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
          icon: <AlertCircle className="w-4 h-4" />,
        };
      case "AWAITING_SIGNATURES":
        return {
          label: "Chờ ký",
          color:
            "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
          icon: <FileSignature className="w-4 h-4" />,
        };
      case "LANDLORD_SIGNED":
        return {
          label: "Chủ nhà đã ký",
          color:
            "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
          icon: <CheckCircle2 className="w-4 h-4" />,
        };
      case "AWAITING_ESCROW":
        return {
          label: "Chờ cọc",
          color:
            "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400",
          icon: <Wallet className="w-4 h-4" />,
        };
      case "ESCROW_FUNDED_T":
        return {
          label: "Người thuê đã cọc",
          color:
            "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400",
          icon: <CheckCircle2 className="w-4 h-4" />,
        };
      case "ESCROW_FUNDED_L":
        return {
          label: "Chủ nhà đã cọc",
          color: "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-400",
          icon: <CheckCircle2 className="w-4 h-4" />,
        };

      case "ACTIVE":
        return {
          label: "Đã kích hoạt",
          color:
            "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
          icon: <CheckCircle2 className="w-4 h-4" />,
        };
      case "REJECTED":
        return {
          label: "Đã từ chối",
          color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
          icon: <XCircle className="w-4 h-4" />,
        };
      case "CANCELLED":
        return {
          label: "Đã hủy",
          color:
            "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
          icon: <XCircle className="w-4 h-4" />,
        };
      default:
        return {
          label: status,
          color: "bg-gray-100 text-gray-800",
          icon: <Clock className="w-4 h-4" />,
        };
    }
  };

  const formatCurrency = (amount: number | null) => {
    if (!amount) return "Không thay đổi";
    return new Intl.NumberFormat("vi-VN").format(amount) + " đ";
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const handleLandlordRespond = (extension: ContractExtension) => {
    setSelectedExtension(extension);
    setLandlordDialogOpen(true);
  };

  const handleTenantDecision = (extension: ContractExtension) => {
    setSelectedExtension(extension);
    setTenantDialogOpen(true);
  };

  const handleSign = (extension: ContractExtension) => {
    setSelectedExtension(extension);
    setSignatureDialogOpen(true);
  };

  const handleDeposit = async (extension: ContractExtension) => {
    // Tính toán số tiền thiếu dựa trên escrow balance
    let depositAmt = 100000; // Default fallback

    if (escrowBalance) {
      const tenantBalance = parseFloat(escrowBalance.balanceTenant);
      const landlordBalance = parseFloat(escrowBalance.balanceLandlord);

      if (userRole === "TENANT") {
        const shortage = Math.max(0, requiredDeposit - tenantBalance);
        depositAmt = shortage || 100000;
      } else if (userRole === "LANDLORD") {
        const shortage = Math.max(0, requiredDeposit - landlordBalance);
        depositAmt = shortage || 100000;
      }
    }

    setSelectedExtension(extension);
    setDepositAmount(depositAmt);
    setEscrowDepositDialogOpen(true);
  };

  const getActionButton = (extension: ContractExtension) => {
    // Landlord actions
    if (userRole === "LANDLORD") {
      if (extension.status === "PENDING") {
        return (
          <Button
            onClick={() => handleLandlordRespond(extension)}
            variant="default"
            size="sm"
            className="w-full"
          >
            <FileText className="w-4 h-4 mr-2" />
            Phản hồi yêu cầu
          </Button>
        );
      }
      // Chủ nhà ký TRƯỚC khi người thuê ký
      if (
        extension.status === "AWAITING_SIGNATURES" &&
        !extension.landlordSignedAt
      ) {
        return (
          <Button
            onClick={() => handleSign(extension)}
            variant="default"
            size="sm"
            className="w-full"
          >
            <FileSignature className="w-4 h-4 mr-2" />
            Ký hợp đồng gia hạn (Chủ nhà ký trước)
          </Button>
        );
      }
      // Landlord deposit
      if (
        (extension.status === "AWAITING_ESCROW" ||
          extension.status === "ESCROW_FUNDED_T") &&
        !extension.landlordEscrowDepositFundedAt
      ) {
        return (
          <Button
            onClick={() => handleDeposit(extension)}
            variant="default"
            size="sm"
            className="w-full bg-cyan-600 hover:bg-cyan-700"
          >
            <Wallet className="w-4 h-4 mr-2" />
            Đặt cọc gia hạn
          </Button>
        );
      }
    }

    // Tenant actions
    if (userRole === "TENANT") {
      if (extension.status === "LANDLORD_RESPONDED") {
        return (
          <div className="flex gap-2">
            <Button
              onClick={() => handleTenantDecision(extension)}
              variant="default"
              size="sm"
              className="flex-1"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Xem & Quyết định
            </Button>
          </div>
        );
      }
      // Người thuê chỉ có thể ký SAU KHI chủ nhà đã ký (status = LANDLORD_SIGNED)
      if (extension.status === "LANDLORD_SIGNED" && !extension.tenantSignedAt) {
        return (
          <Button
            onClick={() => handleSign(extension)}
            variant="default"
            size="sm"
            className="w-full"
          >
            <FileSignature className="w-4 h-4 mr-2" />
            Ký hợp đồng gia hạn (Người thuê ký sau)
          </Button>
        );
      }
      // Tenant deposit
      if (
        (extension.status === "AWAITING_ESCROW" ||
          extension.status === "ESCROW_FUNDED_L") &&
        !extension.tenantEscrowDepositFundedAt
      ) {
        return (
          <Button
            onClick={() => handleDeposit(extension)}
            variant="default"
            size="sm"
            className="w-full bg-cyan-600 hover:bg-cyan-700"
          >
            <Wallet className="w-4 h-4 mr-2" />
            Đặt cọc gia hạn
          </Button>
        );
      }
    }

    return null;
  };

  if (loading) {
    return (
      <Button variant="outline" disabled className="w-full">
        <Clock className="w-4 h-4 mr-2 animate-pulse" />
        Đang tải...
      </Button>
    );
  }

  if (extensions.length === 0) {
    return null;
  }

  const pendingCount = extensions.filter(
    (ext) => ext.status === "PENDING" || ext.status === "LANDLORD_RESPONDED"
  ).length;

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setDialogOpen(true)}
        className="w-full text-primary border-blue-300 hover:bg-blue-50"
      >
        <History className="w-4 h-4 mr-2" />
        Xem yêu cầu gia hạn ({extensions.length})
        {pendingCount > 0 && (
          <Badge className="ml-2 bg-orange-500 text-white">
            {pendingCount} chờ xử lý
          </Badge>
        )}
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Danh sách yêu cầu gia hạn ({extensions.length})
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 mt-4">
            {extensions.map((extension) => {
              const statusConfig = getStatusConfig(extension.status);
              const actionButton = getActionButton(extension);

              return (
                <Card
                  key={extension.id}
                  className="border-2 bg-primary-foreground"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        Yêu cầu gia hạn {extension.extensionMonths} tháng
                      </CardTitle>
                      <Badge className={statusConfig.color}>
                        {statusConfig.icon}
                        <span className="ml-1">{statusConfig.label}</span>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Request Info */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-muted-foreground">Ngày yêu cầu</p>
                        <p className="font-medium">
                          {formatDate(extension.createdAt)}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">
                          Số tháng gia hạn
                        </p>
                        <p className="font-medium">
                          {extension.extensionMonths} tháng
                        </p>
                      </div>
                    </div>

                    {/* Request Note */}
                    {extension.requestNote && (
                      <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">
                          Lời nhắn từ người thuê:
                        </p>
                        <p className="text-sm">{extension.requestNote}</p>
                      </div>
                    )}

                    {/* Landlord Response */}
                    {extension.status !== "PENDING" &&
                      extension.status !== "CANCELLED" && (
                        <div className="border-t pt-3 space-y-2">
                          <p className="text-sm font-semibold">
                            Điều kiện gia hạn từ chủ nhà:
                          </p>
                          <div className="text-sm">
                            <div>
                              <p className="text-muted-foreground">
                                Giá thuê mới
                              </p>
                              <p className="font-medium text-blue-600">
                                {formatCurrency(extension.newMonthlyRent)}
                              </p>
                            </div>
                          </div>
                          {extension.responseNote && (
                            <div className="bg-indigo-50 dark:bg-indigo-950/20 rounded-lg p-3">
                              <p className="text-xs text-muted-foreground mb-1">
                                Lời nhắn từ chủ nhà:
                              </p>
                              <p className="text-sm">
                                {extension.responseNote}
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                    {/* Signature Status */}
                    {(extension.landlordSignedAt ||
                      extension.tenantSignedAt) && (
                      <div className="border-t pt-3 grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-muted-foreground">Chủ nhà ký</p>
                          <p className="font-medium">
                            {extension.landlordSignedAt ? (
                              <span className="text-green-600 flex items-center gap-1">
                                <CheckCircle2 className="w-4 h-4" />
                                {formatDate(extension.landlordSignedAt)}
                              </span>
                            ) : (
                              <span className="text-gray-400">Chưa ký</span>
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Người thuê ký</p>
                          <p className="font-medium">
                            {extension.tenantSignedAt ? (
                              <span className="text-green-600 flex items-center gap-1">
                                <CheckCircle2 className="w-4 h-4" />
                                {formatDate(extension.tenantSignedAt)}
                              </span>
                            ) : (
                              <span className="text-gray-400">Chưa ký</span>
                            )}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Escrow Deposit Status */}
                    {(extension.status === "AWAITING_ESCROW" ||
                      extension.status === "ESCROW_FUNDED_T" ||
                      extension.status === "ESCROW_FUNDED_L" ||
                      extension.tenantEscrowDepositFundedAt ||
                      extension.landlordEscrowDepositFundedAt) && (
                      <div className="border-t pt-3">
                        <p className="text-sm font-semibold mb-2">
                          Trạng thái đặt cọc gia hạn:
                        </p>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-muted-foreground">
                              Người thuê cọc
                            </p>
                            <p className="font-medium">
                              {extension.tenantEscrowDepositFundedAt ? (
                                <span className="text-green-600 flex items-center gap-1">
                                  <CheckCircle2 className="w-4 h-4" />
                                  {formatDate(
                                    extension.tenantEscrowDepositFundedAt
                                  )}
                                </span>
                              ) : (
                                <span className="text-orange-500">
                                  Chưa đặt cọc
                                </span>
                              )}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Chủ nhà cọc</p>
                            <p className="font-medium">
                              {extension.landlordEscrowDepositFundedAt ? (
                                <span className="text-green-600 flex items-center gap-1">
                                  <CheckCircle2 className="w-4 h-4" />
                                  {formatDate(
                                    extension.landlordEscrowDepositFundedAt
                                  )}
                                </span>
                              ) : (
                                <span className="text-orange-500">
                                  Chưa đặt cọc
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                        {extension.escrowDepositDueAt && (
                          <div className="mt-2 p-2 bg-amber-50 dark:bg-amber-950/20 rounded text-xs">
                            <span className="text-muted-foreground">
                              Hạn đặt cọc:{" "}
                            </span>
                            <span className="font-medium">
                              {formatDate(extension.escrowDepositDueAt)}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action Button */}
                    {actionButton && (
                      <div className="border-t pt-3">{actionButton}</div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialogs */}
      {selectedExtension && (
        <>
          <LandlordResponseDialog
            open={landlordDialogOpen}
            onOpenChange={setLandlordDialogOpen}
            extension={selectedExtension}
            onSuccess={fetchExtensions}
          />
          <TenantDecisionDialog
            open={tenantDialogOpen}
            onOpenChange={setTenantDialogOpen}
            extension={selectedExtension}
            onSuccess={fetchExtensions}
          />
          <SignatureDialog
            open={signatureDialogOpen}
            onOpenChange={setSignatureDialogOpen}
            extension={selectedExtension}
            userRole={userRole}
            onSuccess={() => {
              fetchExtensions();
              fetchEscrowBalance();
            }}
          />
          <ExtensionEscrowDepositDialog
            open={escrowDepositDialogOpen}
            onOpenChange={setEscrowDepositDialogOpen}
            extension={selectedExtension}
            userRole={userRole}
            depositAmount={depositAmount}
            onSuccess={() => {
              fetchExtensions();
              fetchEscrowBalance();
            }}
          />
        </>
      )}
    </>
  );
}
