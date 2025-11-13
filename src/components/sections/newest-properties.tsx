"use client";

import { Flame } from "lucide-react";
import { PropertySection } from "./property-section";
import { useEffect, useState } from "react";
import { propertyService } from "@/lib/api/services/property";
import type { Property } from "@/lib/api/types";

export function NewestProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewestProperties = async () => {
      try {
        setLoading(true);
        const response = await propertyService.getProperties({
          page: 1,
          limit: 9, // Lấy 8 properties mới nhất (2 hàng x 4 cột)
          isApproved: true,
          sortBy: "createdAt",
          sortOrder: "desc",
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const responseData = response.data as any;
        const propertiesData = responseData?.data || responseData;

        if (Array.isArray(propertiesData)) {
          const visibleProperties = propertiesData.filter(
            (p: Property) => p.isVisible === true
          );
          setProperties(visibleProperties);
        } else {
          console.warn("Response data is not an array:", propertiesData);
          setProperties([]);
        }
      } catch (error) {
        console.error("Error fetching newest properties:", error);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNewestProperties();
  }, []);

  // Convert API Property to PropertySection format
  const convertedProperties = properties.map((property) => ({
    id: property.id,
    title: property.title,
    price: `${property.price?.toLocaleString("vi-VN")} VNĐ/Tháng`,
    location: `${property.ward}, ${property.province}`,
    bedrooms: property.bedrooms || 0,
    bathrooms: property.bathrooms || 0,
    area: property.area || 0,
    imageUrl: property.heroImage || "/assets/imgs/house-item.png",
    isNew: true,
  }));

  if (loading) {
    return (
      <section className="pt-12 pb-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-primary">
              Bất động sản mới nhất
            </h2>
          </div>
          <div className="text-center py-8 text-gray-500">
            Đang tải dữ liệu...
          </div>
        </div>
      </section>
    );
  }

  return (
    <PropertySection
      title="Bất động sản mới nhất"
      icon={Flame}
      properties={convertedProperties}
    />
  );
}
