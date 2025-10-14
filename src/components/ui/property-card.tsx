import { Card, CardContent } from "@/components/ui/card";
import { PropertyDetails } from "@/components/property-detail/PropertyDetails";
import { MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface PropertyCardProps {
  id?: string;
  title: string;
  price: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  imageUrl?: string;
  isNew?: boolean;
  isFeatured?: boolean;
  roomType?: string; // Tên loại phòng cho BOARDING
}

export function PropertyCard({
  id = "1",
  title,
  price,
  location,
  bedrooms,
  bathrooms,
  area,
  imageUrl,
  roomType,
}: PropertyCardProps) {
  return (
    <Link href={`/properties/${id}`} className="h-full">
      <Card className="h-full flex flex-col group overflow-hidden border-0 bg-transparent shadow-none hover:bg-secondary/10 hover:shadow-lg transition-all duration-300 cursor-pointer p-2 rounded-[12px]">
        <div className="relative aspect-[325/160] overflow-hidden rounded-[12px]">
          <Image
            src={imageUrl || "/assets/imgs/map-location.png"}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width:768px) 100vw, 325px"
          />
        </div>
        <CardContent className="p-0 flex-1 flex flex-col">
          <PropertyDetails
            bedrooms={bedrooms}
            bathrooms={bathrooms}
            area={area}
          />
          <div className="space-y-1 mt-2.5 border-t border-[#e5e5e5] pt-1.5 flex-1 flex flex-col">
            <h3 className="font-bold text-primary line-clamp-1 text-lg">
              {title}
            </h3>
            <div className="flex justify-between items-center gap-2">
              <p className="text-sm font-bold text-secondary truncate">
                {price}
              </p>
              {roomType && (
                <p className="text-xs font-semibold text-accent whitespace-nowrap flex-shrink-0">
                  {roomType}
                </p>
              )}
            </div>
            <p className="text-xs text-[#4f4f4f] flex items-center gap-1 line-clamp-2 mt-auto">
              <MapPin size={14} className="flex-shrink-0" />
              <span className="break-words">{location}</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
