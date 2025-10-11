import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bath, Maximize2, MapPin, Home, Sofa } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface UnitBadge {
  code: string;
  status: "rented" | "empty";
}

interface FloorUnits {
  floor: string;
  units: UnitBadge[];
}

interface RoomType {
  name: string;
  floors: FloorUnits[];
  bedrooms: number;
  bathrooms: number;
  area: number;
  furniture: string;
  images: string[];
  price: number;
}

export interface PropertyUnitProps {
  title: string;
  address: string;
  mainImage: string;
  rentedCount: number;
  emptyCount: number;
  monthlyIncome: number;
  roomTypes: RoomType[];
  currency?: string;
}

export function PropertyUnit({
  title,
  address,
  mainImage,
  rentedCount,
  emptyCount,
  monthlyIncome,
  roomTypes,
  currency = "VND",
}: PropertyUnitProps) {
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN").format(price);

  return (
    <Card className="overflow-hidden bg-primary-foreground p-3 pb-5">
      <div className="flex gap-3">
        {/* Top header like the mockup */}
        {/* Left column: image + quick stats */}
        <div className="w-full sm:w-auto">
          <div className="rounded-xl overflow-hidden bg-primary-foreground w-[210px] md:w-54">
            <div className="w-full md:h-33 rounded-[8px] overflow-hidden relative">
              <Image
                src={mainImage || "/placeholder.svg"}
                alt={title}
                fill
                className="object-cover"
                style={{ objectFit: "cover" }}
                sizes="(max-width: 640px) 100vw, 216px"
              />
            </div>

            <div className="px-4 py-3">
              <div className="grid grid-cols-2 gap-1">
                <div className="p-3 text-center rounded-[12px] bg-[#00AE26]/20 text-[#00AE26] flex flex-col">
                  <span className="font-bold ">{rentedCount}</span>
                  <span className="text-xs">Đã thuê</span>
                </div>
                <div className="text-center rounded-[12px] bg-[#C3C3C3]/20 text-[#4F4F4F] p-3 flex flex-col">
                  <span className="font-bold">{emptyCount}</span>
                  <span className="text-xs">Trống</span>
                </div>
              </div>

              <div className="mt-3 text-muted-foreground text-center">
                <div className="text-sm text-muted-foreground mb-1">
                  Tổng thu nhập/Tháng
                </div>
                <div className="inline-block rounded-2xl bg-primary px-3 py-1.5 text-primary-foreground text-xs font-bold">
                  {formatPrice(monthlyIncome)} {currency}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Middle: title + address + Room types */}
        <div className="flex-1 min-w-0">
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-2 text-primary">{title}</h3>
            <div className="flex items-center gap-1 text-sm text-[#4f4f4f]">
              <div className="w-6 h-6 rounded-full bg-[#e5e5e5] flex items-center justify-center">
                <MapPin className="w-4 h-4 text-primary" />
              </div>
              <span>{address}</span>
            </div>
          </div>

          {/* Room types */}
          <div className="space-y-4">
            {roomTypes.map((roomType, idx) => (
              <div
                key={idx}
                className="relative rounded-xl border-dashed border-[#e5e5e5] border-2"
              >
                {/* Badge positioned on border */}
                <div className="absolute -top-3 left-4 z-10">
                  <Badge className="bg-accent hover:bg-accent text-white cursor-default">
                    {roomType.name}
                  </Badge>
                </div>
                <div className="p-3 sm:p-4 sm:pt-6 ">
                  <div className="flex flex-col xl:flex-row gap-2">
                    {/* Floors & units list */}
                    <div className="bg-[#C3C3C3]/20 p-3 rounded-[12px] w-[344px]">
                      <div className="space-y-1.5">
                        {roomType.floors.map((floor, fIdx) => (
                          <div key={fIdx} className="flex items-center gap-1">
                            <p className="min-w-14 text-xs font-bold text-[#4f4f4f]">
                              {floor.floor}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {floor.units.map((u, uIdx) => (
                                <Badge
                                  key={uIdx}
                                  variant="secondary"
                                  className={cn(
                                    "text-sm rounded-[30px] min-w-[56px] justify-center",
                                    u.status === "rented"
                                      ? "bg-[#00AE26] hover:bg-[#00AE26] text-primary-foreground"
                                      : "bg-[#E5E5E5] hover:bg-[#E5E5E5] text-[#8D8D8D]"
                                  )}
                                >
                                  {u.code}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Room info icons */}
                    <div className="p-3 grid grid-cols-2 gap-2 items-center rounded-[12px] bg-[#C3C3C3]/20 text-xs text-primary">
                      {/* 1) Phòng ngủ (giữ nguyên của bạn) */}
                      <div className="flex items-center gap-1 h-10">
                        <div className="w-6 h-6 flex items-center justify-center rounded-full bg-[#818181]/20">
                          <Home className="w-4 h-4" />
                        </div>
                        <p>Phòng ngủ</p>
                        <p className="font-extrabold ml-auto">
                          {roomType.bedrooms}
                        </p>
                      </div>

                      {/* 2) Diện tích —  */}
                      <div className="flex items-center gap-1 h-10">
                        <div className="w-6 h-6 flex items-center justify-center rounded-full bg-[#818181]/20">
                          <Maximize2 className="w-4 h-4" />
                        </div>
                        <p>Diện tích</p>
                        <p className="font-extrabold ml-auto">
                          {roomType.area} m²
                        </p>
                      </div>

                      {/* 3) Phòng vệ sinh —  */}
                      <div className="flex items-center gap-1 h-10">
                        <div className="w-6 h-6 flex items-center justify-center rounded-full bg-[#818181]/20">
                          <Bath className="w-4 h-4" />
                        </div>
                        <p>Phòng vệ sinh</p>
                        <p className="font-extrabold ml-auto">
                          {roomType.bathrooms}
                        </p>
                      </div>

                      {/* 4) Nội thất —  */}
                      <div className="flex items-center gap-1 h-10">
                        <div className="w-6 h-6 flex items-center justify-center rounded-full bg-[#818181]/20">
                          <Sofa className="w-4 h-4" />
                        </div>
                        <p>Nội thất</p>
                        <p className="font-extrabold ml-auto">
                          {roomType.furniture}
                        </p>
                      </div>
                    </div>

                    {/* Images + price */}
                    <div className="w-[250px] flex flex-col gap-3">
                      <div className="grid grid-cols-2 gap-2">
                        {roomType.images.slice(0, 2).map((img, i) => (
                          <div
                            key={i}
                            className="relative h-20 rounded-lg overflow-hidden"
                          >
                            <Image
                              src={img || "/placeholder.svg"}
                              alt={`${roomType.name} ${i + 1}`}
                              fill
                              className="object-cover"
                              sizes="(max-width: 640px) 100vw, 216px"
                            />
                          </div>
                        ))}
                      </div>
                      <div className="flex bg-[#f5f5f5] rounded-2xl py-2 justify-center">
                        <div className="text-sm text-muted-foreground">
                          Giá thuê:
                        </div>
                        <div className="text-sm font-bold text-secondary ml-1">
                          {roomType.price.toLocaleString("vi-VN")} VND
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
