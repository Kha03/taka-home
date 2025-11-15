"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Podcast } from "lucide-react";
import { useTranslations } from "next-intl";

interface PropertyDescriptionProps {
  description?: string;
}

export function PropertyDescription({
  description = "Căn hộ studio tại Vinhomes Grand Park được thiết kế hiện đại, tối ưu hóa không gian sống cho người trẻ và gia đình nhỏ. Vị trí đắc địa ngay trung tâm Quận 9 (nay là Thành phố Thủ Đức), thuận tiện di chuyển đến các khu vực trung tâm thành phố.",
}: PropertyDescriptionProps) {
  const t = useTranslations("propertyDetail");

  return (
    <Card className="shadow-none bg-background border-0 p-4 rounded-[12px] mb-3">
      <CardContent className="p-0">
        <div className="font-bold text-primary mb-4 flex items-center gap-2">
          <div className="w-6 h-6 flex items-center justify-center bg-[#D9D9D9] rounded-full">
            <Podcast className="h-3 w-3 text-primary" />
          </div>
          {t("detailedDescription")}
        </div>
        <div className="space-y-4 text-sm text-foreground leading-relaxed">
          <p>{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
