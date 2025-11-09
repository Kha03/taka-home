"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Clock,
  CheckCircle2,
  XCircle,
  User,
  Calendar,
  MessageSquare,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { contractService } from "@/lib/api/services/contract";
import { ContractTermination } from "@/types/contracts";
import { ContractTerminationRespondDialog } from "./contract-termination-respond-dialog";

interface ContractTerminationListProps {
  contractId: string;
  currentUserId: string;
}

export function ContractTerminationList({
  contractId,
  currentUserId,
}: ContractTerminationListProps) {
  const [terminations, setTerminations] = useState<ContractTermination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTermination, setSelectedTermination] =
    useState<ContractTermination | null>(null);

  const fetchTerminations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await contractService.getTerminationRequestsByContractId(
        contractId
      );

      if (response.code === 200 && response.data) {
        setTerminations(response.data);
      }
    } catch (err) {
      console.error("Error fetching termination requests:", err);
      setError("Không thể tải danh sách yêu cầu hủy hợp đồng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTerminations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractId]);

  const getStatusBadge = (status: ContractTermination["status"]) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge
            variant="outline"
            className="border-yellow-500 text-yellow-600"
          >
            <Clock className="mr-1 h-3 w-3" />
            Đang chờ
          </Badge>
        );
      case "APPROVED":
        return (
          <Badge variant="outline" className="border-green-500 text-green-600">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Đã chấp nhận
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge variant="outline" className="border-red-500 text-red-600">
            <XCircle className="mr-1 h-3 w-3" />
            Đã từ chối
          </Badge>
        );
    }
  };

  const getRoleBadge = (role: "LANDLORD" | "TENANT") => {
    return (
      <Badge variant="secondary">
        {role === "LANDLORD" ? "Chủ nhà" : "Người thuê"}
      </Badge>
    );
  };

  const canRespond = (termination: ContractTermination) => {
    // Chỉ cho phép phản hồi nếu:
    // 1. Yêu cầu đang ở trạng thái PENDING
    // 2. Người xem KHÔNG phải là người gửi yêu cầu
    // 3. currentUserId phải có giá trị
    const isPending = termination.status === "PENDING";
    const isNotRequester = termination.requestedById !== currentUserId;
    const hasUserId = !!currentUserId;

    return isPending && isNotRequester && hasUserId;
  };
  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (terminations.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Chưa có yêu cầu hủy hợp đồng nào.</AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {terminations.map((termination) => (
          <Card key={termination.id} className="bg-primary-foreground">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">
                    Yêu cầu hủy hợp đồng
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>{termination.requestedBy.fullName}</span>
                    {getRoleBadge(termination.requestedByRole)}
                  </div>
                </div>
                {getStatusBadge(termination.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Request Details */}
              <div className="grid gap-3">
                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      Tháng kết thúc mong muốn
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(
                        new Date(termination.requestedEndMonth + "-01"),
                        "MMMM yyyy",
                        { locale: vi }
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <MessageSquare className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Lý do</p>
                    <p className="text-sm text-muted-foreground">
                      {termination.reason}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Ngày gửi yêu cầu</p>
                    <p className="text-sm text-muted-foreground">
                      {format(
                        new Date(termination.createdAt),
                        "dd/MM/yyyy HH:mm",
                        { locale: vi }
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Response Details (if any) */}
              {termination.status !== "PENDING" && termination.approvedBy && (
                <div className="border-t pt-4 space-y-3">
                  <div className="flex items-start gap-2">
                    <User className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Người phản hồi</p>
                      <p className="text-sm text-muted-foreground">
                        {termination.approvedBy.fullName}
                      </p>
                    </div>
                  </div>

                  {termination.responseNote && (
                    <div className="flex items-start gap-2">
                      <MessageSquare className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Ghi chú phản hồi</p>
                        <p className="text-sm text-muted-foreground">
                          {termination.responseNote}
                        </p>
                      </div>
                    </div>
                  )}

                  {termination.respondedAt && (
                    <div className="flex items-start gap-2">
                      <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Ngày phản hồi</p>
                        <p className="text-sm text-muted-foreground">
                          {format(
                            new Date(termination.respondedAt),
                            "dd/MM/yyyy HH:mm",
                            { locale: vi }
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Action Button */}
              {canRespond(termination) && (
                <div className="border-t pt-4">
                  <Button
                    onClick={() => setSelectedTermination(termination)}
                    className="w-full"
                  >
                    Phản hồi yêu cầu
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Respond Dialog */}
      {selectedTermination && (
        <ContractTerminationRespondDialog
          open={!!selectedTermination}
          onOpenChange={(open: boolean) =>
            !open && setSelectedTermination(null)
          }
          termination={selectedTermination}
          onSuccess={fetchTerminations}
        />
      )}
    </>
  );
}
