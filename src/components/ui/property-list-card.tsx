import { Card, CardContent } from "@/components/ui/card";
import { PropertyDetails } from "@/components/ui/property-details";
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
  timePosted = "Cập nhật 12 giờ trước",
}: PropertyListCardProps) {
  return (
    <Link href={`/properties/${id}`}>
      <Card className="p-3 group border-none overflow-hidden bg-transparent shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer rounded-[12px] hover:bg-secondary/10">
        <CardContent className="p-0">
          <div className="flex gap-4">
            {/* Image */}
            <div className="relative w-[216px] flex-shrink-0 overflow-hidden rounded-[8px]">
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col">
              <h3 className="font-bold text-primary text-lg line-clamp-1">
                {title}
              </h3>

              <div className="flex items-center justify-between mt-4">
                <PropertyDetails
                  bedrooms={bedrooms}
                  bathrooms={bathrooms}
                  area={area}
                />
                <p className=" font-extrabold text-secondary">{price}</p>
              </div>
              <div className="mt-2">
                <p className="text-sm text-[#4f4f4f] flex items-center gap-1 font-medium">
                  <div className="w-6 h-6 flex items-center justify-center bg-[#E5E5E5] rounded-full">
                    <Clock size={12} className="flex-shrink-0" />
                  </div>
                  {timePosted}
                </p>
              </div>
              <div className="mt-2">
                <p className="text-sm text-[#4f4f4f] flex items-center gap-1 line-clamp-2 font-medium">
                  <div className="w-6 h-6 flex items-center justify-center bg-[#E5E5E5] rounded-full">
                    <MapPin size={12} className="flex-shrink-0" />
                  </div>

                  {location}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
