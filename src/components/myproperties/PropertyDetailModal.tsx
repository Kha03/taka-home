/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { EditApartmentDialog } from "./EditApartmentDialog";
import {
  MapPin,
  Bed,
  Bath,
  Ruler,
  DollarSign,
  Calendar,
  Home,
  Building2,
  Images,
  Zap,
  Droplet,
  Edit,
} from "lucide-react";
import type { Property } from "@/lib/api/types";

interface PropertyDetailModalProps {
  property: Property | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate?: () => void;
}

export function PropertyDetailModal({
  property,
  open,
  onOpenChange,
  onUpdate,
}: PropertyDetailModalProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  if (!property) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[98vw] sm:w-[95vw] max-w-[1400px] p-6 bg-[#FFF7E9]">
          <p className="text-center text-muted-foreground">
            Không có dữ liệu property
          </p>
        </DialogContent>
      </Dialog>
    );
  }

  const isBoarding = property.type === "BOARDING";

  // Lấy images: Nếu là BOARDING, lấy từ roomType, nếu là APARTMENT thì lấy từ property
  let images: string[] = [];
  if (isBoarding && property.rooms) {
    // Lấy tất cả ảnh từ các roomType
    const roomTypeImages = new Set<string>();
    property.rooms.forEach((room) => {
      if (room.roomType) {
        // Thêm heroImage của roomType
        if (room.roomType.heroImage) {
          roomTypeImages.add(room.roomType.heroImage);
        }
        // Thêm images của roomType
        if (room.roomType.images && room.roomType.images.length > 0) {
          room.roomType.images.forEach((img) => roomTypeImages.add(img));
        }
      }
    });
    images = Array.from(roomTypeImages);
  } else {
    // APARTMENT: lấy từ property
    images = property.images || [];
    if (property.heroImage && !images.includes(property.heroImage)) {
      images.unshift(property.heroImage);
    }
  }

  const activeImage = images[activeIndex];

  const location = `${property.address}, ${property.ward}, ${property.province}`;

  // Calculate stats for BOARDING
  const rentedCount =
    property.rooms?.filter((room) => room.isVisible).length || 0;
  const totalRooms = property.rooms?.length || 0;
  const emptyCount = totalRooms - rentedCount;

  const monthlyIncome =
    property.rooms?.reduce((total, room) => {
      if (room.isVisible && room.roomType) {
        return total + (room.roomType.price || 0);
      }
      return total;
    }, 0) || 0;

  // Group rooms by roomType
  const roomTypeMap = new Map<
    string,
    {
      name: string;
      bedrooms: number;
      bathrooms: number;
      area: number;
      furniture: string;
      images: string[];
      price: number;
      deposit: number;
      description: string;
      rooms: typeof property.rooms;
    }
  >();

  property.rooms?.forEach((room) => {
    if (!room.roomType) return;

    const roomTypeId = room.roomType.id || room.roomType.name;

    if (!roomTypeMap.has(roomTypeId)) {
      roomTypeMap.set(roomTypeId, {
        name: room.roomType.name,
        bedrooms: room.roomType.bedrooms,
        bathrooms: room.roomType.bathrooms,
        area: room.roomType.area,
        furniture: room.roomType.furnishing || "Không",
        images: room.roomType.images || [],
        price: room.roomType.price,
        deposit: room.roomType.deposit || 0,
        description: room.roomType.description || "",
        rooms: [],
      });
    }

    const roomTypeData = roomTypeMap.get(roomTypeId)!;
    if (!roomTypeData.rooms) {
      roomTypeData.rooms = [];
    }
    roomTypeData.rooms.push(room);
  });

  const roomTypes = Array.from(roomTypeMap.values());

  const typeBadge = (
    <Badge
      className={`${
        isBoarding
          ? "bg-purple-100 text-purple-700"
          : "bg-blue-100 text-blue-700"
      } border-none shadow-sm hover:bg-opacity-100 pointer-events-none`}
    >
      <Building2 className="w-3 h-3 mr-1" />
      {isBoarding ? "Nhà trọ" : "Chung cư"}
    </Badge>
  );

  const statusBadge = (
    <Badge
      className={`${
        property.isVisible
          ? "bg-green-100 text-green-700"
          : "bg-gray-100 text-gray-700"
      } border-none pointer-events-none`}
    >
      {property.isVisible ? "Đang cho thuê" : "Trống"}
    </Badge>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[98vw] sm:w-[95vw] !max-w-[1400px] h-[95vh] max-h-[95vh] p-0 overflow-hidden bg-[#FFF7E9]">
        <ScrollArea className="h-full">
          <div className="relative">
            {/* Cover section */}
            <div className="relative h-[280px] sm:h-[340px] md:h-[420px]">
              {activeImage ? (
                <Image
                  src={activeImage}
                  alt={property.title}
                  fill
                  priority
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 1200px"
                />
              ) : (
                <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-amber-100 to-amber-50">
                  <div className="flex items-center gap-2 text-amber-700">
                    <Images className="w-5 h-5" />
                    <span>Chưa có hình ảnh</span>
                  </div>
                </div>
              )}

              {/* Overlay chips */}
              <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center gap-2 z-10">
                {typeBadge}
                {statusBadge}
                {property.isApproved !== undefined && (
                  <Badge
                    className={`${
                      property.isApproved
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    } border-none pointer-events-none`}
                  >
                    {property.isApproved ? "Đã duyệt" : "Chờ duyệt"}
                  </Badge>
                )}
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
                          alt={`${property.title} - ${idx + 1}`}
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
              <div className="lg:col-span-10 space-y-6">
                <DialogHeader className="p-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <DialogTitle className="text-2xl sm:text-3xl font-bold text-primary leading-tight">
                        {property.title}
                      </DialogTitle>
                      <div className="mt-2 flex items-start gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 mt-0.5 text-[#DCBB87]" />
                        <span className="text-primary">{location}</span>
                      </div>
                    </div>

                    {/* Nút Edit chỉ hiện với APARTMENT và chưa cho thuê */}
                    {!isBoarding && !property.isVisible && (
                      <Button
                        onClick={() => setEditDialogOpen(true)}
                        variant="outline"
                        className="flex items-center gap-2 border-[#DCBB87] text-[#DCBB87] hover:bg-[#DCBB87] hover:text-white"
                      >
                        <Edit className="w-4 h-4" />
                        Chỉnh sửa
                      </Button>
                    )}
                  </div>
                </DialogHeader>

                {/* Stats for APARTMENT */}
                {!isBoarding && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-white rounded-xl p-4 border border-[#DCBB87]/30">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Bed className="w-4 h-4 text-[#DCBB87]" /> Phòng ngủ
                      </div>
                      <p className="mt-1 text-2xl font-semibold text-primary">
                        {property.bedrooms || 0}
                      </p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-[#DCBB87]/30">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Bath className="w-4 h-4 text-[#DCBB87]" /> Phòng tắm
                      </div>
                      <p className="mt-1 text-2xl font-semibold text-primary">
                        {property.bathrooms || 0}
                      </p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-[#DCBB87]/30">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Ruler className="w-4 h-4 text-[#DCBB87]" /> Diện tích
                      </div>
                      <p className="mt-1 text-2xl font-semibold text-primary">
                        {property.area || 0}m²
                      </p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-[#DCBB87]/30">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <DollarSign className="w-4 h-4 text-[#DCBB87]" /> Giá
                        thuê
                      </div>
                      <p className="mt-1 text-xl font-bold text-emerald-700">
                        {(property.price || 0).toLocaleString("vi-VN")}₫
                        <span className="ml-1 text-sm font-normal text-muted-foreground">
                          /tháng
                        </span>
                      </p>
                    </div>
                  </div>
                )}

                {/* Stats for BOARDING */}
                {isBoarding && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-white rounded-xl p-4 border border-[#DCBB87]/30">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Home className="w-4 h-4 text-[#DCBB87]" /> Tổng phòng
                      </div>
                      <p className="mt-1 text-2xl font-semibold text-primary">
                        {totalRooms}
                      </p>
                    </div>
                    <div className="bg-green-50 rounded-xl p-4 border border-green-500/30">
                      <div className="flex items-center gap-2 text-sm text-green-700">
                        <Home className="w-4 h-4 text-green-600" /> Đã thuê
                      </div>
                      <p className="mt-1 text-2xl font-semibold text-green-700">
                        {rentedCount}
                      </p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-gray-300/30">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Home className="w-4 h-4 text-gray-500" /> Trống
                      </div>
                      <p className="mt-1 text-2xl font-semibold text-primary">
                        {emptyCount}
                      </p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-[#DCBB87]/30">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <DollarSign className="w-4 h-4 text-[#DCBB87]" /> Thu
                        nhập
                      </div>
                      <p className="mt-1 text-xl font-bold text-emerald-700">
                        {monthlyIncome.toLocaleString("vi-VN")}₫
                        <span className="ml-1 text-sm font-normal text-muted-foreground">
                          /tháng
                        </span>
                      </p>
                    </div>
                  </div>
                )}

                {/* Additional info for APARTMENT */}
                {!isBoarding && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {property.furnishing && (
                      <div className="bg-white rounded-xl p-4 border border-[#DCBB87]/30">
                        <p className="text-sm text-muted-foreground mb-1">
                          Nội thất
                        </p>
                        <p className="text-base font-medium text-primary">
                          {property.furnishing}
                        </p>
                      </div>
                    )}

                    {property.deposit !== undefined && (
                      <div className="bg-white rounded-xl p-4 border border-[#DCBB87]/30">
                        <p className="text-sm text-muted-foreground mb-1">
                          Tiền cọc
                        </p>
                        <p className="text-base font-medium text-primary">
                          {property.deposit.toLocaleString("vi-VN")}₫
                        </p>
                      </div>
                    )}

                    {property.updatedAt && (
                      <div className="bg-white rounded-xl p-4 border border-[#DCBB87]/30">
                        <div className="flex items-center gap-2 mb-1 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" /> Cập nhật
                        </div>
                        <p className="text-base font-medium text-primary">
                          {new Date(property.updatedAt).toLocaleDateString(
                            "vi-VN"
                          )}
                        </p>
                      </div>
                    )}

                    {property.unit && (
                      <div className="bg-white rounded-xl p-4 border border-[#DCBB87]/30">
                        <p className="text-sm text-muted-foreground mb-1">
                          Mã căn hộ
                        </p>
                        <p className="text-base font-medium text-primary">
                          {property.unit}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Utilities for BOARDING */}
                {isBoarding && (
                  <div className="grid grid-cols-2 gap-4">
                    {property.electricityPricePerKwh !== undefined && (
                      <div className="bg-white rounded-xl p-4 border border-[#DCBB87]/30">
                        <div className="flex items-center gap-2 mb-1 text-sm text-muted-foreground">
                          <Zap className="w-4 h-4 text-yellow-500" /> Giá điện
                        </div>
                        <p className="text-base font-medium text-primary">
                          {property.electricityPricePerKwh.toLocaleString(
                            "vi-VN"
                          )}
                          ₫/kWh
                        </p>
                      </div>
                    )}
                    {property.waterPricePerM3 !== undefined && (
                      <div className="bg-white rounded-xl p-4 border border-[#DCBB87]/30">
                        <div className="flex items-center gap-2 mb-1 text-sm text-muted-foreground">
                          <Droplet className="w-4 h-4 text-blue-500" /> Giá nước
                        </div>
                        <p className="text-base font-medium text-primary">
                          {property.waterPricePerM3.toLocaleString("vi-VN")}₫/m³
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {property.description && (
                  <div className="bg-white rounded-xl p-4 border border-[#DCBB87]/30">
                    <p className="text-sm text-muted-foreground mb-2">Mô tả</p>
                    <p className="text-base text-primary whitespace-pre-line leading-relaxed">
                      {property.description}
                    </p>
                  </div>
                )}

                {/* Room Types for BOARDING */}
                {isBoarding && roomTypes.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                      <Home className="w-5 h-5 text-[#DCBB87]" />
                      Các loại phòng ({roomTypes.length})
                    </h3>

                    {roomTypes.map((roomType, index) => {
                      const roomsInType = roomType.rooms || [];
                      const rentedInType = roomsInType.filter(
                        (r: any) => r.isVisible
                      ).length;

                      return (
                        <div
                          key={index}
                          className="bg-gradient-to-br from-[#DCBB87]/5 to-[#DCBB87]/10 rounded-xl p-5 border-2 border-[#DCBB87]/40 space-y-4"
                        >
                          {/* Room Type Header */}
                          <div className="flex items-center justify-between pb-3 border-b border-[#DCBB87]/30">
                            <div className="flex items-center gap-2">
                              <Badge className="bg-[#DCBB87] text-white border-none pointer-events-none text-base px-3 py-1">
                                {roomType.name}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                ({rentedInType}/{roomsInType.length} phòng đã
                                thuê)
                              </span>
                            </div>
                            <p className="text-xl font-bold text-emerald-700">
                              {roomType.price.toLocaleString("vi-VN")}₫
                              <span className="text-sm font-normal text-muted-foreground ml-1">
                                /tháng
                              </span>
                            </p>
                          </div>

                          {/* Room Type Stats */}
                          <div className="grid grid-cols-3 gap-4">
                            <div className="bg-white rounded-lg p-3 border border-[#DCBB87]/30">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                <Bed className="w-4 h-4 text-[#DCBB87]" />
                                <span>Phòng ngủ</span>
                              </div>
                              <p className="text-xl font-semibold text-primary">
                                {roomType.bedrooms}
                              </p>
                            </div>
                            <div className="bg-white rounded-lg p-3 border border-[#DCBB87]/30">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                <Bath className="w-4 h-4 text-[#DCBB87]" />
                                <span>Phòng tắm</span>
                              </div>
                              <p className="text-xl font-semibold text-primary">
                                {roomType.bathrooms}
                              </p>
                            </div>
                            <div className="bg-white rounded-lg p-3 border border-[#DCBB87]/30">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                <Ruler className="w-4 h-4 text-[#DCBB87]" />
                                <span>Diện tích</span>
                              </div>
                              <p className="text-xl font-semibold text-primary">
                                {roomType.area}m²
                              </p>
                            </div>
                          </div>

                          {/* Additional Room Type Info */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white rounded-lg p-3 border border-[#DCBB87]/30">
                              <p className="text-xs text-muted-foreground mb-1">
                                Nội thất
                              </p>
                              <p className="text-base font-medium text-primary">
                                {roomType.furniture}
                              </p>
                            </div>
                            <div className="bg-white rounded-lg p-3 border border-[#DCBB87]/30">
                              <p className="text-xs text-muted-foreground mb-1">
                                Tiền cọc
                              </p>
                              <p className="text-base font-medium text-primary">
                                {roomType.deposit.toLocaleString("vi-VN")}₫
                              </p>
                            </div>
                          </div>

                          {/* Room Type Description */}
                          {roomType.description && (
                            <div className="bg-white rounded-lg p-3 border border-[#DCBB87]/30">
                              <p className="text-xs text-muted-foreground mb-1">
                                Mô tả
                              </p>
                              <p className="text-sm text-primary">
                                {roomType.description}
                              </p>
                            </div>
                          )}

                          {/* Room Type Images */}
                          {roomType.images.length > 0 && (
                            <div>
                              <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                                <Images className="w-4 h-4" />
                                Hình ảnh ({roomType.images.length})
                              </p>
                              <div className="flex gap-2 flex-wrap">
                                {roomType.images
                                  .slice(0, 8)
                                  .map((img: string, imgIdx: number) => (
                                    <div
                                      key={imgIdx}
                                      className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-[#DCBB87]/30"
                                    >
                                      <Image
                                        src={img}
                                        alt={`${roomType.name} - ${imgIdx + 1}`}
                                        fill
                                        className="object-cover"
                                        sizes="80px"
                                      />
                                    </div>
                                  ))}
                                {roomType.images.length > 8 && (
                                  <div className="w-20 h-20 rounded-lg bg-[#DCBB87]/20 flex items-center justify-center text-sm text-[#DCBB87] font-semibold border-2 border-[#DCBB87]/30">
                                    +{roomType.images.length - 8}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Rooms List */}
                          {roomsInType.length > 0 && (
                            <div>
                              <p className="text-sm text-muted-foreground mb-2">
                                Danh sách phòng ({roomsInType.length})
                              </p>
                              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                                {roomsInType.map((room: any, idx: number) => (
                                  <div
                                    key={room.id || idx}
                                    className={`rounded-md px-3 py-2 border text-center ${
                                      room.isVisible
                                        ? "bg-green-50 border-green-300"
                                        : "bg-white border-[#DCBB87]/30"
                                    }`}
                                  >
                                    <p
                                      className={`text-sm font-medium truncate ${
                                        room.isVisible
                                          ? "text-green-700"
                                          : "text-primary"
                                      }`}
                                    >
                                      {room.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      Tầng {room.floor}
                                    </p>
                                    <p className="text-xs mt-1">
                                      {room.isVisible ? (
                                        <span className="text-green-600 font-medium">
                                          ✓ Đã thuê
                                        </span>
                                      ) : (
                                        <span className="text-gray-500">
                                          Trống
                                        </span>
                                      )}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <Separator className="bg-[#DCBB87]/20" />

            {/* Mobile thumbnails */}
            {images.length > 1 && (
              <div className="lg:hidden px-4 pb-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Hình ảnh ({images.length})
                </p>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveIndex(idx)}
                      className={`relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border transition ${
                        idx === activeIndex
                          ? "border-[#DCBB87] ring-2 ring-[#DCBB87]/40"
                          : "border-[#DCBB87]/20"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${property.title} - ${idx + 1}`}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>

      {/* Edit Apartment Dialog */}
      <EditApartmentDialog
        property={property}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSuccess={() => {
          onUpdate?.();
          onOpenChange(false);
        }}
      />
    </Dialog>
  );
}
