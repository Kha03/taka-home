"use client";

import { PropertyCard } from "@/components/ui/property-card";
import { AlignRight, ArrowRight, LucideIcon } from "lucide-react";
import { Button } from "../ui/button";

interface Property {
  title: string;
  price: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  imageUrl: string;
  isFeatured?: boolean;
  isNew?: boolean;
}

interface PropertySectionProps {
  title: string;
  icon: LucideIcon;
  properties: Property[];
}

export function PropertySection({
  title,
  icon: Icon,
  properties,
}: PropertySectionProps) {
  return (
    <section className="pt-12 pb-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center">
            <Icon className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-primary">{title}</h2>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {properties.map((property, index) => (
            <PropertyCard
              key={index}
              title={property.title}
              price={property.price}
              location={property.location}
              bedrooms={property.bedrooms}
              bathrooms={property.bathrooms}
              area={property.area}
              imageUrl={property.imageUrl}
              isFeatured={property.isFeatured}
              isNew={property.isNew}
            />
          ))}
        </div>
        <div className=" mt-8 w-full text-center">
          <Button
            variant="ghost"
            className="gap-2 text-foreground hover:bg-accent/50"
          >
            <div className="h-5 w-5 p-1 rounded-full bg-accent flex items-center justify-center">
              <ArrowRight />
            </div>
            Xem tất cả
          </Button>
        </div>
      </div>
    </section>
  );
}
