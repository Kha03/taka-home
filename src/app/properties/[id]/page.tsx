"use client";

import { Breadcrumb } from "@/components/ui/breadcrumb";
import { HeroSearch } from "@/components/hero/hero-search";
import { PropertyDetailView } from "@/components/ui/property-detail-view";
import { useParams } from "next/navigation";

export default function PropertyDetailPage() {
  const params = useParams();
  const propertyId = params.id as string;

  // Mock data - sẽ được thay thế bằng API call thực tế
  const property = {
    id: propertyId,
    title: "Villa Sang Trọng Gần Biển",
    price: "25 tỷ",
    location: "Huyện Hòa Vang, Đà Nẵng",
    area: "500m²",
    bedrooms: 4,
    bathrooms: 3,
    type: "Villa",
    images: [
      "/assets/imgs/DetailBDS.png",
      "/assets/imgs/DetailBDS2.png",
      "/assets/imgs/house-item.png",
      "/assets/imgs/house-item.png",
      "/assets/imgs/house-item.png",
      "/assets/imgs/house-item.png",
      "/assets/imgs/house-item.png",
    ],
    description:
      "Villa cao cấp với thiết kế hiện đại, vị trí đắc địa gần biển, đầy đủ tiện nghi. Không gian sống rộng rãi, thoáng mát với sân vườn riêng và hồ bơi. Thích hợp cho gia đình lớn hoặc làm nơi nghỉ dưỡng cuối tuần.",
    features: [
      "Gần biển",
      "Sân vườn",
      "Hồ bơi riêng",
      "Garage ô tô",
      "An ninh 24/7",
      "Nội thất cao cấp",
      "Điều hòa trung tâm",
      "Bếp hiện đại",
      "Phòng gym",
      "Sân thượng",
    ],
    agent: {
      name: "Nguyễn Văn A",
      phone: "0909123456",
      avatar: "/assets/imgs/avatar.png",
    },
  };

  const breadcrumbItems = [
    {
      href: "/search",
      label: "Tìm kiếm",
    },
    {
      label: property.title,
      current: true,
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFF7E9]">
      {/* Header with Search */}
      <div className="max-w-6xl mx-auto py-4">
        <div className="w-full">
          <HeroSearch />
        </div>
        <div className="mt-4 pl-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <PropertyDetailView property={property} />
      </div>
    </div>
  );
}
