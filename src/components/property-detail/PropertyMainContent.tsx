"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Building, Clock, MapPin } from "lucide-react";
import { PropertyDetails } from "./PropertyDetails";
import type { Property, RoomTypeDetail } from "@/lib/api/types";

interface PropertyMainContentProps {
  property: Property | RoomTypeDetail;
  type?: string;
}

export function PropertyMainContent({ property }: PropertyMainContentProps) {
  // Helper function to check if property is RoomTypeDetail
  const isRoomTypeDetail = (
    prop: Property | RoomTypeDetail
  ): prop is RoomTypeDetail => {
    return (
      "rooms" in prop && Array.isArray(prop.rooms) && prop.rooms.length > 0
    );
  };

  // Get data based on type
  const getData = () => {
    if (isRoomTypeDetail(property)) {
      // BOARDING data
      const propertyInfo = property.rooms[0]?.property;
      return {
        title: propertyInfo?.title || "Phòng trọ",
        price: Number(property.price) || 0,
        location: `${propertyInfo?.address || ""}, ${
          propertyInfo?.ward || ""
        }, ${propertyInfo?.province || ""}`,
        bedrooms: property.bedrooms || 0,
        bathrooms: property.bathrooms || 0,
        area: Number(property.area) || 0,
        furnishing: property.furnishing || "Không có thông tin",
        category: "Phòng trọ",
        roomTypeName: property.name,
        roomCount: property.rooms?.filter((r) => r.isVisible).length || 0,
        electricityPrice: Number(propertyInfo?.electricityPricePerKwh) || 0,
        waterPrice: Number(propertyInfo?.waterPricePerM3) || 0,
        updatedAt: property.updatedAt,
      };
    } else {
      // APARTMENT data
      return {
        title: property.title || "Bất động sản",
        price: property.price || 0,
        location: `${property.address || ""}, ${property.ward || ""}, ${
          property.province || ""
        }`,
        bedrooms: property.bedrooms || 0,
        bathrooms: property.bathrooms || 0,
        area: property.area || 0,
        furnishing: property.furnishing || "Không có thông tin",
        category: "Chung cư / Nhà ở",
        unit: property.unit || "",
        updatedAt: property.updatedAt,
      };
    }
  };

  const data = getData();

  // Format time ago
  const getTimeAgo = (dateString?: string) => {
    if (!dateString) return "Không rõ";

    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return "Vừa mới cập nhật";
    if (diffHours < 24) return `Cập nhật ${diffHours} giờ trước`;
    if (diffDays < 7) return `Cập nhật ${diffDays} ngày trước`;

    // Format as dd/mm/yyyy
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `Cập nhật ${day}/${month}/${year}`;
  };

  return (
    <div className="space-y-6 bg-primary-foreground p-4 rounded-[12px] mb-3">
      {/* Property Title and Price */}
      <div>
        <h1 className="text-[26px] font-bold text-primary leading-tight">
          {data.title}
        </h1>
        <div className="flex justify-between items-center my-4">
          <p className="text-2xl font-bold text-secondary ">
            {data.price.toLocaleString("vi-VN")} VND/Tháng
          </p>
          <PropertyDetails
            bathrooms={data.bathrooms}
            bedrooms={data.bedrooms}
            area={data.area}
          />
        </div>

        <div className="flex items-center gap-2 text-muted-foreground mb-2">
          <div className="flex items-center gap-2 w-6 h-6 justify-center bg-[#e5e5e5] rounded-full p-1">
            <MapPin className="h-4 w-4 text-primary" />
          </div>
          <span className="text-sm text-primary font-medium">
            {data.location}
          </span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="flex items-center gap-2 w-6 h-6 justify-center bg-[#e5e5e5] rounded-full p-1">
            <Clock className="h-4 w-4 text-primary" />
          </div>
          <span className="text-sm text-primary font-medium">
            {getTimeAgo(data.updatedAt)}
          </span>
        </div>
      </div>

      {/* Property Details Grid */}
      <Card className="shadow-none bg-background p-0 border-0">
        <CardContent className="relative p-0">
          {/* Khung ngoài bo tròn + viền chấm */}
          <div className="relative rounded-2xl border border-dashed border-neutral-300 overflow-hidden">
            {/* Lưới 3 cột x 2 hàng */}
            <div className="grid grid-cols-3">
              {/* --- Vạch chia: 2 đường dọc + 1 đường ngang (chấm) --- */}
              <div aria-hidden className="pointer-events-none absolute inset-0">
                {/* dọc 1 */}
                <div className="absolute top-4 bottom-4 left-1/3 -translate-x-0.5 border-l border-dashed border-neutral-300" />
                {/* dọc 2 */}
                <div className="absolute top-4 bottom-4 left-2/3 -translate-x-0.5 border-l border-dashed border-neutral-300" />
                {/* ngang (giữa 2 hàng) */}
                <div className="absolute left-4 right-4 top-1/2 -translate-y-0.5 border-t border-dashed border-neutral-300" />
              </div>

              {/* ============ Cột 1 ============ */}
              <div className="p-3">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 shrink-0 bg-secondary rounded-full grid place-items-center">
                    <Building className="h-4 w-4 text-primary-foreground " />
                  </div>
                  <div className="leading-tight">
                    <div className="text-xs font-bold text-muted-foreground">
                      Danh mục
                    </div>
                    <div className="font-bold text-sm text-foreground">
                      {data.category}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 shrink-0 bg-secondary rounded-full grid place-items-center">
                    <Building className="h-4 w-4 text-primary-foreground " />
                  </div>
                  <div className="leading-tight">
                    <div className="text-xs font-bold text-muted-foreground">
                      Diện tích
                    </div>
                    <div className="font-bold text-sm text-foreground">
                      {data.area} m²
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 shrink-0 bg-secondary rounded-full grid place-items-center">
                    <Building className="h-4 w-4 text-primary-foreground " />
                  </div>
                  <div className="leading-tight">
                    <div className="text-xs font-bold text-muted-foreground">
                      {isRoomTypeDetail(property) ? "Số phòng trống" : "Mã căn"}
                    </div>
                    <div className="font-bold text-sm text-foreground">
                      {isRoomTypeDetail(property)
                        ? `${data.roomCount} phòng`
                        : data.unit || "N/A"}
                    </div>
                  </div>
                </div>
              </div>

              {/* ============ Cột 2 (hàng 2) ============ */}
              <div className="p-3">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 shrink-0 bg-secondary rounded-full grid place-items-center">
                    <Building className="h-4 w-4 text-primary-foreground " />
                  </div>
                  <div className="leading-tight">
                    <div className="text-xs font-bold text-muted-foreground">
                      Số phòng ngủ
                    </div>
                    <div className="font-bold text-sm text-foreground">
                      {data.bedrooms} phòng
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 shrink-0 bg-secondary rounded-full grid place-items-center">
                    <Building className="h-4 w-4 text-primary-foreground " />
                  </div>
                  <div className="leading-tight">
                    <div className="text-xs font-bold text-muted-foreground">
                      Số phòng vệ sinh
                    </div>
                    <div className="font-bold text-sm text-foreground">
                      {data.bathrooms} phòng
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 shrink-0 bg-secondary rounded-full grid place-items-center">
                    <Building className="h-4 w-4 text-primary-foreground " />
                  </div>
                  <div className="leading-tight">
                    <div className="text-xs font-bold text-muted-foreground">
                      Tình trạng nội thất
                    </div>
                    <div className="font-bold text-sm text-foreground">
                      {data.furnishing}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
