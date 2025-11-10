"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileX, Plus, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ContractTerminationDialog,
  ContractTerminationList,
} from "@/components/contracts";

interface ContractTerminationSectionProps {
  contractId: string;
  contractEndDate: string; // ISO string format
  currentUserId: string;
  currentUserRole: "LANDLORD" | "TENANT";
  contractStatus: string;
}

export function ContractTerminationSection({
  contractId,
  contractEndDate,
  currentUserId,
  currentUserRole,
  contractStatus,
}: ContractTerminationSectionProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Only allow termination for active contracts
  const canRequestTermination =
    contractStatus === "ACTIVE" || contractStatus === "active";

  const handleSuccess = () => {
    // Refresh the termination list
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <Card className="bg-primary-foreground">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileX className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Hủy hợp đồng trước hạn</CardTitle>
          </div>
          {canRequestTermination && (
            <Button
              onClick={() => setShowCreateDialog(true)}
              size="sm"
              variant="outline"
              className="text-primary"
            >
              <Plus className="mr-2 h-4 w-4" />
              Tạo yêu cầu hủy
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Information Alert */}
        {canRequestTermination ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Bạn có thể gửi yêu cầu hủy hợp đồng trước hạn. Yêu cầu sẽ được gửi
              đến{" "}
              <Badge variant="secondary">
                {currentUserRole === "LANDLORD" ? "Người thuê" : "Chủ nhà"}
              </Badge>{" "}
              để xem xét và phản hồi.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Không thể tạo yêu cầu hủy hợp đồng. Hợp đồng phải ở trạng thái
              hoạt động.
            </AlertDescription>
          </Alert>
        )}

        {/* Termination Requests List */}
        <div>
          <h3 className="text-sm font-medium mb-3">
            Danh sách yêu cầu hủy hợp đồng
          </h3>
          <ContractTerminationList
            key={refreshKey}
            contractId={contractId}
            currentUserId={currentUserId}
          />
        </div>
      </CardContent>

      {/* Create Termination Dialog */}
      <ContractTerminationDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        contractId={contractId}
        contractEndDate={contractEndDate}
        onSuccess={handleSuccess}
      />
    </Card>
  );
}
