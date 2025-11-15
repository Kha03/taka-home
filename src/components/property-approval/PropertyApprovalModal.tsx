/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Bed,
  Bath,
  Ruler,
  DollarSign,
  User,
  Phone,
  Mail,
  Calendar,
  Home,
  Building2,
  Check,
  X,
  Images,
} from "lucide-react";
import {
  type PropertyOrRoomType,
  isRoomType,
  getPropertyTitle,
  getRoomTypeName,
  getPropertyLocation,
  getPropertyImages,
  getPropertyDetails,
  getApprovalStatus,
  getUpdatedDate,
} from "@/lib/utils/property-helpers";

interface PropertyApprovalModalProps {
  property: PropertyOrRoomType | null;
  allRoomTypes?: PropertyOrRoomType[]; // All room types for BOARDING
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove: () => void;
  onReject: () => void;
}

export function PropertyApprovalModal({
  property,
  allRoomTypes = [],
  open,
  onOpenChange,
  onApprove,
  onReject,
}: PropertyApprovalModalProps) {
  const t = useTranslations("propertyDetail");
  const [activeIndex, setActiveIndex] = useState(0);

  // Early return after hooks
  if (!property) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[98vw] sm:w-[95vw] max-w-[1400px] p-6 bg-[#FFF7E9]">
          <p className="text-center text-muted-foreground">{t("noData")}</p>
        </DialogContent>
      </Dialog>
    );
  }

  const images = getPropertyImages(property) ?? [];
  const details = getPropertyDetails(property);
  const title = getPropertyTitle(property);
  const location = getPropertyLocation(property);
  const roomTypeName = getRoomTypeName(property);
  const isApproved = getApprovalStatus(property);
  const updatedAt = getUpdatedDate(property);
  const isBoarding = isRoomType(property);

  const landlord = isBoarding
    ? property.property.landlord
    : "landlord" in property
    ? property.landlord
    : undefined;

  const description = isBoarding
    ? property.description
    : "description" in property
    ? property.description
    : undefined;
  const furnishing = isBoarding
    ? property.furnishing
    : "furnishing" in property
    ? property.furnishing
    : undefined;
  const deposit = isBoarding
    ? property.deposit
    : "deposit" in property
    ? property.deposit
    : undefined;

  const activeImage = images[activeIndex];

  const typeBadge = (
    <Badge
      className={`${
        isBoarding
          ? "bg-purple-100 text-purple-700"
          : "bg-blue-100 text-blue-700"
      } border-none shadow-sm hover:bg-opacity-100 pointer-events-none`}
    >
      <Building2 className="w-3 h-3 mr-1" />
      {isBoarding
        ? t("category.boarding")
        : property && "type" in property && property.type === "HOUSING"
        ? t("category.housing")
        : t("category.apartment")}
    </Badge>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[98vw] sm:w-[95vw] !max-w-[1400px] h-[95vh] max-h-[95vh] p-0 overflow-hidden bg-[#FFF7E9]">
        <ScrollArea className="h-full">
          <div className="relative">
            {/* Sticky header actions on mobile */}
            <div className="absolute right-3 top-3 z-20 flex gap-2 sm:hidden">
              {!isApproved ? (
                <>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-white/70 backdrop-blur border border-red-200 text-red-600 hover:bg-red-50"
                    onClick={() => {
                      onReject();
                      onOpenChange(false);
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    className="bg-[#00AE26] hover:bg-[#00AE26]/90 text-white"
                    onClick={() => {
                      onApprove();
                      onOpenChange(false);
                    }}
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                </>
              ) : null}
            </div>

            {/* Cover section */}
            <div className="relative h-[280px] sm:h-[340px] md:h-[420px]">
              {activeImage ? (
                <Image
                  src={activeImage}
                  alt={title}
                  fill
                  priority
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 1200px"
                />
              ) : (
                <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-amber-100 to-amber-50">
                  <div className="flex items-center gap-2 text-amber-700">
                    <Images className="w-5 h-5" />
                    <span>{t("noImages")}</span>
                  </div>
                </div>
              )}

              {/* Overlay chips */}
              <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center gap-2 z-10">
                {roomTypeName && (
                  <Badge className="bg-[#DCBB87]/30 text-accent border-none pointer-events-none">
                    <Home className="w-3 h-3 mr-1" />
                    {roomTypeName}
                  </Badge>
                )}
                {typeBadge}
                <Badge
                  className={`${
                    isApproved
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-700"
                  } border-none pointer-events-none`}
                >
                  {isApproved ? t("approved") : t("pending")}
                </Badge>
              </div>
            </div>

            {/* Main content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-6 p-4 sm:p-6">
              {/* Left: thumbnails (desktop) */}
              {images.length > 1 && (
                <div className="hidden lg:block lg:col-span-2">
                  <div className="grid grid-cols-1 gap-2 sticky top-4 max-h-[60vh] overflow-auto pr-1">
                    {images.slice(0, 12).map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveIndex(idx)}
                        className={`relative h-20 rounded-md overflow-hidden border transition ring-offset-2 focus:outline-none focus:ring ${
                          idx === activeIndex
                            ? "border-[#DCBB87] ring-2 ring-[#DCBB87]/40"
                            : "border-[#DCBB87]/20 hover:border-[#DCBB87]/40"
                        }`}
                        aria-label={`Xem ảnh ${idx + 1}`}
                      >
                        <Image
                          src={img}
                          alt={`${title} - ${idx + 1}`}
                          fill
                          className="object-cover"
                          sizes="160px"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Middle: info */}
              <div className="lg:col-span-7 space-y-6">
                <DialogHeader className="p-0">
                  <DialogTitle className="text-2xl sm:text-3xl font-bold text-primary leading-tight">
                    {title}
                  </DialogTitle>
                  <div className="mt-2 flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mt-0.5 text-[#DCBB87]" />
                    <span className="text-primary">{location}</span>
                  </div>
                </DialogHeader>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-white rounded-xl p-4 border border-[#DCBB87]/30">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Bed className="w-4 h-4 text-[#DCBB87]" /> Phòng ngủ
                    </div>
                    <p className="mt-1 text-2xl font-semibold text-primary">
                      {details.bedrooms}
                    </p>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-[#DCBB87]/30">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Bath className="w-4 h-4 text-[#DCBB87]" /> Phòng tắm
                    </div>
                    <p className="mt-1 text-2xl font-semibold text-primary">
                      {details.bathrooms}
                    </p>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-[#DCBB87]/30">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Ruler className="w-4 h-4 text-[#DCBB87]" /> Diện tích
                    </div>
                    <p className="mt-1 text-2xl font-semibold text-primary">
                      {details.area}m²
                    </p>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-[#DCBB87]/30">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <DollarSign className="w-4 h-4 text-[#DCBB87]" /> Giá thuê
                    </div>
                    <p className="mt-1 text-xl font-bold text-emerald-700">
                      {details.price.toLocaleString("vi-VN")}₫
                      <span className="ml-1 text-sm font-normal text-muted-foreground">
                        /tháng
                      </span>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {furnishing && (
                    <div className="bg-white rounded-xl p-4 border border-[#DCBB87]/30">
                      <p className="text-sm text-muted-foreground mb-1">
                        Nội thất
                      </p>
                      <p className="text-base font-medium text-primary">
                        {furnishing}
                      </p>
                    </div>
                  )}

                  {deposit !== undefined && (
                    <div className="bg-white rounded-xl p-4 border border-[#DCBB87]/30">
                      <p className="text-sm text-muted-foreground mb-1">
                        Tiền cọc
                      </p>
                      <p className="text-base font-medium text-primary">
                        {deposit.toLocaleString("vi-VN")}₫
                      </p>
                    </div>
                  )}

                  {updatedAt && (
                    <div className="bg-white rounded-xl p-4 border border-[#DCBB87]/30">
                      <div className="flex items-center gap-2 mb-1 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" /> Cập nhật
                      </div>
                      <p className="text-base font-medium text-primary">
                        {new Date(updatedAt).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                  )}

                  {isBoarding && (property as any).rooms && (
                    <div className="bg-white rounded-xl p-4 border border-[#DCBB87]/30">
                      <p className="text-sm text-muted-foreground mb-1">
                        Số phòng còn trống
                      </p>
                      <p className="text-xl font-bold text-primary">
                        {(property as any).rooms.length}
                      </p>
                    </div>
                  )}
                </div>

                {description && (
                  <div className="bg-white rounded-xl p-4 border border-[#DCBB87]/30">
                    <p className="text-sm text-muted-foreground mb-2">Mô tả</p>
                    <p className="text-base text-primary whitespace-pre-line leading-relaxed">
                      {description}
                    </p>
                  </div>
                )}

                {/* Room Type Details for BOARDING */}
                {isBoarding && allRoomTypes.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                      <Home className="w-5 h-5 text-[#DCBB87]" />
                      Các loại phòng ({allRoomTypes.length})
                    </h3>

                    {allRoomTypes.map((roomTypeItem, index) => {
                      const roomTypeDetails = getPropertyDetails(roomTypeItem);
                      const roomTypeName = getRoomTypeName(roomTypeItem);
                      const roomTypeImages = getPropertyImages(roomTypeItem);
                      const roomTypeDesc = isRoomType(roomTypeItem)
                        ? roomTypeItem.description
                        : undefined;
                      const roomTypeFurnishing = isRoomType(roomTypeItem)
                        ? roomTypeItem.furnishing
                        : undefined;
                      const roomTypeDeposit = isRoomType(roomTypeItem)
                        ? roomTypeItem.deposit
                        : undefined;
                      const roomTypeRooms = isRoomType(roomTypeItem)
                        ? roomTypeItem.rooms
                        : [];

                      return (
                        <div
                          key={
                            isRoomType(roomTypeItem) ? roomTypeItem.id : index
                          }
                          className="bg-gradient-to-br from-[#DCBB87]/5 to-[#DCBB87]/10 rounded-xl p-5 border-2 border-[#DCBB87]/40 space-y-4"
                        >
                          {/* Room Type Header */}
                          <div className="flex items-center justify-between pb-3 border-b border-[#DCBB87]/30">
                            <div className="flex items-center gap-2">
                              <Badge className="bg-[#DCBB87] text-white border-none pointer-events-none text-base px-3 py-1">
                                {roomTypeName || `Loại phòng ${index + 1}`}
                              </Badge>
                              {roomTypeRooms && roomTypeRooms.length > 0 && (
                                <span className="text-sm text-muted-foreground">
                                  ({roomTypeRooms.length} phòng)
                                </span>
                              )}
                            </div>
                            <p className="text-xl font-bold text-emerald-700">
                              {roomTypeDetails.price.toLocaleString("vi-VN")}₫
                              <span className="text-sm font-normal text-muted-foreground ml-1">
                                /tháng
                              </span>
                            </p>
                          </div>

                          {/* Room Type Main Stats */}
                          <div className="grid grid-cols-3 gap-4">
                            <div className="bg-white rounded-lg p-3 border border-[#DCBB87]/30">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                <Bed className="w-4 h-4 text-[#DCBB87]" />
                                <span>Phòng ngủ</span>
                              </div>
                              <p className="text-xl font-semibold text-primary">
                                {roomTypeDetails.bedrooms}
                              </p>
                            </div>
                            <div className="bg-white rounded-lg p-3 border border-[#DCBB87]/30">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                <Bath className="w-4 h-4 text-[#DCBB87]" />
                                <span>Phòng tắm</span>
                              </div>
                              <p className="text-xl font-semibold text-primary">
                                {roomTypeDetails.bathrooms}
                              </p>
                            </div>
                            <div className="bg-white rounded-lg p-3 border border-[#DCBB87]/30">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                <Ruler className="w-4 h-4 text-[#DCBB87]" />
                                <span>Diện tích</span>
                              </div>
                              <p className="text-xl font-semibold text-primary">
                                {roomTypeDetails.area}m²
                              </p>
                            </div>
                          </div>

                          {/* Additional Room Type Info */}
                          <div className="grid grid-cols-2 gap-4">
                            {roomTypeFurnishing && (
                              <div className="bg-white rounded-lg p-3 border border-[#DCBB87]/30">
                                <p className="text-xs text-muted-foreground mb-1">
                                  Nội thất
                                </p>
                                <p className="text-base font-medium text-primary">
                                  {roomTypeFurnishing}
                                </p>
                              </div>
                            )}
                            {roomTypeDeposit !== undefined && (
                              <div className="bg-white rounded-lg p-3 border border-[#DCBB87]/30">
                                <p className="text-xs text-muted-foreground mb-1">
                                  Tiền cọc
                                </p>
                                <p className="text-base font-medium text-primary">
                                  {roomTypeDeposit.toLocaleString("vi-VN")}₫
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Room Type Description */}
                          {roomTypeDesc && (
                            <div className="bg-white rounded-lg p-3 border border-[#DCBB87]/30">
                              <p className="text-xs text-muted-foreground mb-1">
                                Mô tả
                              </p>
                              <p className="text-sm text-primary line-clamp-3">
                                {roomTypeDesc}
                              </p>
                            </div>
                          )}

                          {/* Room Type Images Preview */}
                          {roomTypeImages.length > 0 && (
                            <div>
                              <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                                <Images className="w-4 h-4" />
                                Hình ảnh ({roomTypeImages.length})
                              </p>
                              <div className="flex gap-2 flex-wrap">
                                {roomTypeImages
                                  .slice(0, 8)
                                  .map((img: string, imgIdx: number) => (
                                    <div
                                      key={imgIdx}
                                      className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-[#DCBB87]/30"
                                    >
                                      <Image
                                        src={img}
                                        alt={`${roomTypeName} - ${imgIdx + 1}`}
                                        fill
                                        className="object-cover"
                                        sizes="80px"
                                      />
                                    </div>
                                  ))}
                                {roomTypeImages.length > 8 && (
                                  <div className="w-20 h-20 rounded-lg bg-[#DCBB87]/20 flex items-center justify-center text-sm text-[#DCBB87] font-semibold border-2 border-[#DCBB87]/30">
                                    +{roomTypeImages.length - 8}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Available Rooms List */}
                          {roomTypeRooms && roomTypeRooms.length > 0 && (
                            <div>
                              <p className="text-sm text-muted-foreground mb-2">
                                Danh sách phòng ({roomTypeRooms.length})
                              </p>
                              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                                {roomTypeRooms
                                  .slice(0, 15)
                                  .map((room: any, idx: number) => (
                                    <div
                                      key={room.id || idx}
                                      className="bg-white rounded-md px-3 py-2 border border-[#DCBB87]/30 text-center"
                                    >
                                      <p className="text-sm font-medium text-primary truncate">
                                        {room.name}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        Tầng {room.floor}
                                      </p>
                                    </div>
                                  ))}
                                {roomTypeRooms.length > 15 && (
                                  <div className="rounded-md px-3 py-2 bg-[#DCBB87]/10 flex items-center justify-center">
                                    <p className="text-xs text-[#DCBB87] font-medium">
                                      +{roomTypeRooms.length - 15}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* Property-wide info for BOARDING */}
                    <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                      <p className="text-sm font-medium text-amber-800 mb-2">
                        📍 Thông tin tòa nhà
                      </p>
                      <div className="space-y-1 text-sm text-amber-700">
                        <p>
                          <span className="font-medium">Tên:</span>{" "}
                          {isRoomType(property)
                            ? property.property.title
                            : title}
                        </p>
                        <p>
                          <span className="font-medium">Địa chỉ:</span>{" "}
                          {location}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right: landlord card */}
              <div className="lg:col-span-3">
                <div className="bg-white rounded-xl p-5 border border-[#DCBB87]/30 sticky top-4">
                  <p className="text-sm text-muted-foreground mb-3">
                    Thông tin chủ nhà
                  </p>
                  {landlord ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-base text-primary">
                          {"fullName" in landlord
                            ? (landlord as any).fullName
                            : "name" in landlord
                            ? (landlord as any).name
                            : "Chưa cập nhật"}
                        </span>
                      </div>
                      {"phone" in landlord && (landlord as any).phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-base text-primary">
                            {(landlord as any).phone}
                          </span>
                        </div>
                      )}
                      {"email" in landlord && (landlord as any).email && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-base text-primary">
                            {(landlord as any).email}
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      Chưa cập nhật thông tin.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Separator className="bg-[#DCBB87]/20" />

            {/* Sticky action bar */}
            <div className="sticky bottom-0 left-0 right-0 bg-[#FFF7E9]/95 backdrop-blur supports-[backdrop-filter]:bg-[#FFF7E9]/80 border-t border-[#DCBB87]/30">
              <div className="mx-auto max-w-6xl w-full px-4 sm:px-6 py-3 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {isApproved ? (
                    <span className="inline-flex items-center gap-2 text-green-700">
                      <Check className="w-4 h-4" /> Bất động sản đã được duyệt
                    </span>
                  ) : (
                    <span>Kiểm tra kỹ thông tin trước khi duyệt.</span>
                  )}
                </div>

                {!isApproved && (
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={() => {
                        onReject();
                        onOpenChange(false);
                      }}
                    >
                      <X className="w-4 h-4 mr-2" /> Từ chối
                    </Button>
                    <Button
                      className="bg-[#00AE26] hover:bg-[#00AE26]/90 text-white"
                      onClick={() => {
                        onApprove();
                        onOpenChange(false);
                      }}
                    >
                      <Check className="w-4 h-4 mr-2" /> Duyệt bất động sản
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
