"use client";

import { Flame, Home } from "lucide-react";
import { PropertySection } from "./property-section";

// Mock data cho bất động sản mới nhất - nhiều hơn để tạo layout 3 hàng
const newestProperties = [
  {
    title: "Villa Archetype Villa Archetype A11",
    price: "15.000.000 VNĐ/Tháng",
    location: "Example District",
    bedrooms: 4,
    bathrooms: 2,
    area: 1562,
    imageUrl: "/assets/imgs/house-item.png",
    isNew: true,
  },
  {
    title: "Villa Archetype Villa Archetype A11",
    price: "15.000.000 VNĐ/Tháng",
    location: "Example District",
    bedrooms: 4,
    bathrooms: 2,
    area: 1562,
    imageUrl: "/assets/imgs/house-item.png",
    isNew: true,
  },
  {
    title: "Villa Archetype Villa Archetype A11",
    price: "15.000.000 VNĐ/Tháng",
    location: "Example District",
    bedrooms: 4,
    bathrooms: 2,
    area: 1532,
    imageUrl: "/assets/imgs/house-item.png",
    isNew: true,
  },
  {
    title: "Villa Archetype Villa Archetype A11",
    price: "15.000.000 VNĐ/Tháng",
    location: "Example District",
    bedrooms: 4,
    bathrooms: 2,
    area: 1628,
    imageUrl: "/assets/imgs/house-item.png",
    isNew: true,
  },
  // Hàng thứ 2
  {
    title: "Villa Archetype Villa Archetype A11",
    price: "15.000.000 VNĐ/Tháng",
    location: "Example District",
    bedrooms: 4,
    bathrooms: 2,
    area: 1562,
    imageUrl: "/assets/imgs/house-item.png",
    isNew: true,
  },
  {
    title: "Villa Archetype Villa Archetype A11",
    price: "15.000.000 VNĐ/Tháng",
    location: "Example District",
    bedrooms: 4,
    bathrooms: 2,
    area: 1562,
    imageUrl: "/assets/imgs/house-item.png",
    isNew: true,
  },
  {
    title: "Villa Archetype Villa Archetype A11",
    price: "15.000.000 VNĐ/Tháng",
    location: "Example District",
    bedrooms: 4,
    bathrooms: 2,
    area: 1532,
    imageUrl: "/assets/imgs/house-item.png",
    isNew: true,
  },
  {
    title: "Villa Archetype Villa Archetype A11",
    price: "15.000.000 VNĐ/Tháng",
    location: "Example District",
    bedrooms: 4,
    bathrooms: 2,
    area: 1628,
    imageUrl: "/assets/imgs/house-item.png",
    isNew: true,
  },
  // Hàng thứ 3
  {
    title: "Villa Archetype Villa Archetype A11",
    price: "15.000.000 VNĐ/Tháng",
    location: "Example District",
    bedrooms: 4,
    bathrooms: 2,
    area: 1562,
    imageUrl: "/assets/imgs/house-item.png",
    isNew: true,
  },
  {
    title: "Villa Archetype Villa Archetype A11",
    price: "15.000.000 VNĐ/Tháng",
    location: "Example District",
    bedrooms: 4,
    bathrooms: 2,
    area: 1562,
    imageUrl: "/assets/imgs/house-item.png",
    isNew: true,
  },
  {
    title: "Villa Archetype Villa Archetype A11",
    price: "15.000.000 VNĐ/Tháng",
    location: "Example District",
    bedrooms: 4,
    bathrooms: 2,
    area: 1532,
    imageUrl: "/assets/imgs/house-item.png",
    isNew: true,
  },
  {
    title: "Villa Archetype Villa Archetype A11",
    price: "15.000.000 VNĐ/Tháng",
    location: "Example District",
    bedrooms: 4,
    bathrooms: 2,
    area: 1628,
    imageUrl: "/assets/imgs/house-item.png",
    isNew: true,
  },
];

export function NewestProperties() {
  return (
    <PropertySection
      title="Bất động sản mới nhất"
      icon={Flame}
      properties={newestProperties}
    />
  );
}
