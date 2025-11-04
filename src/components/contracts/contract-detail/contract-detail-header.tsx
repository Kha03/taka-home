"use client";
import { Card, CardHeader } from "@/components/ui/card";
import { Calendar, CheckCircle, AlertCircle } from "lucide-react";
import type { Booking } from "@/lib/api/services/booking";
import { useMemo } from "react";

interface ContractDetailHeaderProps {
  booking: Booking;
  userRole: string;
}

function getStatusConfig(status: Booking["status"], userRole: string) {
  switch (status) {
    case "ACTIVE":
      return {
        bg: "bg-[#00AE26]/20",
        icon: <CheckCircle className="w-8 h-8 text-green-600" />,
        text: "Còn hiệu lực",
        description: "Hợp đồng đang hoạt động bình thường",
      };
    case "DUAL_ESCROW_FUNDED":
      return {
        bg: "bg-[#00AE26]/20",
        icon: <CheckCircle className="w-8 h-8 text-green-600" />,
        text: "Còn hiệu lực",
        description: "Hợp đồng đang hoạt động bình thường",
      };
    case "PENDING_SIGNATURE":
      return {
        bg: "bg-[#FFA500]/20",
        icon: <Calendar className="w-8 h-8 text-orange-600" />,
        text: "Chờ ký",
        description: "Đang chờ ký hợp đồng",
      };
    case "PENDING_LANDLORD":
      return {
        bg: "bg-[#818181]/10",
        icon: <Calendar className="w-8 h-8 text-gray-600" />,
        text: userRole === "LANDLORD" ? "Chờ ký" : "Chờ duyệt",
        description:
          userRole === "LANDLORD"
            ? "Vui lòng xem xét và ký hợp đồng"
            : "Đang chờ chủ nhà duyệt",
      };
    case "AWAITING_DEPOSIT":
      return {
        bg: "bg-[#3B82F6]/20",
        icon: <AlertCircle className="w-8 h-8 text-blue-600" />,
        text: "Chờ đặt cọc",
        description: "Cần đặt cọc để kích hoạt hợp đồng",
      };
    case "ESCROW_FUNDED_T":
      return {
        bg: "bg-[#9333EA]/20",
        icon: <AlertCircle className="w-8 h-8 text-purple-600" />,
        text: userRole === "LANDLORD" ? "Chờ đặt cọc" : "Chờ chủ nhà",
        description:
          userRole === "LANDLORD"
            ? "Đến lượt bạn đặt cọc"
            : "Đang chờ chủ nhà đặt cọc",
      };
    case "READY_FOR_HANDOVER":
      return {
        bg: "bg-[#10B981]/20",
        icon: <CheckCircle className="w-8 h-8 text-emerald-600" />,
        text: "Sẵn sàng bàn giao",
        description:
          userRole === "LANDLORD"
            ? "Vui lòng xác nhận bàn giao"
            : "Chờ chủ nhà xác nhận bàn giao",
      };
    case "REJECTED":
      return {
        bg: "bg-[#FA0000]/10",
        icon: <AlertCircle className="w-8 h-8 text-red-600" />,
        text: "Đã từ chối",
        description: "Yêu cầu thuê đã bị từ chối",
      };
    case "ESCROW_FUNDED_L":
      return {
        bg: "bg-[#9333EA]/20",
        icon: <AlertCircle className="w-8 h-8 text-purple-600" />,
        text: userRole === "TENANT" ? "Chờ đặt cọc" : "Chờ người thuê",
        description:
          userRole === "TENANT"
            ? "Đến lượt bạn đặt cọc"
            : "Đang chờ người thuê đặt cọc",
      };
    case "TERMINATED":
      return {
        bg: "bg-[#6B7280]/20",
        icon: <AlertCircle className="w-8 h-8 text-gray-600" />,
        text: "Đã kết thúc",
        description: "Hợp đồng đã hết hiệu lực",
      };
    case "CANCELLED":
      return {
        bg: "bg-[#EF4444]/20",
        icon: <AlertCircle className="w-8 h-8 text-red-600" />,
        text: "Đã hủy",
        description: "Hợp đồng đã bị hủy",
      };
    case "SETTLEMENT_PENDING":
      return {
        bg: "bg-[#F59E0B]/20",
        icon: <AlertCircle className="w-8 h-8 text-amber-600" />,
        text: "Chờ thanh toán",
        description: "Đang chờ thanh toán cuối kỳ",
      };
    case "SETTLED":
      return {
        bg: "bg-[#10B981]/20",
        icon: <CheckCircle className="w-8 h-8 text-emerald-600" />,
        text: "Đã thanh toán",
        description: "Đã hoàn tất thanh toán",
      };
    default:
      return {
        bg: "bg-gray-100",
        icon: <Calendar className="w-8 h-8 text-gray-600" />,
        text: "Không xác định",
        description: "",
      };
  }
}

export function ContractDetailHeader({
  booking,
  userRole,
}: ContractDetailHeaderProps) {
  const statusConfig = useMemo(
    () => getStatusConfig(booking.status, userRole),
    [booking.status, userRole]
  );

  return (
    <Card className="bg-primary-foreground shadow-sm rounded-2xl border-none">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary mb-2">
              Chi tiết hợp đồng
            </h1>
            <div className="flex items-center gap-4 text-sm text-[#4f4f4f]">
              <span className="bg-secondary text-primary font-bold px-4 py-2 rounded-full">
                {booking.contract?.contractCode || booking.id}
              </span>
              <span>•</span>
              <span>
                Người thuê:{" "}
                <strong className="text-secondary">
                  {booking.tenant.fullName}
                </strong>
              </span>
              <span>•</span>
              <span>
                Chủ nhà:{" "}
                <strong className="text-secondary">
                  {booking.property.landlord.fullName}
                </strong>
              </span>
            </div>
          </div>
          <div
            className={`${statusConfig.bg} min-w-[160px] rounded-[10px] p-6 flex flex-col items-center justify-center`}
          >
            {statusConfig.icon}
            <p className="text-sm font-medium mt-2">{statusConfig.text}</p>
            {statusConfig.description && (
              <p className="text-xs text-center mt-1 text-muted-foreground">
                {statusConfig.description}
              </p>
            )}
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
