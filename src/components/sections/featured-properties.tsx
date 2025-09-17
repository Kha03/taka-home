"use client";

import { Star } from "lucide-react";
import { PropertySection } from "./property-section";

// Mock data - trong thực tế sẽ lấy từ API
const featuredProperties = [
  {
    title: "Villa Archetype Villa Archetype A11",
    price: "15.000.000 VNĐ/Tháng",
    location: "Example District",
    bedrooms: 4,
    bathrooms: 2,
    area: 1250,
    imageUrl: "/assets/imgs/house-item.png",
    isFeatured: true,
  },
  {
    title: "Villa Archetype Villa Archetype A11",
    price: "15.000.000 VNĐ/Tháng",
    location: "Example District",
    bedrooms: 4,
    bathrooms: 2,
    area: 1250,
    imageUrl: "/assets/imgs/house-item.png",
    isFeatured: true,
  },
  {
    title: "Villa Archetype Villa Archetype A11",
    price: "15.000.000 VNĐ/Tháng",
    location: "Example District",
    bedrooms: 4,
    bathrooms: 2,
    area: 1625,
    imageUrl: "/assets/imgs/house-item.png",
    isFeatured: true,
  },
  {
    title: "Villa Archetype Villa Archetype A11",
    price: "15.000.000 VNĐ/Tháng",
    location: "Example District",
    bedrooms: 4,
    bathrooms: 2,
    area: 1512,
    imageUrl: "/assets/imgs/house-item.png",
    isFeatured: true,
  },
];

export function FeaturedProperties() {
  return (
    <PropertySection
      title="Bất động sản nổi bật"
      icon={Star}
      properties={featuredProperties}
    />
  );
}
