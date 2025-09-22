"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Podcast } from "lucide-react";

interface PropertyDescriptionProps {
  description?: string;
  amenities?: string[];
  furniture?: string[];
  summary?: string;
}

export function PropertyDescription({
  description = "Căn hộ studio tại Vinhomes Grand Park được thiết kế hiện đại, tối ưu hóa không gian sống cho người trẻ và gia đình nhỏ. Vị trí đắc địa ngay trung tâm Quận 9 (nay là Thành phố Thủ Đức), thuận tiện di chuyển đến các khu vực trung tâm thành phố.",
  amenities = [
    "Hệ thống an ninh 24/7 với camera giám sát",
    "Hồ bơi, phòng gym, khu vui chơi trẻ em",
    "Khu thương mại, siêu thị trong tòa nhà",
    "Gần trường học, bệnh viện, trung tâm mua sắm",
    "Giao thông thuận tiện với hệ thống xe buýt và metro",
  ],
  furniture = [
    "Giường ngủ, tủ quần áo, bàn làm việc",
    "Tủ lạnh, máy giặt, điều hòa",
    "Bếp từ, lò vi sóng, đồ dùng nhà bếp cơ bản",
    "Sofa, bàn trà, TV màn hình phẳng",
    "Máy nước nóng, internet tốc độ cao",
  ],
  summary = "Căn hộ sẵn sàng để ở, thích hợp cho sinh viên, nhân viên văn phòng hoặc gia đình trẻ. Giá thuê bao gồm phí quản lý và một số tiện ích cơ bản.",
}: PropertyDescriptionProps) {
  return (
    <Card className="shadow-none bg-background border-0 p-4">
      <CardContent className="p-0">
        <p className="font-bold text-primary mb-4 flex items-center gap-2">
          <div className="w-6 h-6 flex items-center justify-center bg-[#D9D9D9] rounded-full">
            <Podcast className="h-3 w-3 text-primary" />
          </div>
          Mô tả chi tiết
        </p>
        <div className="space-y-4 text-sm text-foreground leading-relaxed">
          <p>{description}</p>

          <div>
            <h3 className="font-semibold text-primary mb-2">
              Tiện ích nổi bật:
            </h3>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              {amenities.map((amenity, index) => (
                <li key={index}>{amenity}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-primary mb-2">
              Nội thất bao gồm:
            </h3>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              {furniture.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <p className="font-medium text-primary">{summary}</p>
        </div>
      </CardContent>
    </Card>
  );
}
