"use client";

import { useState, useMemo, useEffect } from "react";
import StatusTab from "@/components/ui/status-tab";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { PropertyRoom } from "@/components/myproperties/PropertyRoom";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  bookingService,
  type Booking,
  signingOption,
} from "@/lib/api/services/booking";
import { toast } from "sonner";
import { BookingApprovalDialog } from "@/components/rental-requests/booking-approval-dialog";

type RentalRequestStatus = "all" | "pending" | "approved" | "rejected";

export default function RentalRequestsPage() {
  const [activeTab, setActiveTab] = useState<RentalRequestStatus>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [bookingToReject, setBookingToReject] = useState<string | null>(null);
  const [rejecting, setRejecting] = useState(false);
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [bookingToApprove, setBookingToApprove] = useState<Booking | null>(
    null
  );

  const PAGE_SIZE = 4;

  // Fetch ALL bookings once when component mounts
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        // Lấy TẤT CẢ bookings (không có condition) để tính toán số lượng chính xác cho các tab
        const response = await bookingService.getMyBookings();

        if (response.data) {
          setBookings(response.data);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
        toast.error("Không thể tải danh sách yêu cầu thuê");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []); // Chỉ fetch một lần khi mount

  // Xử lý mở dialog xác nhận từ chối
  const handleRejectClick = (bookingId: string) => {
    setBookingToReject(bookingId);
    setRejectDialogOpen(true);
  };

  // Xử lý mở dialog duyệt booking
  const handleApproveClick = (bookingId: string) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (booking) {
      setBookingToApprove(booking);
      setApprovalDialogOpen(true);
    }
  };

  // Xử lý duyệt booking
  const handleApproveBooking = async (
    bookingId: string,
    method: signingOption
  ) => {
    try {
      const response = await bookingService.approveBooking(bookingId, method);

      if (response.data) {
        toast.success(
          "Duyệt yêu cầu thuê thành công! Vui lòng đợi người thuê xác nhận hợp đồng."
        );

        // Refresh bookings
        const bookingsResponse = await bookingService.getMyBookings();
        if (bookingsResponse.data) {
          setBookings(bookingsResponse.data);
        }

        // Return updated booking data
        return response.data;
      }
    } catch (error) {
      console.error("Error approving booking:", error);
      toast.error("Không thể duyệt yêu cầu thuê. Vui lòng thử lại");
      throw error;
    }
  };

  // Xử lý từ chối booking
  const handleRejectBooking = async () => {
    if (!bookingToReject) return;

    try {
      setRejecting(true);
      await bookingService.rejectBooking(bookingToReject);

      toast.success("Đã từ chối yêu cầu thuê thành công");

      // Refresh bookings
      const response = await bookingService.getMyBookings();
      if (response.data) {
        setBookings(response.data);
      }

      setRejectDialogOpen(false);
      setBookingToReject(null);
    } catch (error) {
      console.error("Error rejecting booking:", error);
      toast.error("Không thể từ chối yêu cầu thuê. Vui lòng thử lại");
    } finally {
      setRejecting(false);
    }
  };

  // Xử lý hủy dialog
  const handleCancelReject = () => {
    setRejectDialogOpen(false);
    setBookingToReject(null);
  };

  // Filter bookings based on tab
  const filteredBookings = useMemo(() => {
    if (activeTab === "all") {
      return bookings;
    }

    return bookings.filter((booking) => {
      switch (activeTab) {
        case "pending":
          return booking.status === "PENDING_LANDLORD";
        case "approved":
          // Tất cả status ngoài PENDING_LANDLORD, REJECTED, CANCELLED đều là đã duyệt
          return (
            booking.status !== "PENDING_LANDLORD" &&
            booking.status !== "REJECTED" &&
            booking.status !== "CANCELLED"
          );
        case "rejected":
          return booking.status === "REJECTED";
        default:
          return true;
      }
    });
  }, [bookings, activeTab]);

  // Update tab counts
  const tabsWithCounts = useMemo(() => {
    const allCount = bookings.length;
    const pendingCount = bookings.filter(
      (b) => b.status === "PENDING_LANDLORD"
    ).length;
    // Đã duyệt = tất cả status ngoài PENDING_LANDLORD, REJECTED, CANCELLED
    const approvedCount = bookings.filter(
      (b) =>
        b.status !== "PENDING_LANDLORD" &&
        b.status !== "REJECTED" &&
        b.status !== "CANCELLED"
    ).length;
    const rejectedCount = bookings.filter(
      (b) => b.status === "REJECTED"
    ).length;

    return [
      { id: "all", label: "Tất cả", count: allCount },
      { id: "pending", label: "Chờ duyệt", count: pendingCount },
      { id: "approved", label: "Đã duyệt", count: approvedCount },
      { id: "rejected", label: "Đã từ chối", count: rejectedCount },
    ];
  }, [bookings]);

  // Pagination
  const totalPages = Math.ceil(filteredBookings.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedBookings = filteredBookings.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  // Reset pagination when tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  // Convert booking to PropertyRoom props
  const bookingToPropertyRoom = (booking: Booking) => {
    const property = booking.property;
    const room = booking.room; // Chỉ có khi type = BOARDING
    const roomType = room?.roomType;

    // Map booking status to rental request status
    const mapStatus = (status: string): "pending" | "approved" | "rejected" => {
      if (status === "PENDING_LANDLORD") return "pending";
      if (status === "REJECTED") return "rejected";
      // Tất cả status khác (ngoài PENDING_LANDLORD, REJECTED, CANCELLED) là đã duyệt
      if (status !== "CANCELLED") return "approved";
      return "rejected"; // CANCELLED cũng hiển thị như rejected
    };

    // Lấy thông tin tùy theo loại property
    // APARTMENT: Lấy trực tiếp từ property
    // BOARDING: Lấy từ room.roomType
    const isBoarding = property.type === "BOARDING";

    const roomCode = room?.name;
    const roomTypeName = roomType?.name; // Tên loại phòng (VD: "Loại 1", "Loại 2")
    const bedrooms = isBoarding
      ? roomType?.bedrooms || 0
      : property.bedrooms || 0;
    const bathrooms = isBoarding
      ? roomType?.bathrooms || 0
      : property.bathrooms || 0;
    const area = isBoarding
      ? roomType
        ? parseFloat(roomType.area)
        : 0
      : property.area || 0;
    const furnishing = isBoarding
      ? roomType?.furnishing || "Chưa có thông tin"
      : property.furnishing || "Chưa có thông tin";
    const price = isBoarding
      ? parseFloat(roomType?.price || "0")
      : property.price || 0;
    const heroImage =
      (isBoarding ? roomType?.heroImage : null) ||
      property.heroImage ||
      "/placeholder.svg";

    return {
      id: booking.id,
      title: property.title,
      image: heroImage,
      roomCode: roomCode,
      bedrooms: bedrooms,
      bathrooms: bathrooms,
      area: area,
      address: `${property.address}, ${property.ward}, ${property.province}`,
      furnitureStatus: furnishing,
      category:
        property.type === "APARTMENT"
          ? "Chung cư"
          : property.type === "HOUSING"
          ? "Nhà riêng"
          : "Nhà trọ",
      price: price,
      currency: "VND",
      roomType: roomTypeName, // Loại phòng (VD: "Loại 1", "Loại 2") cho phòng trọ
      showRentalStatus: true,
      rentalRequests: [
        {
          user: {
            name: booking.tenant.fullName,
            avatar: booking.tenant.avatarUrl || "/placeholder.svg",
            phone: booking.tenant.phone,
          },
          status: mapStatus(booking.status),
          timestamp: new Date(booking.createdAt).toLocaleDateString("vi-VN"),
        },
      ],
      onRejectRequest: () => handleRejectClick(booking.id),
      onApproveRequest: () => handleApproveClick(booking.id),
    };
  };

  return (
    <div className="min-h-screen bg-[#FFF7E9] p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Status Tabs */}
        <div className="mb-6">
          <StatusTab
            tabs={tabsWithCounts}
            activeTab={activeTab}
            setActiveTab={(tab: string) =>
              setActiveTab(tab as RentalRequestStatus)
            }
          />
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <LoadingSpinner size="xl" text="Đang tải..." />
          </div>
        ) : paginatedBookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không tìm thấy yêu cầu nào
            </h3>
            <p className="text-gray-500">
              Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
            </p>
          </div>
        ) : (
          <>
            {/* Rental Request Properties List */}
            <div className="space-y-4">
              {paginatedBookings.map((booking) => (
                <PropertyRoom
                  key={booking.id}
                  {...bookingToPropertyRoom(booking)}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination>
                  <PaginationContent>
                    {currentPage > 1 && (
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setCurrentPage(currentPage - 1)}
                          className="cursor-pointer"
                        />
                      </PaginationItem>
                    )}

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => setCurrentPage(page)}
                            isActive={currentPage === page}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    )}

                    {currentPage < totalPages && (
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setCurrentPage(currentPage + 1)}
                          className="cursor-pointer"
                        />
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </div>

      {/* Confirmation Dialog for Reject */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận từ chối</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn từ chối yêu cầu thuê này không? Hành động
              này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCancelReject}
              disabled={rejecting}
              className="text-primary"
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleRejectBooking}
              disabled={rejecting}
            >
              {rejecting ? "Đang xử lý..." : "Từ chối"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approval Dialog with PDF Preview */}
      <BookingApprovalDialog
        open={approvalDialogOpen}
        onOpenChange={setApprovalDialogOpen}
        booking={bookingToApprove}
        onConfirmApprove={handleApproveBooking}
      />
    </div>
  );
}
