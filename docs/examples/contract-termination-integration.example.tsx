/**
 * Example: Cách tích hợp Contract Termination vào trang chi tiết hợp đồng
 *
 * File này là ví dụ minh họa, không nên commit vào production
 */

"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContractTerminationSection } from "@/components/contracts";
import { useAuth } from "@/contexts/auth-context";

// Mock data cho ví dụ
const mockContract = {
  id: "6f81d431-3a3c-467a-853a-ac6c936d5ceb",
  code: "HD001",
  landlordId: "landlord-123",
  tenantId: "tenant-456",
  startDate: "2025-01-01T00:00:00.000Z",
  endDate: "2026-12-31T00:00:00.000Z",
  status: "ACTIVE",
  monthlyRent: 5000000,
  depositAmount: 10000000,
};

export default function ContractDetailPageExample() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // Xác định role của user hiện tại
  const currentUserRole =
    user?.id === mockContract.landlordId ? "LANDLORD" : "TENANT";

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Chi tiết hợp đồng</h1>
          <p className="text-muted-foreground">
            Mã hợp đồng: {mockContract.code}
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="payments">Thanh toán</TabsTrigger>
          <TabsTrigger value="extension">Gia hạn</TabsTrigger>
          <TabsTrigger value="termination">Hủy hợp đồng</TabsTrigger>
          <TabsTrigger value="history">Lịch sử</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {/* Nội dung tổng quan hợp đồng */}
          <div>Contract Overview Content...</div>
        </TabsContent>

        <TabsContent value="payments">
          {/* Nội dung thanh toán */}
          <div>Payments Content...</div>
        </TabsContent>

        <TabsContent value="extension">
          {/* Nội dung gia hạn */}
          <div>Extension Content...</div>
        </TabsContent>

        <TabsContent value="termination">
          {/* ===== TÍCH HỢP CONTRACT TERMINATION ===== */}
          <ContractTerminationSection
            contractId={mockContract.id}
            contractEndDate={mockContract.endDate}
            currentUserId={user?.id || ""}
            currentUserRole={currentUserRole}
            contractStatus={mockContract.status}
          />
        </TabsContent>

        <TabsContent value="history">
          {/* Nội dung lịch sử */}
          <div>History Content...</div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

/**
 * ===== CÁC CÁCH TÍCH HỢP KHÁC =====
 */

// 1. Tích hợp riêng lẻ các components
export function Example1() {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <button onClick={() => setShowDialog(true)}>
        Tạo yêu cầu hủy hợp đồng
      </button>

      <ContractTerminationDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        contractId="6f81d431-3a3c-467a-853a-ac6c936d5ceb"
        contractEndDate="2026-12-31T00:00:00.000Z"
        onSuccess={() => {
          console.log("Yêu cầu hủy hợp đồng đã được tạo!");
          setShowDialog(false);
        }}
      />
    </>
  );
}

// 2. Hiển thị danh sách trong modal
export function Example2() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Xem yêu cầu hủy hợp đồng</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Yêu cầu hủy hợp đồng</DialogTitle>
        </DialogHeader>
        <ContractTerminationList
          contractId="6f81d431-3a3c-467a-853a-ac6c936d5ceb"
          currentUserId="user-123"
        />
      </DialogContent>
    </Dialog>
  );
}

// 3. Sử dụng API service trực tiếp
export function Example3() {
  const handleCreateTermination = async () => {
    try {
      const response = await contractService.createTerminationRequest({
        contractId: "6f81d431-3a3c-467a-853a-ac6c936d5ceb",
        requestedEndMonth: "2026-01",
        reason: "Tôi cần chuyển đi nơi khác do công việc",
      });

      if (response.code === 201) {
        console.log("Success:", response.data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleGetTerminations = async () => {
    try {
      const response = await contractService.getTerminationRequestsByContractId(
        "6f81d431-3a3c-467a-853a-ac6c936d5ceb"
      );

      if (response.code === 200) {
        console.log("Terminations:", response.data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleRespondToTermination = async (requestId: string) => {
    try {
      const response = await contractService.respondToTerminationRequest(
        requestId,
        {
          status: "APPROVED",
          responseNote: "Tôi đồng ý hủy hợp đồng",
        }
      );

      if (response.code === 200) {
        console.log("Response sent:", response.data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <button onClick={handleCreateTermination}>Create Termination</button>
      <button onClick={handleGetTerminations}>Get Terminations</button>
      <button onClick={() => handleRespondToTermination("request-id")}>
        Respond to Termination
      </button>
    </div>
  );
}

// Import cần thiết
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  ContractTerminationDialog,
  ContractTerminationList,
} from "@/components/contracts";
import { contractService } from "@/lib/api/services/contract";
