"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Building, Clock, MapPin } from "lucide-react";
import { PropertyDetails } from "./PropertyDetails";

export function PropertyMainContent() {
  return (
    <div className="space-y-6 bg-primary-foreground p-4 rounded-[12px] mb-3">
      {/* Property Title and Price */}
      <div>
        <h1 className="text-[26px] font-bold text-primary leading-tight">
          Cho thuê CĂN HỘ Studio TẠI VINHOMES GRAND PARK – Gần Siêu thị, chợ
          Quận 9
        </h1>
        <div className="flex justify-between items-center my-4">
          <p className="text-2xl font-bold text-secondary ">
            12.000.000 VND/Tháng
          </p>
          <PropertyDetails bathrooms={2} bedrooms={1} area={200} />
        </div>

        <div className="flex items-center gap-2 text-muted-foreground mb-2">
          <div className="flex items-center gap-2 w-6 h-6 justify-center bg-[#e5e5e5] rounded-full p-1">
            <MapPin className="h-4 w-4 text-primary" />
          </div>
          <span className="text-sm text-primary font-medium">
            Nguyễn Xiển, Phường Long Thạnh Mỹ (Quận 9 cũ), Thành phố Thủ Đức, Tp
            Hồ Chí Minh
          </span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="flex items-center gap-2 w-6 h-6 justify-center bg-[#e5e5e5] rounded-full p-1">
            <Clock className="h-4 w-4 text-primary" />
          </div>
          <span className="text-sm text-primary font-medium">
            Cập nhật 12 giờ trước
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
                      Chung cư
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
                      30 m2
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
                      Số lượng
                    </div>
                    <div className="font-bold text-sm text-foreground">12</div>
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
                      2 phòng
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
                      2 phòng
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
                      Nội thất đầy đủ
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
