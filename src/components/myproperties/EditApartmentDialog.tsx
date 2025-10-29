"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { propertyService } from "@/lib/api/services/property";
import type { Property } from "@/lib/api/types";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface EditApartmentDialogProps {
  property: Property | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function EditApartmentDialog({
  property,
  open,
  onOpenChange,
  onSuccess,
}: EditApartmentDialogProps) {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    province: "",
    ward: "",
    address: "",
    block: "",
    unit: "",
    area: 0,
    bedrooms: 0,
    bathrooms: 0,
    price: 0,
    deposit: 0,
    furnishing: "",
  });

  // Reset form khi property thay đổi
  useEffect(() => {
    if (property) {
      setFormData({
        title: property.title || "",
        description: property.description || "",
        province: property.province || "",
        ward: property.ward || "",
        address: property.address || "",
        block: property.block || "",
        unit: property.unit || "",
        area: property.area || 0,
        bedrooms: property.bedrooms || 0,
        bathrooms: property.bathrooms || 0,
        price: property.price || 0,
        deposit: property.deposit || 0,
        furnishing: property.furnishing || "",
      });
    }
  }, [property]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!property) return;

    try {
      setLoading(true);
      await propertyService.updateApartment(property.id, formData);

      toast.success(
        "Cập nhật thành công",
        "Thông tin căn hộ đã được cập nhật."
      );

      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating apartment:", error);
      toast.error(
        "Lỗi",
        "Không thể cập nhật thông tin căn hộ. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 bg-[#FFF7E9]">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-2xl font-bold text-primary">
            Chỉnh sửa thông tin căn hộ
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-180px)] px-6">
          <div className="space-y-4 pb-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">
                Tiêu đề <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Nhập tiêu đề căn hộ"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Nhập mô tả chi tiết"
                rows={3}
              />
            </div>

            {/* Location */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="province">
                  Tỉnh/Thành phố <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="province"
                  value={formData.province}
                  onChange={(e) =>
                    setFormData({ ...formData, province: e.target.value })
                  }
                  placeholder="VD: Thành phố Hồ Chí Minh"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ward">
                  Quận/Huyện <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="ward"
                  value={formData.ward}
                  onChange={(e) =>
                    setFormData({ ...formData, ward: e.target.value })
                  }
                  placeholder="VD: Quận 1"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">
                Địa chỉ <span className="text-red-500">*</span>
              </Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                placeholder="VD: 123 Lê Lợi"
                required
              />
            </div>

            {/* Block & Unit */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="block">Toà nhà</Label>
                <Input
                  id="block"
                  value={formData.block}
                  onChange={(e) =>
                    setFormData({ ...formData, block: e.target.value })
                  }
                  placeholder="VD: Block A"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit">
                  Mã căn hộ <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="unit"
                  value={formData.unit}
                  onChange={(e) =>
                    setFormData({ ...formData, unit: e.target.value })
                  }
                  placeholder="VD: A-1001"
                  required
                />
              </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="area">
                  Diện tích (m²) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="area"
                  type="number"
                  min="0"
                  value={formData.area}
                  onChange={(e) =>
                    setFormData({ ...formData, area: Number(e.target.value) })
                  }
                  placeholder="VD: 25"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bedrooms">
                  Phòng ngủ <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="bedrooms"
                  type="number"
                  min="0"
                  value={formData.bedrooms}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      bedrooms: Number(e.target.value),
                    })
                  }
                  placeholder="VD: 2"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bathrooms">
                  Phòng tắm <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="bathrooms"
                  type="number"
                  min="0"
                  value={formData.bathrooms}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      bathrooms: Number(e.target.value),
                    })
                  }
                  placeholder="VD: 2"
                  required
                />
              </div>
            </div>

            {/* Price & Deposit */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">
                  Giá thuê (VND/tháng) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: Number(e.target.value) })
                  }
                  placeholder="VD: 15000000"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deposit">
                  Tiền cọc (VND) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="deposit"
                  type="number"
                  min="0"
                  value={formData.deposit}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      deposit: Number(e.target.value),
                    })
                  }
                  placeholder="VD: 30000000"
                  required
                />
              </div>
            </div>

            {/* Furnishing */}
            <div className="space-y-2">
              <Label htmlFor="furnishing">
                Nội thất <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.furnishing}
                onValueChange={(value) =>
                  setFormData({ ...formData, furnishing: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn tình trạng nội thất" />
                </SelectTrigger>
                <SelectContent className="bg-primary-foreground">
                  <SelectItem value="Đầy đủ">Đầy đủ</SelectItem>
                  <SelectItem value="Cơ bản">Cơ bản</SelectItem>
                  <SelectItem value="Không">Không</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </ScrollArea>

        <form onSubmit={handleSubmit}>
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
              className="bg-[#00AE26] hover:bg-[#00AE26]/90"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                "Lưu thay đổi"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
