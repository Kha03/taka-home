"use client";

import { useState, useMemo, useEffect } from "react";
import StatusTab from "@/components/ui/status-tab";
import PropertyViewTab from "@/components/myproperties/property-view-tab";
import PropertyFilter from "@/components/myproperties/property-filter";
import { PropertyRoom } from "@/components/myproperties/PropertyRoom";
import { PropertyUnit } from "@/components/myproperties/PropertyUnit";
import { PropertyDetailModal } from "@/components/myproperties/PropertyDetailModal";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { propertyService } from "@/lib/api/services/property";
import type { Property } from "@/lib/api/types";
import { PropertyRoomProps } from "@/components/myproperties/PropertyRoom";
import { PropertyUnitProps } from "@/components/myproperties/PropertyUnit";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function MyPropertiesPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [activeView, setActiveView] = useState("room"); // "room" or "unit"
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  // Map từ room/property ID đến property gốc để hiển thị modal
  const propertyIdMap = useMemo(() => {
    const map = new Map<string, string>();

    properties.forEach((property) => {
      // Lưu chính property ID
      map.set(property.id, property.id);

      // Nếu là BOARDING, lưu mapping từ room ID về property ID
      if (property.type === "BOARDING" && property.rooms) {
        property.rooms.forEach((room) => {
          if (room.id) {
            map.set(room.id, property.id);
          }
          // Backup mapping bằng combined ID
          map.set(`${property.id}-${room.name}`, property.id);
        });
      }
    });

    return map;
  }, [properties]);

  // Handler khi click vào property/room để xem chi tiết
  const handlePropertyClick = (roomOrPropertyId: string) => {
    const propertyId = propertyIdMap.get(roomOrPropertyId);
    if (propertyId) {
      const property = properties.find((p) => p.id === propertyId);
      if (property) {
        setSelectedProperty(property);
        setDetailModalOpen(true);
      }
    }
  };

  // Fetch properties from API
  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await propertyService.getMyProperties();
      if (response.data) {
        setProperties(response.data);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // Convert API Property to PropertyRoomProps for Room View
  // For APARTMENT & HOUSING: hiển thị toàn bộ căn hộ/nhà như 1 property
  // For BOARDING: mỗi room sẽ là 1 PropertyRoom riêng với thông tin từ nested roomType
  const convertToPropertyRooms = (property: Property): PropertyRoomProps[] => {
    // Nếu là APARTMENT hoặc HOUSING, trả về 1 item duy nhất
    if (property.type === "APARTMENT" || property.type === "HOUSING") {
      const category = property.type === "APARTMENT" ? "Chung cư" : "Nhà riêng";

      return [
        {
          id: property.id,
          title: property.title,
          image: property.heroImage || "/assets/imgs/house-item.png",
          status: property.isVisible ? "Trống" : "Đang cho thuê",
          roomCode: property.unit || property.id.slice(0, 6).toUpperCase(),
          isRented: !property.isVisible,
          bedrooms: property.bedrooms || 0,
          bathrooms: property.bathrooms || 0,
          area: property.area || 0,
          address: `${property.address}, ${property.ward}, ${property.province}`,
          furnitureStatus: property.furnishing || "Không rõ",
          category: category,
          price: property.price || 0,
          currency: "VND",
        },
      ];
    }

    // Nếu là BOARDING, tạo 1 PropertyRoom cho mỗi room
    // Room có nested roomType với đầy đủ thông tin
    if (property.type === "BOARDING" && property.rooms) {
      const rooms: PropertyRoomProps[] = property.rooms.map((room) => ({
        id: room.id || `${property.id}-${room.name}`,
        title: `${property.title} - ${room.name}`,
        image:
          room.roomType?.heroImage ||
          property.heroImage ||
          "/assets/imgs/house-item.png",
        status: room.isVisible ? "Trống" : "Đang cho thuê",
        roomCode: room.name,
        roomType: room.roomType?.name, // Hiển thị loại phòng (VD: "Loại 1", "Loại 2")
        isRented: !room.isVisible,
        bedrooms: room.roomType?.bedrooms || 0,
        bathrooms: room.roomType?.bathrooms || 0,
        area: room.roomType?.area || 0,
        address: `${property.address}, ${property.ward}, ${property.province}`,
        furnitureStatus: room.roomType?.furnishing || "Không rõ",
        category: "Nhà trọ",
        price: room.roomType?.price || 0,
        currency: "VND",
      }));

      return rooms;
    }

    // Fallback cho các trường hợp khác
    return [
      {
        id: property.id,
        title: property.title,
        image: property.heroImage || "/assets/imgs/house-item.png",
        status: property.isVisible ? "Trống" : "Đang cho thuê",
        roomCode: property.id.slice(0, 6).toUpperCase(),
        isRented: !property.isVisible,
        bedrooms: property.bedrooms || 0,
        bathrooms: property.bathrooms || 0,
        area: property.area || 0,
        address: `${property.address}, ${property.ward}, ${property.province}`,
        furnitureStatus: property.furnishing || "Không rõ",
        category: "Khác",
        price: property.price || 0,
        currency: "VND",
      },
    ];
  };

  // Convert API Property to PropertyUnitProps for Unit View (for BOARDING type)
  const convertToPropertyUnit = (property: Property): PropertyUnitProps => {
    // Calculate rented and empty counts based on rooms
    const rentedCount =
      property.rooms?.filter((room) => !room.isVisible).length || 0;
    const emptyCount =
      property.rooms?.filter((room) => room.isVisible).length || 0;

    // Calculate monthly income based on rented rooms
    // Mỗi room có roomType với price, cộng dồn giá của các phòng đã thuê
    const monthlyIncome =
      property.rooms?.reduce((total, room) => {
        if (!room.isVisible && room.roomType) {
          return total + (room.roomType.price || 0);
        }
        return total;
      }, 0) || 0;

    // Group rooms by roomType and floor
    // Nhóm các room theo roomType.id và floor
    const roomTypeMap = new Map<
      string,
      {
        name: string;
        bedrooms: number;
        bathrooms: number;
        area: number;
        furniture: string;
        images: string[];
        price: number;
        floors: Map<number, typeof property.rooms>;
      }
    >();

    property.rooms?.forEach((room) => {
      if (!room.roomType) return;

      const roomTypeId = room.roomType.id || room.roomType.name;

      // Khởi tạo roomType nếu chưa có
      if (!roomTypeMap.has(roomTypeId)) {
        roomTypeMap.set(roomTypeId, {
          name: room.roomType.name,
          bedrooms: room.roomType.bedrooms,
          bathrooms: room.roomType.bathrooms,
          area: room.roomType.area,
          furniture: room.roomType.furnishing || "Không",
          images: room.roomType.images || ["/assets/imgs/house-item.png"],
          price: room.roomType.price,
          floors: new Map(),
        });
      }

      const roomTypeData = roomTypeMap.get(roomTypeId)!;

      // Thêm room vào floor tương ứng
      if (!roomTypeData.floors.has(room.floor)) {
        roomTypeData.floors.set(room.floor, []);
      }
      roomTypeData.floors.get(room.floor)?.push(room);
    });

    // Convert Map to array
    const roomTypes = Array.from(roomTypeMap.values()).map((roomTypeData) => ({
      name: roomTypeData.name,
      bedrooms: roomTypeData.bedrooms,
      bathrooms: roomTypeData.bathrooms,
      area: roomTypeData.area,
      furniture: roomTypeData.furniture,
      images: roomTypeData.images,
      price: roomTypeData.price,
      floors: Array.from(roomTypeData.floors.entries())
        .sort(([a], [b]) => a - b)
        .map(([floorNum, rooms]) => ({
          floor: `Tầng ${floorNum}`,
          units: (rooms || []).map((room) => ({
            code: room.name,
            status: (room.isVisible ? "empty" : "rented") as "empty" | "rented",
          })),
        })),
    }));

    return {
      title: property.title,
      address: `${property.address}, ${property.ward}, ${property.province}`,
      mainImage: property.heroImage || "/assets/imgs/house-item.png",
      rentedCount,
      emptyCount,
      monthlyIncome,
      currency: "VND",
      roomTypes,
    };
  };

  const propertyTabs = useMemo(() => {
    let totalAll = 0;
    let totalRented = 0;
    let totalEmpty = 0;

    if (activeView === "room") {
      // Xem theo phòng: đếm tổng số phòng cho BOARDING, tổng số properties cho APARTMENT & HOUSING
      properties.forEach((property) => {
        if (property.type === "BOARDING" && property.rooms) {
          // Đếm từng room trực tiếp từ property.rooms
          const roomsCount = property.rooms.length;
          const rentedRooms = property.rooms.filter(
            (room) => !room.isVisible
          ).length;
          const emptyRooms = roomsCount - rentedRooms;

          totalAll += roomsCount;
          totalRented += rentedRooms;
          totalEmpty += emptyRooms;
        } else {
          // APARTMENT & HOUSING: đếm property
          totalAll += 1;
          if (!property.isVisible) {
            totalRented += 1;
          } else {
            totalEmpty += 1;
          }
        }
      });
    } else {
      // Xem theo căn: chỉ đếm các BĐS loại BOARDING
      const boardingProperties = properties.filter(
        (p) => p.type === "BOARDING"
      );

      boardingProperties.forEach((property) => {
        if (property.rooms) {
          const roomsCount = property.rooms.length;
          const rentedRooms = property.rooms.filter(
            (room) => !room.isVisible
          ).length;
          const emptyRooms = roomsCount - rentedRooms;

          totalAll += roomsCount;
          totalRented += rentedRooms;
          totalEmpty += emptyRooms;
        }
      });
    }

    return [
      { id: "all", label: "Tất cả", count: totalAll },
      { id: "rented", label: "Đang cho thuê", count: totalRented },
      { id: "empty", label: "Trống", count: totalEmpty },
    ];
  }, [properties, activeView]);

  const PAGE_SIZE = 4;

  // Filter properties based on tab and search
  const filteredRooms = useMemo(() => {
    let list = properties;

    // Filter by search query
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter((p) => {
        // Tìm trong title, id, unit
        if (
          p.title.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q) ||
          p.unit?.toLowerCase().includes(q)
        ) {
          return true;
        }

        // Nếu là BOARDING, tìm trong tên các rooms
        if (p.type === "BOARDING" && p.rooms) {
          return p.rooms.some((room) => room.name.toLowerCase().includes(q));
        }

        return false;
      });
    }

    // Filter by location
    if (location && location !== "all") {
      list = list.filter((p) =>
        p.address.toLowerCase().includes(location.replace("-", " "))
      );
    }

    // Filter by property type
    if (propertyType && propertyType !== "all") {
      list = list.filter((p) => p.type === propertyType);
    }

    // Convert properties to rooms array
    let allRooms: PropertyRoomProps[] = [];
    list.forEach((property) => {
      const rooms = convertToPropertyRooms(property);
      allRooms = allRooms.concat(rooms);
    });

    // Filter by tab status (isVisible)
    if (activeTab === "rented") {
      return allRooms.filter((room) => room.isRented === true);
    }
    if (activeTab === "empty") {
      return allRooms.filter((room) => room.isRented === false);
    }

    return allRooms;
  }, [activeTab, searchQuery, location, propertyType, properties]);

  // For unit view (BOARDING properties)
  const filteredUnits = useMemo(() => {
    let list = properties.filter((p) => p.type === "BOARDING");

    // Filter by search query
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.rooms?.some((room) => room.name.toLowerCase().includes(q))
      );
    }

    // Filter by location
    if (location && location !== "all") {
      list = list.filter((p) =>
        p.address.toLowerCase().includes(location.replace("-", " "))
      );
    }

    return list.map(convertToPropertyUnit);
  }, [searchQuery, location, properties]);

  // Get current data based on view
  const currentData = activeView === "room" ? filteredRooms : filteredUnits;
  const totalPages = Math.ceil(currentData.length / PAGE_SIZE) || 1;

  // Ensure current page within bounds when filters change
  if (currentPage > totalPages) {
    setCurrentPage(totalPages);
  }

  const paginatedData = useMemo(
    () =>
      currentData.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [currentData, currentPage]
  );

  return (
    <div className="min-h-screen bg-[#FFF7E9] p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header with both tab types */}
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between m-0">
          {/* Status Tabs */}
          <StatusTab
            tabs={propertyTabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          {/* View Toggle Tabs */}
          <PropertyViewTab
            activeView={activeView}
            setActiveView={setActiveView}
          />
        </div>

        {/* Search and Filter Bar */}
        <PropertyFilter
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          location={location}
          setLocation={setLocation}
          propertyType={propertyType}
          setPropertyType={setPropertyType}
        />

        {/* Properties List */}
        <div className="space-y-3">
          {loading ? (
            <LoadingSpinner text="Đang tải dữ liệu" />
          ) : activeView === "room" ? (
            // Room View
            (paginatedData as PropertyRoomProps[]).map((property) => (
              <div
                key={property.id}
                onClick={() => handlePropertyClick(property.id)}
                className="cursor-pointer transition-transform hover:scale-[1.01]"
              >
                <PropertyRoom {...property} showRentalStatus={false} />
              </div>
            ))
          ) : (
            // Unit View
            (paginatedData as PropertyUnitProps[]).map((property, index) => {
              // Tìm property gốc từ title để lấy ID
              const originalProperty = properties.find(
                (p) => p.title === property.title
              );
              return (
                <div
                  key={index}
                  onClick={() =>
                    originalProperty && handlePropertyClick(originalProperty.id)
                  }
                  className="cursor-pointer transition-transform hover:scale-[1.01]"
                >
                  <PropertyUnit {...property} />
                </div>
              );
            })
          )}

          {!loading && paginatedData.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                Không tìm thấy bất động sản nào
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination className="pt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-40" : ""
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage((p) => Math.max(1, p - 1));
                  }}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      isActive={page === currentPage}
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(page);
                      }}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-40"
                      : ""
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage((p) => Math.min(totalPages, p + 1));
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>

      {/* Property Detail Modal */}
      <PropertyDetailModal
        property={selectedProperty}
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
        onUpdate={fetchProperties}
      />
    </div>
  );
}
