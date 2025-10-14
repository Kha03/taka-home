"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { PropertyCard } from "@/components/ui/property-card";
import { PropertyListCard } from "@/components/ui/property-list-card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Grid, List } from "lucide-react";
import { propertyService } from "@/lib/api/services";
import type { Property, PropertyTypeEnum } from "@/lib/api/types";

// Define RoomType interface for BOARDING properties (returned as room types)
interface RoomType {
  id: string;
  name: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  price: number;
  deposit: number;
  furnishing: string;
  images: string[];
  description: string;
  heroImage: string | null;
  rooms: Array<{
    id: string;
    name: string;
    floor: number;
    isVisible: boolean;
  }>;
  property: {
    id: string;
    title: string;
    province: string;
    ward: string;
    address: string;
    isApproved: boolean;
    landlord: {
      id: string;
      name: string;
    };
  };
}

// Union type for mixed response (Property for APARTMENT, RoomType for BOARDING)
type PropertyOrRoomType = Property | RoomType;

// Type guard to check if item is RoomType (BOARDING)
function isRoomType(item: PropertyOrRoomType): item is RoomType {
  return "property" in item && "rooms" in item && !("type" in item);
}

// Response data interface from API
interface PropertyListResponse {
  data: PropertyOrRoomType[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export function SearchResults() {
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [properties, setProperties] = useState<PropertyOrRoomType[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Handle sort change
  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
  };

  // Fetch properties when search params or pagination changes
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        // Get search params from URL
        const q = searchParams.get("q") || undefined;
        const type = searchParams.get("type") as PropertyTypeEnum | undefined;
        const province = searchParams.get("province") || undefined;

        // Get filter params
        const fromPrice = searchParams.get("fromPrice")
          ? Number(searchParams.get("fromPrice"))
          : undefined;
        const toPrice = searchParams.get("toPrice")
          ? Number(searchParams.get("toPrice"))
          : undefined;
        const bedrooms = searchParams.get("bedrooms")
          ? Number(searchParams.get("bedrooms"))
          : undefined;
        const bathrooms = searchParams.get("bathrooms")
          ? Number(searchParams.get("bathrooms"))
          : undefined;
        const fromArea = searchParams.get("fromArea")
          ? Number(searchParams.get("fromArea"))
          : undefined;
        const toArea = searchParams.get("toArea")
          ? Number(searchParams.get("toArea"))
          : undefined;
        const furnishing = searchParams.get("furnishing") || undefined;

        // Map sortBy to API params based on local state
        let sortByField: "price" | "area" | "createdAt" = "createdAt";
        let sortOrder: "asc" | "desc" = "desc";

        if (sortBy === "newest") {
          sortByField = "createdAt";
          sortOrder = "desc";
        } else if (sortBy === "price-low") {
          sortByField = "price";
          sortOrder = "asc";
        } else if (sortBy === "price-high") {
          sortByField = "price";
          sortOrder = "desc";
        } else if (sortBy === "area-large") {
          sortByField = "area";
          sortOrder = "desc";
        }

        // Build query object, only include non-default values
        const query: Record<string, unknown> = {
          isApproved: true, // Always filter approved properties
        };

        // Only add params if they have values
        if (q) query.q = q;
        if (type) query.type = type;
        if (province) query.province = province;
        if (fromPrice) query.fromPrice = fromPrice;
        if (toPrice) query.toPrice = toPrice;
        if (bedrooms) query.bedrooms = bedrooms;
        if (bathrooms) query.bathrooms = bathrooms;
        if (fromArea) query.fromArea = fromArea;
        if (toArea) query.toArea = toArea;
        if (furnishing) query.furnishing = furnishing;

        // Add pagination
        query.page = currentPage;
        query.limit = 10;

        // Add sort params
        query.sortBy = sortByField;
        query.sortOrder = sortOrder;

        const response = await propertyService.getProperties(query);

        if (response.code === 200 && response.data) {
          // Update with new structure: response.data.data contains properties
          const responseData = response.data as unknown as PropertyListResponse;
          setProperties(responseData.data || []);

          // Update pagination info
          if (responseData.pagination) {
            setPagination(responseData.pagination);
          }
        }
      } catch (error) {
        console.error("Failed to fetch properties:", error);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [searchParams, currentPage, sortBy]);

  return (
    <div className="space-y-6 bg-white px-6 py-5 rounded-2xl">
      {/* Header with results count and controls */}
      <div className="mb-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="font-bold text-primary-foreground px-3 py-2 bg-secondary w-33 text-center rounded-[30px]">
              Tất cả ({loading ? "..." : pagination.totalItems})
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Sort Select */}
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-[150px] gap-2 bg-[#E5E5E5] border-none hover:bg-[#E5E5E5] focus:ring-0 focus:ring-offset-0">
                <SelectValue>
                  <span className="text-xs text-primary font-medium">
                    {sortBy === "newest" && "Tin mới nhất"}
                    {sortBy === "price-low" && "Giá thấp đến cao"}
                    {sortBy === "price-high" && "Giá cao đến thấp"}
                    {sortBy === "area-large" && "Diện tích lớn nhất"}
                  </span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-primary-foreground">
                <SelectItem value="newest">Tin mới nhất</SelectItem>
                <SelectItem value="price-low">Giá thấp đến cao</SelectItem>
                <SelectItem value="price-high">Giá cao đến thấp</SelectItem>
                <SelectItem value="area-large">Diện tích lớn nhất</SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode Toggle */}
            <div className="flex border rounded-lg">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">Đang tải dữ liệu...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && properties.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Không tìm thấy bất động sản phù hợp</p>
        </div>
      )}

      {/* Results Grid/List */}
      {!loading &&
        properties.length > 0 &&
        (viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {properties.map((item) => {
              // Check if this is a RoomType (BOARDING)
              if (isRoomType(item)) {
                return (
                  <PropertyCard
                    key={item.id}
                    id={item.property.id} // Link to parent property
                    title={item.property.title}
                    roomType={item.name} // Display room type name
                    price={`${item.price.toLocaleString("vi-VN")}VND/Tháng`}
                    location={`${item.property.address}, ${item.property.ward}, ${item.property.province}`}
                    bedrooms={item.bedrooms}
                    bathrooms={item.bathrooms}
                    area={item.area}
                    imageUrl={
                      item.heroImage ||
                      item.images?.[0] ||
                      "/assets/imgs/house-item.png"
                    }
                  />
                );
              }

              // Otherwise it's a regular Property (APARTMENT)
              return (
                <PropertyCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  price={`${(item.price || 0).toLocaleString(
                    "vi-VN"
                  )}VND/Tháng`}
                  location={`${item.address}, ${item.ward}, ${item.province}`}
                  bedrooms={item.bedrooms || 0}
                  bathrooms={item.bathrooms || 0}
                  area={item.area || 0}
                  imageUrl={
                    item.heroImage ||
                    item.gallery?.[0] ||
                    "/assets/imgs/house-item.png"
                  }
                />
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {properties.map((item) => {
              // Check if this is a RoomType (BOARDING)
              if (isRoomType(item)) {
                return (
                  <PropertyListCard
                    key={item.id}
                    id={item.property.id} // Link to parent property
                    title={item.property.title}
                    roomType={item.name} // Display room type name
                    price={`${item.price.toLocaleString("vi-VN")}VND/Tháng`}
                    location={`${item.property.address}, ${item.property.ward}, ${item.property.province}`}
                    bedrooms={item.bedrooms}
                    bathrooms={item.bathrooms}
                    area={item.area}
                    imageUrl={
                      item.heroImage ||
                      item.images?.[0] ||
                      "/assets/imgs/house-item.png"
                    }
                  />
                );
              }

              // Otherwise it's a regular Property (APARTMENT)
              return (
                <PropertyListCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  price={`${(item.price || 0).toLocaleString(
                    "vi-VN"
                  )}VND/Tháng`}
                  location={`${item.address}, ${item.ward}, ${item.province}`}
                  bedrooms={item.bedrooms || 0}
                  bathrooms={item.bathrooms || 0}
                  area={item.area || 0}
                  imageUrl={
                    item.heroImage ||
                    item.gallery?.[0] ||
                    "/assets/imgs/house-item.png"
                  }
                  timePosted={item.updatedAt}
                />
              );
            })}
          </div>
        ))}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (pagination.hasPrevPage) {
                      setCurrentPage(currentPage - 1);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                  }}
                  className={
                    !pagination.hasPrevPage
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>

              {/* First page */}
              {currentPage > 2 && (
                <PaginationItem>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(1);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    1
                  </PaginationLink>
                </PaginationItem>
              )}

              {/* Ellipsis if needed */}
              {currentPage > 3 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              {/* Previous page */}
              {currentPage > 1 && (
                <PaginationItem>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(currentPage - 1);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    {currentPage - 1}
                  </PaginationLink>
                </PaginationItem>
              )}

              {/* Current page */}
              <PaginationItem>
                <PaginationLink
                  href="#"
                  isActive
                  onClick={(e) => e.preventDefault()}
                >
                  {currentPage}
                </PaginationLink>
              </PaginationItem>

              {/* Next page */}
              {currentPage < pagination.totalPages && (
                <PaginationItem>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(currentPage + 1);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    {currentPage + 1}
                  </PaginationLink>
                </PaginationItem>
              )}

              {/* Ellipsis if needed */}
              {currentPage < pagination.totalPages - 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              {/* Last page */}
              {currentPage < pagination.totalPages - 1 && (
                <PaginationItem>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(pagination.totalPages);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    {pagination.totalPages}
                  </PaginationLink>
                </PaginationItem>
              )}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (pagination.hasNextPage) {
                      setCurrentPage(currentPage + 1);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                  }}
                  className={
                    !pagination.hasNextPage
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
