"use client";

import { useState, useMemo } from "react";
import StatusTab from "@/components/ui/status-tab";
import PropertyViewTab from "@/components/myproperties/property-view-tab";
import PropertyFilter from "@/components/myproperties/property-filter";
import { PropertyRoom } from "@/components/myproperties/PropertyRoom";
import { PropertyUnit } from "@/components/myproperties/PropertyUnit";
import {
  mockPropertyRooms,
  mockPropertyUnits,
} from "@/components/myproperties/mock-data";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function MyPropertiesPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [activeView, setActiveView] = useState("room"); // "room" or "unit"
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const propertyTabs = [
    { id: "all", label: "Tất cả", count: 15 },
    { id: "rented", label: "Đang cho thuê", count: 8 },
    { id: "empty", label: "Trống", count: 7 },
  ];

  const PAGE_SIZE = 4;

  // Filter properties based on tab and search
  const filteredRooms = useMemo(() => {
    let list = mockPropertyRooms;

    // Filter by search query
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q) ||
          p.roomCode?.toLowerCase().includes(q)
      );
    }

    // Filter by location
    if (location && location !== "all") {
      list = list.filter((p) =>
        p.address.toLowerCase().includes(location.replace("-", " "))
      );
    }

    // Filter by property type
    if (propertyType && propertyType !== "all") {
      list = list.filter((p) =>
        p.category.toLowerCase().includes(propertyType.replace("-", " "))
      );
    }

    // Filter by tab status
    if (activeTab === "rented") {
      return list.filter((p) => p.status === "Đang cho thuê");
    }
    if (activeTab === "empty") {
      return list.filter((p) => p.status === "Trống");
    }

    return list;
  }, [activeTab, searchQuery, location, propertyType]);

  // For unit view, we don't filter by individual room status
  const filteredUnits = useMemo(() => {
    let list = mockPropertyUnits;

    // Filter by search query
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.roomTypes.some((rt) =>
            rt.floors.some((floor) =>
              floor.units.some((unit) => unit.code.toLowerCase().includes(q))
            )
          )
      );
    }

    // Filter by location
    if (location && location !== "all") {
      list = list.filter((p) =>
        p.address.toLowerCase().includes(location.replace("-", " "))
      );
    }

    return list;
  }, [searchQuery, location]);

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
          {activeView === "room"
            ? // Room View
              (paginatedData as typeof mockPropertyRooms).map((property) => (
                <PropertyRoom
                  key={property.id}
                  {...property}
                  showRentalStatus={false}
                />
              ))
            : // Unit View
              (paginatedData as typeof mockPropertyUnits).map(
                (property, index) => <PropertyUnit key={index} {...property} />
              )}

          {paginatedData.length === 0 && (
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
    </div>
  );
}
