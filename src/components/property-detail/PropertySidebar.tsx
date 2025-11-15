/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { Phone, Star, Send, MessageCircleMore } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LandlordAndTenant } from "@/lib/api";
import { chatService } from "@/lib/api/services/chat";
import { bookingService } from "@/lib/api/services/booking";
import { statisticsService } from "@/lib/api/services";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

interface Review {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  time: string;
  content: string;
}
interface UnitForApartment {
  unit: string;
  floor?: number;
  block?: string;
  propertyType?: "APARTMENT" | "HOUSING"; // Thêm để phân biệt loại property
}
interface PropertySidebarProps {
  landlord: LandlordAndTenant;
  units: string[];
  unitForApartment?: UnitForApartment;
  propertyCount?: number;
  contractCount?: number;
  yearsActive?: number;
  propertyId: string; // ID của property (apartment hoặc boarding)
  propertyType: "apartment" | "boarding"; // Type của property
  roomsData?: Array<{ id: string; name: string }>; // Danh sách rooms với ID cho boarding
  isRented?: boolean; // Check if apartment is currently rented (isVisible = false, isVisible = true means available)
}

export function PropertySidebar({
  landlord,
  units,
  unitForApartment,
  propertyCount = 22,
  contractCount = 45,
  yearsActive = 1,
  propertyId,
  propertyType,
  roomsData = [],
  isRented = false,
}: PropertySidebarProps) {
  const [selectedUnit, setSelectedUnit] = useState<string>("");
  const [reviewText, setReviewText] = useState("");
  const [userRating, setUserRating] = useState<number>(0);
  const [hoveredStar, setHoveredStar] = useState<number>(0);
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [isCreatingBooking, setIsCreatingBooking] = useState(false);

  // State cho landlord statistics
  const [landlordStats, setLandlordStats] = useState({
    totalProperties: propertyCount,
    totalBooking: contractCount,
    yearsOfParticipation: yearsActive.toString(),
  });
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  const t = useTranslations("propertyDetail");
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  // Fetch landlord statistics khi component mount
  useEffect(() => {
    const fetchLandlordStats = async () => {
      if (!landlord?.id) return;

      try {
        setIsLoadingStats(true);
        const response = await statisticsService.getLandlordStatistics(
          landlord.id
        );

        if (response.data) {
          setLandlordStats({
            totalProperties: response.data.totalProperties,
            totalBooking: response.data.totalBooking,
            yearsOfParticipation: response.data.yearsOfParticipation,
          });
        }
      } catch (error) {
        console.error("Error fetching landlord statistics:", error);
        // Giữ nguyên giá trị mặc định nếu có lỗi
      } finally {
        setIsLoadingStats(false);
      }
    };

    fetchLandlordStats();
  }, [landlord?.id]);

  const handleStartChat = async () => {
    // Kiểm tra đăng nhập
    if (!isAuthenticated || !user) {
      toast.error(t("loginRequired"), t("loginToChat"));
      router.push(
        `/signin?from=${encodeURIComponent(window.location.pathname)}`
      );
      return;
    }

    // Không cho phép chat với chính mình
    if (user.id === landlord.id) {
      toast.error(t("cannotSendRequest"), t("cannotChatSelf"));
      return;
    }

    try {
      setIsCreatingChat(true);

      // Gọi API tạo chatroom
      const response = await chatService.startChatForProperty(propertyId);

      if ((response.code === 201 || response.code === 200) && response.data) {
        // Lấy chatroom từ response
        const chatroom = response.data;

        toast.success(t("success"), t("chatCreated"));

        // Chuyển đến trang chat với chatroomId
        router.push(`/chat?roomId=${chatroom.id}`);
      } else {
        toast.error(t("error"), response.message || t("cannotCreateChat"));
      }
    } catch (error) {
      console.error("Error creating chat:", error);
      toast.error(t("error"), t("chatError"));
    } finally {
      setIsCreatingChat(false);
    }
  };

  const handleCreateBooking = async () => {
    // Kiểm tra đăng nhập
    if (!isAuthenticated || !user) {
      toast.error(t("loginRequired"), t("loginToRent"));
      router.push(
        `/signin?from=${encodeURIComponent(window.location.pathname)}`
      );
      return;
    }

    // Không cho phép tự thuê nhà của mình
    if (user.id === landlord.id) {
      toast.error(t("cannotSendRequest"), t("cannotRentOwnProperty"));
      return;
    }

    // Kiểm tra chọn phòng cho boarding
    if (propertyType === "boarding") {
      if (!selectedUnit) {
        toast.warning(t("pleaseSelectRoom"), t("selectRoomBeforeRequest"));
        return;
      }
    }

    try {
      setIsCreatingBooking(true);

      // Chuẩn bị data để gửi API
      let bookingData: { propertyId?: string; roomId?: string };

      if (propertyType === "boarding") {
        // BOARDING: Tìm roomId từ selectedUnit và chỉ gửi roomId
        const selectedRoom = roomsData.find(
          (room) => room.name === selectedUnit
        );
        const roomId = selectedRoom?.id;

        if (!roomId) {
          toast.error(t("error"), t("roomNotFound"));
          return;
        }

        bookingData = { roomId };
      } else {
        // APARTMENT: Chỉ gửi propertyId
        bookingData = { propertyId };
      }

      // Gọi API tạo booking
      const response = await bookingService.createBooking(bookingData);

      if ((response.code === 201 || response.code === 200) && response.data) {
        toast.success(t("success"), t("requestSentSuccess"));

        // Reset selected unit
        setSelectedUnit("");

        // Optional: Chuyển hướng đến trang rental requests
        // router.push("/rental-requests");
      } else {
        toast.error(t("error"), response.message || t("cannotSendRequest"));
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error(t("error"), t("errorSendingRequest"));
    } finally {
      setIsCreatingBooking(false);
    }
  };

  const reviews: Review[] = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      avatar: "/diverse-user-avatars.png",
      rating: 5,
      time: "2 ngày trước",
      content:
        "Phòng trọ rất tốt, chủ nhà nhiệt tình. Khu vực yên tĩnh, an ninh tốt.",
    },
    {
      id: 2,
      name: "Trần Thị B",
      avatar: "/diverse-user-avatars.png",
      rating: 5,
      time: "1 tuần trước",
      content: "Giá cả hợp lý, phòng sạch sẽ. Đầy đủ tiện nghi, rất hài lòng.",
    },
    {
      id: 3,
      name: "Lê Văn C",
      avatar: "/diverse-user-avatars.png",
      rating: 4,
      time: "2 tuần trước",
      content: "Vị trí thuận tiện, gần chợ và trường học. Recommend!",
    },
  ];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-3">
      {/* Agent Profile */}
      <Card className="bg-primary-foreground p-5">
        <CardContent className="p-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-11 w-11">
                <AvatarImage
                  src={landlord.avatarUrl || "/vietnamese-woman-realtor.jpg"}
                />
                <AvatarFallback>
                  {getInitials(landlord.fullName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-primary">
                  {landlord.fullName}
                </h3>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-muted-foreground">
                    {t("online")}
                  </span>
                </div>
              </div>
            </div>
            <Button
              className="bg-secondary hover:bg-secondary/90"
              onClick={handleStartChat}
              disabled={isCreatingChat}
            >
              <MessageCircleMore className="h-4 w-4" />
              {isCreatingChat ? t("creating") : t("chatNow")}
            </Button>
          </div>
          <div className="flex items-center gap-2 mb-5 ml-14">
            <div className="bg-secondary w-5 h-5 flex items-center justify-center rounded-full">
              <Phone className="h-3 w-3 text-primary-foreground" />
            </div>
            <span className="text-sm">
              {t("phoneNumber")}: {landlord.phone}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4 border-dashed p-5 border rounded-[12px] border-[#ccc]">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                {isLoadingStats ? (
                  <div className="h-8 w-12 bg-neutral-200 animate-pulse rounded"></div>
                ) : (
                  <span className="text-2xl font-bold text-primary">
                    {landlordStats.totalProperties}
                  </span>
                )}
                <img src={"/assets/icons/house-icon.svg"} alt="Property Icon" />
              </div>
              <div className="text-xs text-primary">{t("properties")}</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                {isLoadingStats ? (
                  <div className="h-8 w-12 bg-neutral-200 animate-pulse rounded"></div>
                ) : (
                  <span className="text-2xl font-bold text-primary">
                    {landlordStats.totalBooking}
                  </span>
                )}
                <img
                  src="/assets/icons/contract-icon.svg"
                  alt="Contract Icon"
                />
              </div>
              <div className="text-xs text-primary">{t("contracts")}</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                {isLoadingStats ? (
                  <div className="h-8 w-12 bg-neutral-200 animate-pulse rounded"></div>
                ) : (
                  <span className="text-2xl font-bold text-primary">
                    {landlordStats.yearsOfParticipation}
                  </span>
                )}
                <img src="/assets/icons/calendar-icon.svg" alt="Year Icon" />
              </div>
              <div className="text-xs text-primary">{t("yearsActive")}</div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-primary-foreground p-5">
        <CardContent className="p-0">
          {/* Rental Inquiry */}
          <div className="space-y-3 text-center">
            <h4 className="font-bold text-lg text-primary">
              {t("sendRentalRequest")}
              <span className="text-sm font-normal text-muted-foreground block">
                {t("selectRoom")}
              </span>
            </h4>
            {unitForApartment ? (
              // Display apartment unit info
              <div className="space-y-3">
                <div className="bg-muted/50 rounded-lg p-4 border border-border">
                  <p className="text-sm text-muted-foreground mb-2">
                    {unitForApartment.propertyType === "HOUSING"
                      ? t("housingInfo")
                      : t("apartmentInfo")}
                  </p>
                  <div className="space-y-1">
                    {unitForApartment.block &&
                      unitForApartment.propertyType !== "HOUSING" && (
                        <p className="text-base font-semibold text-primary">
                          {t("building")}: {unitForApartment.block}
                        </p>
                      )}
                    {unitForApartment.floor && (
                      <p className="text-base font-semibold text-primary">
                        {unitForApartment.propertyType === "HOUSING"
                          ? `${t("floors")}: ${unitForApartment.floor}`
                          : `${t("floor")}: ${unitForApartment.floor}`}
                      </p>
                    )}
                    {unitForApartment.unit && (
                      <p className="text-base font-semibold text-primary">
                        {unitForApartment.propertyType === "HOUSING"
                          ? `${t("houseCode")}: ${unitForApartment.unit}`
                          : `${t("apartment")}: ${unitForApartment.unit}`}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              // Display room selection for boarding
              <div className="grid grid-cols-6 gap-2">
                {units.map((unit) => (
                  <Button
                    key={unit}
                    size="sm"
                    onClick={() => setSelectedUnit(unit)}
                    className={`text-xs w-14 h-7 text-[#4f4f4f] bg-[#e5e5e5] border-none hover:bg-accent rounded-[30px] ${
                      selectedUnit === unit ? "bg-secondary text-white " : ""
                    }`}
                  >
                    {unit}
                  </Button>
                ))}
              </div>
            )}

            <Button
              className="w-33 bg-secondary hover:bg-secondary/90"
              onClick={handleCreateBooking}
              disabled={isCreatingBooking || isRented}
            >
              <Send className="h-4 w-4 mr-2" />
              {isCreatingBooking ? t("sending") : t("rentalRequest")}
            </Button>

            {/* Thông báo khi đang cho thuê */}
            {isRented && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
                <p className="text-sm text-yellow-700 font-medium">
                  {t("currentlyRented")}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Reviews Section */}
      <Card className="bg-primary-foreground p-5">
        <CardContent className="p-0">
          <p className="font-semibold text-primary mb-4 text-center">
            {t("reviewsFrom")} (12)
          </p>

          <div className="flex items-center gap-2 mb-3 justify-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-5 w-5 cursor-pointer transition-colors ${
                  star <= (hoveredStar || userRating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-gray-200 text-gray-200"
                }`}
                onClick={() => setUserRating(star)}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
              />
            ))}
          </div>

          <div className="flex items-center gap-2 mb-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src="/diverse-user-avatars.png" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <Textarea
              placeholder={t("writeReview")}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="flex-1"
            />
            <Button
              size="icon"
              className="bg-secondary hover:bg-secondary/90 w-9 h-9 rounded-full"
            >
              <Send className="h-4 w-4 rotate-40 transform translate-x-[-2px]" />
            </Button>
          </div>

          <ScrollArea className="max-h-[860px] h-[520px] pr-2">
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="flex gap-3 pb-4 border-b border-muted"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={review.avatar || "/placeholder.svg"} />
                    <AvatarFallback>NT</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-sm text-primary">
                        {review.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        • {review.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className="h-3 w-3 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {review.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
