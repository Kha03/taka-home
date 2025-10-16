import { PropertyRoomBadge } from "@/components/myproperties/property-room-badge";
import { PropertyStatusBadge } from "@/components/myproperties/property-status-badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils/utils";
import { MapPin } from "lucide-react";
import Image from "next/image";
import { PropertyDetails } from "../property-detail/PropertyDetails";
import { RentalRequestStatus } from "../rental-requests";

export interface PropertyRoomProps {
  id: string;
  title: string;
  image: string;
  status?: string;
  roomCode?: string;
  roomType?: string; // Loại phòng cho boarding house
  isRented?: boolean;
  bedrooms: number;
  bathrooms: number;
  area: number;
  address: string;
  furnitureStatus: string;
  category: string;
  price: number;
  currency?: string;
  showRentalStatus?: boolean;
  rentalRequests?: Array<{
    user: {
      name: string;
      avatar: string;
      phone?: string;
    };
    status: "pending" | "approved" | "rejected";
    reason?: string;
    timestamp: string;
  }>;
  onApproveRequest?: (requestIndex: number) => void;
  onRejectRequest?: (requestIndex: number) => void;
}

export function PropertyRoom({
  title,
  image,
  status,
  roomCode,
  roomType,
  isRented = false,
  bedrooms,
  bathrooms,
  area,
  address,
  furnitureStatus,
  category,
  price,
  currency = "VND",
  showRentalStatus = false,
  rentalRequests = [],
  onApproveRequest,
  onRejectRequest,
}: PropertyRoomProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow p-3 bg-primary-foreground">
      <div className="flex flex-col md:flex-row gap-3">
        {/* Image Section */}
        <div className="relative w-full md:w-54 md:h-33 flex-shrink-0 rounded-[8px] overflow-hidden">
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 216px"
          />
          {status && <PropertyStatusBadge status={status} />}
        </div>
        {/* Content Section */}
        <div className="flex-1">
          <div className="flex justify-between items-center">
            {/* Room Code Badge */}
            <div>
              {roomCode && (
                <div className="mb-1.5 flex items-center gap-2">
                  <PropertyRoomBadge roomCode={roomCode} isRented={isRented} />
                  {/* Room Type Badge - Chỉ hiển thị cho boarding house */}
                  {roomType && (
                    <div className="px-2 py-1 bg-accent/80 rounded text-xs font-medium text-primary">
                      <span>{roomType}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Title */}
              <h3 className="text-lg font-bold mb-2 text-primary">{title}</h3>

              {/* Property Details */}
              <div className="flex mb-3">
                <PropertyDetails
                  bedrooms={bedrooms}
                  bathrooms={bathrooms}
                  area={area}
                />
              </div>

              {/* Address */}
              <div className="flex items-center gap-1 text-sm text-[#4f4f4f]">
                <div className="w-6 h-6 rounded-full bg-[#e5e5e5] flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <span>{address}</span>
              </div>
            </div>
            {/* right Section */}
            <div className="flex flex-col">
              {/* Furniture Status and Category - Horizontal Layout */}
              <div className="flex items-center gap-3 mb-2">
                <div className="text-center p-3 border border-dashed rounded-lg border-[#e5e5e5]">
                  <div className="text-xs text-[#8d8d8d]">
                    Tình trạng nội thất
                  </div>
                  <div className="font-medium text-primary">
                    {furnitureStatus}
                  </div>
                </div>
                <div className="text-center p-3 border border-dashed rounded-lg border-[#e5e5e5]">
                  <div className="text-xs text-[#8d8d8d]">Danh mục</div>
                  <div className="font-medium text-primary">{category}</div>
                </div>
              </div>

              {/* Price */}
              <div className=" flex bg-[#f5f5f5] rounded-2xl py-2 justify-center">
                <div className="text-sm text-muted-foreground">Giá thuê:</div>
                <div
                  className={cn("text-sm font-bold ml-1 text-secondary", {
                    "text-[#00AE26]": isRented,
                  })}
                >
                  {price.toLocaleString("vi-VN")} VND
                </div>
              </div>
            </div>
          </div>
          {showRentalStatus && rentalRequests.length > 0 && (
            <div className="mt-4 space-y-2">
              {rentalRequests.map((request, index) => (
                <RentalRequestStatus
                  key={index}
                  user={request.user}
                  status={request.status}
                  reason={request.reason}
                  timestamp={request.timestamp}
                  onApprove={() => onApproveRequest?.(index)}
                  onReject={() => onRejectRequest?.(index)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
