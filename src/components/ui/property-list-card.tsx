import { Card, CardContent } from "@/components/ui/card";
import { PropertyDetails } from "@/components/property-detail/PropertyDetails";
import { MapPin, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface PropertyListCardProps {
  id?: string;
  title: string;
  price: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  imageUrl: string;
  timePosted?: string;
  isNew?: boolean;
  isFeatured?: boolean;
  roomType?: string; // Tên loại phòng cho BOARDING
}

export function PropertyListCard({
  id = "1",
  title,
  price,
  location,
  bedrooms,
  bathrooms,
  area,
  imageUrl,
  timePosted,
  roomType,
}: PropertyListCardProps) {
  return (
    <Link href={`/properties/${id}`}>
      <Card className="p-3 group border-none overflow-hidden bg-transparent shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer rounded-[12px] hover:bg-secondary/10">
        <CardContent className="p-0">
          <div className="flex gap-4 min-h-[160px] items-center">
            {/* Image */}
            <div className="relative w-[216px] h-[160px] flex-shrink-0 overflow-hidden rounded-[8px]">
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 100vw, 216px"
              />
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col min-w-0">
              <h3 className="font-bold text-primary text-lg line-clamp-1">
                {title}
              </h3>
              {roomType && (
                <p className="text-xs font-semibold text-accent mt-1 truncate">
                  {roomType}
                </p>
              )}

              <div className="flex items-center justify-between mt-2 gap-2">
                <div className="flex-shrink-0">
                  <PropertyDetails
                    bedrooms={bedrooms}
                    bathrooms={bathrooms}
                    area={area}
                  />
                </div>
                <p className="font-extrabold text-secondary whitespace-nowrap flex-shrink-0">
                  {price}
                </p>
              </div>
              <div className="mt-2">
                <div className="text-sm text-[#4f4f4f] flex items-center gap-1 font-medium">
                  <div className="w-6 h-6 flex items-center justify-center bg-[#E5E5E5] rounded-full flex-shrink-0">
                    <Clock size={12} className="flex-shrink-0" />
                  </div>
                  <span className="truncate">
                    {timePosted
                      ? new Date(timePosted).toLocaleDateString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })
                      : "Cập nhật gần đây"}
                  </span>
                </div>
              </div>
              <div className="mt-2">
                <div className="text-sm text-[#4f4f4f] flex items-center gap-1 font-medium">
                  <div className="w-6 h-6 flex items-center justify-center bg-[#E5E5E5] rounded-full flex-shrink-0">
                    <MapPin size={12} className="flex-shrink-0" />
                  </div>
                  <span className="line-clamp-2 break-words">{location}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
