"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { propertyService } from "@/lib/api/services/property";
import type { PropertyRoom, PropertyRoomType } from "@/lib/api/types";
import { toast } from "@/hooks/use-toast";
import { Loader2, MoveRight, Plus, X, Images } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface MoveRoomDialogProps {
  room: PropertyRoom | null;
  availableRoomTypes: PropertyRoomType[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function MoveRoomDialog({
  room,
  availableRoomTypes,
  open,
  onOpenChange,
  onSuccess,
}: MoveRoomDialogProps) {
  const t = useTranslations("myProperties");
  const [loading, setLoading] = useState(false);
  const [moveMode, setMoveMode] = useState<"existing" | "new">("existing");
  const [selectedRoomTypeId, setSelectedRoomTypeId] = useState<string>("");

  const [newRoomTypeData, setNewRoomTypeData] = useState({
    name: "",
    description: "",
    bedrooms: 1,
    bathrooms: 1,
    area: 20,
    price: 0,
    deposit: 0,
    furnishing: "Cơ bản",
    images: [] as string[],
  });

  // Reset form khi room hoặc dialog thay đổi
  useEffect(() => {
    if (open && room) {
      setMoveMode("existing");
      setSelectedRoomTypeId("");
      setNewRoomTypeData({
        name: "",
        description: "",
        bedrooms: 1,
        bathrooms: 1,
        area: 20,
        price: 0,
        deposit: 0,
        furnishing: "Cơ bản",
        images: [],
      });
    }
  }, [open, room]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!room?.id) {
      toast.error("Lỗi", "Không tìm thấy thông tin phòng");
      return;
    }

    try {
      setLoading(true);

      let requestData;

      if (moveMode === "existing") {
        if (!selectedRoomTypeId) {
          toast.error("Lỗi", "Vui lòng chọn loại phòng đích");
          return;
        }
        requestData = {
          targetRoomTypeId: selectedRoomTypeId,
          createNewRoomType: false as const,
        };
      } else {
        if (!newRoomTypeData.name.trim()) {
          toast.error("Lỗi", "Vui lòng nhập tên loại phòng mới");
          return;
        }
        requestData = {
          createNewRoomType: true as const,
          newRoomTypeName: newRoomTypeData.name,
          newRoomTypeDescription: newRoomTypeData.description,
          newRoomTypeBedrooms: newRoomTypeData.bedrooms,
          newRoomTypeBathrooms: newRoomTypeData.bathrooms,
          newRoomTypeArea: newRoomTypeData.area,
          newRoomTypePrice: newRoomTypeData.price,
          newRoomTypeDeposit: newRoomTypeData.deposit,
          newRoomTypeFurnishing: newRoomTypeData.furnishing as
            | "Đầy đủ"
            | "Cơ bản"
            | "Trống",
        };
      }

      const response = await propertyService.moveRoom(room.id, requestData);

      // Upload images cho mode new
      if (
        moveMode === "new" &&
        newRoomTypeData.images.length > 0 &&
        response.data?.roomType?.id
      ) {
        try {
          const newRoomTypeId = response.data.roomType.id;

          // Helper function to convert base64 to File
          const dataURLtoFile = async (
            dataurl: string,
            filename: string
          ): Promise<File | null> => {
            try {
              if (!dataurl.startsWith("data:")) return null;

              const arr = dataurl.split(",");
              const mimeMatch = arr[0].match(/:(.*?);/);
              const mime = mimeMatch ? mimeMatch[1] : "image/jpeg";
              const bstr = atob(arr[1]);
              let n = bstr.length;
              const u8arr = new Uint8Array(n);

              while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
              }

              return new File([u8arr], filename, { type: mime });
            } catch {
              return null;
            }
          };

          // Convert base64 images to File objects
          const heroImageFile = await dataURLtoFile(
            newRoomTypeData.images[0],
            `roomtype-hero-${Date.now()}.jpg`
          );

          const imageFiles = await Promise.all(
            newRoomTypeData.images
              .slice(1)
              .map((url, index) =>
                dataURLtoFile(url, `roomtype-image-${index}-${Date.now()}.jpg`)
              )
          );

          const validImageFiles = imageFiles.filter(
            (f): f is File => f !== null
          );

          await propertyService.uploadPropertyImages(
            newRoomTypeId,
            "BOARDING",
            heroImageFile || undefined,
            validImageFiles
          );
        } catch (error) {
          console.error("Error uploading images:", error);
          toast.warning(
            "Cảnh báo",
            "Phòng đã được chuyển thành công, nhưng có lỗi khi tải ảnh lên. Bạn có thể tải ảnh lên sau."
          );
        }
      }

      toast.success(
        "Chuyển phòng thành công",
        `Phòng "${room.name}" đã được chuyển sang loại phòng ${
          moveMode === "existing"
            ? availableRoomTypes.find((rt) => rt.id === selectedRoomTypeId)
                ?.name
            : newRoomTypeData.name
        }`
      );

      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      console.error("Error moving room:", error);
      toast.error("Lỗi", "Không thể chuyển phòng. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  if (!room) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0 bg-[#FFF7E9]">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-2xl font-bold text-primary flex items-center gap-2">
            <MoveRight className="w-6 h-6" />
            Chuyển phòng sang loại khác
          </DialogTitle>
          <DialogDescription className="text-base">
            Phòng: <span className="font-semibold">{room.name}</span> (Tầng{" "}
            {room.floor})
            <br />
            Loại phòng hiện tại:{" "}
            <span className="font-semibold">{room.roomType?.name}</span>
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-200px)] px-6">
          <form onSubmit={handleSubmit} className="space-y-6 pb-4">
            {/* Mode Selection */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">
                Chọn phương thức chuyển
              </Label>
              <RadioGroup
                value={moveMode}
                onValueChange={(value) =>
                  setMoveMode(value as "existing" | "new")
                }
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <Card className="cursor-pointer hover:border-[#DCBB87] transition-colors bg-primary/5">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <RadioGroupItem value="existing" id="mode-existing" />
                      <div className="flex-1">
                        <Label
                          htmlFor="mode-existing"
                          className="cursor-pointer font-semibold text-base"
                        >
                          Chuyển vào loại phòng có sẵn
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          Chọn một loại phòng đã tồn tại trong hệ thống
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:border-[#DCBB87] transition-colors bg-primary/5">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <RadioGroupItem value="new" id="mode-new" />
                      <div className="flex-1">
                        <Label
                          htmlFor="mode-new"
                          className="cursor-pointer font-semibold text-base"
                        >
                          <Plus className="w-4 h-4 inline mr-1" />
                          Tạo loại phòng mới
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          Tạo loại phòng mới và chuyển phòng vào đó
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </RadioGroup>
            </div>

            {/* Mode: Existing RoomType */}
            {moveMode === "existing" && (
              <div className="space-y-2">
                <Label htmlFor="targetRoomType" className="text-base">
                  Chọn loại phòng đích <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={selectedRoomTypeId}
                  onValueChange={setSelectedRoomTypeId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại phòng..." />
                  </SelectTrigger>
                  <SelectContent className="bg-primary-foreground">
                    {availableRoomTypes
                      .filter((rt) => rt.id && rt.id !== room.roomType?.id)
                      .map((roomType) => (
                        <SelectItem key={roomType.id} value={roomType.id!}>
                          <div className="flex flex-col">
                            <span className="font-semibold">
                              {roomType.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {roomType.bedrooms} PN • {roomType.bathrooms} WC •{" "}
                              {roomType.area}m² •{" "}
                              {roomType.price.toLocaleString("vi-VN")} VND/tháng
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {availableRoomTypes.filter(
                  (rt) => rt.id && rt.id !== room.roomType?.id
                ).length === 0 && (
                  <p className="text-sm text-amber-600">
                    {t("noOtherRoomTypes")}
                  </p>
                )}
              </div>
            )}

            {/* Mode: New RoomType */}
            {moveMode === "new" && (
              <div className="space-y-4 border-t pt-4">
                <h3 className="font-semibold text-lg text-primary">
                  Thông tin loại phòng mới
                </h3>

                {/* Room Type Name */}
                <div className="space-y-2">
                  <Label htmlFor="newRoomTypeName">
                    Tên loại phòng <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="newRoomTypeName"
                    value={newRoomTypeData.name}
                    onChange={(e) =>
                      setNewRoomTypeData({
                        ...newRoomTypeData,
                        name: e.target.value,
                      })
                    }
                    placeholder="VD: Phòng VIP có WC riêng"
                    required
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="newRoomTypeDesc">Mô tả</Label>
                  <Textarea
                    id="newRoomTypeDesc"
                    value={newRoomTypeData.description}
                    onChange={(e) =>
                      setNewRoomTypeData({
                        ...newRoomTypeData,
                        description: e.target.value,
                      })
                    }
                    placeholder="Mô tả chi tiết về loại phòng..."
                    rows={3}
                  />
                </div>

                {/* Room Details */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="newBedrooms">
                      Phòng ngủ <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="newBedrooms"
                      type="number"
                      min="0"
                      value={newRoomTypeData.bedrooms}
                      onChange={(e) =>
                        setNewRoomTypeData({
                          ...newRoomTypeData,
                          bedrooms: Number(e.target.value),
                        })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newBathrooms">
                      Phòng tắm <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="newBathrooms"
                      type="number"
                      min="0"
                      value={newRoomTypeData.bathrooms}
                      onChange={(e) =>
                        setNewRoomTypeData({
                          ...newRoomTypeData,
                          bathrooms: Number(e.target.value),
                        })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newArea">
                      Diện tích (m²) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="newArea"
                      type="number"
                      min="0"
                      value={newRoomTypeData.area}
                      onChange={(e) =>
                        setNewRoomTypeData({
                          ...newRoomTypeData,
                          area: Number(e.target.value),
                        })
                      }
                      required
                    />
                  </div>
                </div>

                {/* Price & Deposit */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPrice">
                      Giá thuê (VND/tháng){" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="newPrice"
                      type="number"
                      min="0"
                      value={newRoomTypeData.price}
                      onChange={(e) =>
                        setNewRoomTypeData({
                          ...newRoomTypeData,
                          price: Number(e.target.value),
                        })
                      }
                      placeholder="VD: 3000000"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newDeposit">
                      Tiền cọc (VND) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="newDeposit"
                      type="number"
                      min="0"
                      value={newRoomTypeData.deposit}
                      onChange={(e) =>
                        setNewRoomTypeData({
                          ...newRoomTypeData,
                          deposit: Number(e.target.value),
                        })
                      }
                      placeholder="VD: 3000000"
                      required
                    />
                  </div>
                </div>

                {/* Furnishing */}
                <div className="space-y-2">
                  <Label htmlFor="newFurnishing">
                    Nội thất <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={newRoomTypeData.furnishing}
                    onValueChange={(value) =>
                      setNewRoomTypeData({
                        ...newRoomTypeData,
                        furnishing: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-primary-foreground">
                      <SelectItem value="Đầy đủ">Đầy đủ</SelectItem>
                      <SelectItem value="Cơ bản">Cơ bản</SelectItem>
                      <SelectItem value="Trống">Trống</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Images Upload */}
                <div className="space-y-2">
                  <Label>Hình ảnh (Tối đa 6 ảnh)</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {/* Display uploaded images */}
                    {newRoomTypeData.images.map((imgSrc, i) => (
                      <div key={i} className="relative aspect-video group">
                        <Image
                          src={imgSrc}
                          alt={`Ảnh ${i + 1}`}
                          fill
                          className="object-cover rounded-lg border-2 border-[#DCBB87]"
                          unoptimized
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setNewRoomTypeData({
                              ...newRoomTypeData,
                              images: newRoomTypeData.images.filter(
                                (_, index) => index !== i
                              ),
                            });
                          }}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        {i === 0 && (
                          <div className="absolute bottom-1 left-1 bg-[#DCBB87] text-white text-xs px-2 py-0.5 rounded">
                            Ảnh chính
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Empty slots for additional images */}
                    {newRoomTypeData.images.length < 6 &&
                      Array.from({
                        length: 6 - newRoomTypeData.images.length,
                      }).map((_, i) => (
                        <div
                          key={`empty-${i}`}
                          className="relative aspect-video border-2 border-dashed border-[#DCBB87]/50 rounded-lg flex items-center justify-center bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => {
                            const input = document.createElement("input");
                            input.type = "file";
                            input.accept =
                              "image/jpeg,image/jpg,image/png,image/webp";
                            input.onchange = async (e) => {
                              const file = (e.target as HTMLInputElement)
                                .files?.[0];
                              if (!file) return;

                              // Validate file type
                              const validTypes = [
                                "image/jpeg",
                                "image/jpg",
                                "image/png",
                                "image/webp",
                              ];
                              if (!validTypes.includes(file.type)) {
                                toast.error(
                                  "Lỗi",
                                  "Chỉ chấp nhận file ảnh định dạng JPEG, PNG, WEBP"
                                );
                                return;
                              }

                              // Validate file size (max 5MB)
                              if (file.size > 5 * 1024 * 1024) {
                                toast.error(
                                  "Lỗi",
                                  "Kích thước ảnh không được vượt quá 5MB"
                                );
                                return;
                              }

                              // Convert to base64
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setNewRoomTypeData({
                                  ...newRoomTypeData,
                                  images: [
                                    ...newRoomTypeData.images,
                                    reader.result as string,
                                  ],
                                });
                              };
                              reader.onerror = () => {
                                toast.error(
                                  "Lỗi",
                                  "Có lỗi xảy ra khi đọc file ảnh"
                                );
                              };
                              reader.readAsDataURL(file);
                            };
                            input.click();
                          }}
                        >
                          <div className="text-center">
                            <Images className="w-6 h-6 mx-auto text-[#DCBB87]/50 mb-1" />
                            <p className="text-xs text-muted-foreground">
                              {t("addImage")}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Ảnh đầu tiên sẽ là ảnh đại diện của loại phòng
                  </p>
                </div>
              </div>
            )}
          </form>
        </ScrollArea>

        <DialogFooter className="gap-2 px-6 pb-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="text-red-500 border-red-500"
          >
            Huỷ
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            className="bg-[#00AE26] hover:bg-[#00AE26]/90"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang chuyển...
              </>
            ) : (
              <>
                <MoveRight className="w-4 h-4 mr-2" />
                Chuyển phòng
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
