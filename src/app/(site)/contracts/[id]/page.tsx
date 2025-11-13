"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { bookingService, type Booking } from "@/lib/api/services/booking";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText } from "lucide-react";
import { toast } from "sonner";
import { ContractDetailHeader } from "@/components/contracts/contract-detail/contract-detail-header";
import { ContractDetailInfo } from "@/components/contracts/contract-detail/contract-detail-info";
import { ContractDetailActions } from "@/components/contracts/contract-detail/contract-detail-actions";
import { ContractDetailInvoices } from "@/components/contracts/contract-detail/contract-detail-invoices";
import { ContractDetailExtensions } from "@/components/contracts/contract-detail";
import { ContractLiquidationAlert } from "@/components/contracts/contract-detail";
import { ContractTerminationSection } from "@/components/contracts";
import { Card, CardContent } from "@/components/ui/card";

export default function ContractDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.id as string;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>("TENANT");
  const [currentUserId, setCurrentUserId] = useState<string>("");

  useEffect(() => {
    const fetchBookingDetail = async () => {
      try {
        setLoading(true);

        // Get user role from localStorage
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          const roles = userData.roles || [];
          const userId = userData.id || "";

          setUserRole(roles[0] || "TENANT");
          setCurrentUserId(userId);
        } // Fetch booking detail
        const response = await bookingService.getBookingById(bookingId);
        if (response.data) {
          setBooking(response.data);
        } else {
          toast.error("Không tìm thấy thông tin hợp đồng");
          router.push("/contracts");
        }
      } catch (error) {
        console.error("Error fetching booking detail:", error);
        toast.error("Không thể tải thông tin hợp đồng");
        router.push("/contracts");
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) {
      void fetchBookingDetail();
    }
  }, [bookingId, router]);

  const handleRefresh = async () => {
    try {
      const response = await bookingService.getBookingById(bookingId);
      if (response.data) {
        setBooking(response.data);
      }
    } catch (error) {
      console.error("Error refreshing booking:", error);
      toast.error("Không thể tải lại thông tin hợp đồng");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF7E9] flex items-center justify-center">
        <LoadingSpinner size="xl" text="Đang tải thông tin hợp đồng..." />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-[#FFF7E9] flex items-center justify-center">
        <Card className="bg-primary-foreground p-8">
          <CardContent>
            <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2 text-center">
              Không tìm thấy hợp đồng
            </h3>
            <p className="text-gray-500 text-center mb-4">
              Hợp đồng không tồn tại hoặc đã bị xóa
            </p>
            <Button
              variant="link"
              onClick={() => router.push("/contracts")}
              className="w-full"
            >
              Quay lại danh sách hợp đồng
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF7E9] p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Back Button */}
        <Button
          variant="link"
          onClick={() => router.push("/contracts")}
          className="mb-4 text-primary hover:text-primary/80"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại danh sách hợp đồng
        </Button>

        {/* Contract Header */}
        <ContractDetailHeader booking={booking} userRole={userRole} />

        {/* Contract Information */}
        <ContractDetailInfo booking={booking} />

        {/* Liquidation Alert - Show in last 7 days of contract for landlord */}
        {booking.contract && booking.status === "ACTIVE" && (
          <ContractLiquidationAlert
            contractId={booking.contract.id}
            contractEndDate={booking.contract.endDate}
            propertyType={
              booking.property.type as "APARTMENT" | "BOARDING" | "HOUSING"
            }
            userRole={userRole}
            onInvoiceCreated={handleRefresh}
          />
        )}

        {/* Contract Actions */}
        <ContractDetailActions
          booking={booking}
          userRole={userRole}
          onRefresh={handleRefresh}
        />

        {/* Contract Invoices */}
        {booking.contract && (
          <ContractDetailInvoices
            contractId={booking.contract.id}
            bookingStatus={booking.status}
            userRole={userRole}
            propertyType={
              booking.property.type as "APARTMENT" | "BOARDING" | "HOUSING"
            }
          />
        )}

        {/* Contract Extensions */}
        {booking.contract &&
          (booking.status === "ACTIVE" ||
            booking.status === "TERMINATED" ||
            booking.status === "SETTLED" ||
            booking.status === "SETTLEMENT_PENDING" ||
            booking.status === "CANCELLED") && (
            <ContractDetailExtensions
              contractId={booking.contract.id}
              userRole={userRole}
              endDate={booking.contract.endDate}
              requiredDeposit={
                booking.room
                  ? parseFloat(booking.room.roomType.deposit)
                  : parseFloat(booking.property.deposit || "0")
              }
            />
          )}

        {/* Contract Termination */}
        {booking.contract && booking.status === "ACTIVE" && (
          <ContractTerminationSection
            contractId={booking.contract.id}
            contractEndDate={booking.contract.endDate}
            currentUserId={currentUserId}
            currentUserRole={userRole === "LANDLORD" ? "LANDLORD" : "TENANT"}
            contractStatus={booking.status}
          />
        )}
      </div>
    </div>
  );
}
