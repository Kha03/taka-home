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
  imageUrl: string;
  isNew?: boolean;
  isFeatured?: boolean;
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
}: PropertyCardProps) {
  return (
    <Link href={`/properties/${id}`}>
      <Card className="group overflow-hidden border-0 bg-transparent shadow-none hover:bg-secondary/10  hover:shadow-lg transition-all duration-300 cursor-pointer p-2 rounded-[12px]">
        <div className="relative aspect-[325/160] overflow-hidden rounded-[12px]">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300 "
            sizes="(max-width:768px) 100vw, 325px"
          />
        </div>
        <CardContent className="p-0">
          <PropertyDetails
            bedrooms={bedrooms}
            bathrooms={bathrooms}
            area={area}
          />
          <div className="space-y-1 mt-2.5 border-t border-[#e5e5e5] pt-1.5">
            <h3 className="font-bold text-primary line-clamp-1 text-lg">
              {title}
            </h3>
            <p className="text-sm font-bold text-secondary">{price}</p>
            <p className="text-xs text-[#4f4f4f] flex items-center gap-1 ">
              <MapPin size={14} />
              {location}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
