"use client";

import { Breadcrumb } from "@/components/ui/breadcrumb";
import { HeroSearch } from "@/components/hero/hero-search";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { PropertyDetailView } from "@/components/ui/property-detail-view";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { propertyService } from "@/lib/api";
import type { Property, RoomTypeDetail } from "@/lib/api/types";
import { useTranslations } from "next-intl";

export default function PropertyDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const propertyId = params.id as string;
  const type = searchParams.get("type"); // 'boarding' or 'apartment'
  const t = useTranslations("common");
  const tProperty = useTranslations("property");
  const [property, setProperty] = useState<Property | RoomTypeDetail | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPropertyDetail = async () => {
      setLoading(true);
      setError(null);

      try {
        // If type is 'boarding', call getRoomTypeById
        // Otherwise, call getPropertyById for 'apartment'
        if (type === "boarding") {
          const response = await propertyService.getRoomTypeById(propertyId);
          if (response.code === 200 && response.data) {
            setProperty(response.data);
          } else {
            setError(tProperty("errorLoadingRoomInfo"));
          }
        } else {
          const response = await propertyService.getPropertyById(propertyId);
          if (response.code === 200 && response.data) {
            setProperty(response.data);
          } else {
            setError(tProperty("errorLoadingPropertyInfo"));
          }
        }
      } catch (err) {
        console.error("Failed to fetch property detail:", err);
        setError(tProperty("errorLoadingData"));
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetail();
  }, [propertyId, type, tProperty]);

  // Helper function to check if property is RoomTypeDetail
  const isRoomTypeDetail = (
    prop: Property | RoomTypeDetail
  ): prop is RoomTypeDetail => {
    return (
      "rooms" in prop &&
      Array.isArray(prop.rooms) &&
      prop.rooms.length > 0 &&
      "property" in prop.rooms[0]
    );
  };

  const tDetail = useTranslations("propertyDetail");

  // Helper function to get title from property
  const getPropertyTitle = (): string => {
    if (!property) return tDetail("detail");

    // Check if it's RoomTypeDetail (has rooms array with property inside)
    if (isRoomTypeDetail(property)) {
      return property.rooms[0].property.title;
    }

    // Otherwise it's Property (has title directly)
    return property.title;
  };

  const breadcrumbItems = [
    {
      href: "/search",
      label: t("search"),
    },
    {
      label: getPropertyTitle(),
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
        {loading && (
          <div className="text-center py-12">
            <LoadingSpinner size="lg" text={t("loadingData")} />
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {!loading && !error && property && (
          <PropertyDetailView property={property} type={type || "apartment"} />
        )}
      </div>
    </div>
  );
}
