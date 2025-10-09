"use client";

import { useState, useMemo } from "react";
import StatusTab from "@/components/ui/status-tab";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import PropertyListItem, {
  PropertyStatus,
} from "@/components/property-approval/PropertyApprovalItem";
import {
  mockPropertyApprovalData,
  PropertyApprovalData,
} from "@/components/property-approval/mock-data";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function PropertyApprovalPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [properties, setProperties] = useState<PropertyApprovalData[]>(
    mockPropertyApprovalData
  );
  const [selectedProperties, setSelectedProperties] = useState<Set<string>>(
    new Set()
  );

  const PAGE_SIZE = 6;

  // Calculate counts dynamically
  const counts = useMemo(() => {
    const all = properties.length;
    const pending = properties.filter((p) => p.status === "cho-duyet").length;
    const approved = properties.filter((p) => p.status === "da-duyet").length;
    const rejected = properties.filter((p) => p.status === "tu-choi").length;

    return { all, pending, approved, rejected };
  }, [properties]);

  const propertyTabs = [
    { id: "all", label: "Tất cả", count: counts.all },
    { id: "cho-duyet", label: "Chờ duyệt", count: counts.pending },
    { id: "da-duyet", label: "Đã duyệt", count: counts.approved },
    { id: "tu-choi", label: "Từ chối", count: counts.rejected },
  ];

  // Filter properties based on active tab
  const filteredProperties = useMemo(() => {
    if (activeTab === "all") {
      return properties;
    }
    return properties.filter((property) => property.status === activeTab);
  }, [properties, activeTab]);

  const totalPages = Math.ceil(filteredProperties.length / PAGE_SIZE) || 1;

  // Ensure current page within bounds when filters change
  if (currentPage > totalPages) {
    setCurrentPage(totalPages);
  }

  const paginatedProperties = useMemo(
    () =>
      filteredProperties.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
      ),
    [filteredProperties, currentPage]
  );

  // Handle individual property selection
  const handlePropertySelect = (propertyId: string, selected: boolean) => {
    const newSelected = new Set(selectedProperties);
    if (selected) {
      newSelected.add(propertyId);
    } else {
      newSelected.delete(propertyId);
    }
    setSelectedProperties(newSelected);
  };

  // Handle individual property approval
  const handleApproveProperty = (propertyId: string) => {
    setProperties((prev) =>
      prev.map((property) =>
        property.id === propertyId
          ? { ...property, status: "da-duyet" as PropertyStatus }
          : property
      )
    );
    // Remove from selected if it was selected
    setSelectedProperties((prev) => {
      const newSelected = new Set(prev);
      newSelected.delete(propertyId);
      return newSelected;
    });
  };

  // Handle individual property rejection
  const handleRejectProperty = (propertyId: string) => {
    setProperties((prev) =>
      prev.map((property) =>
        property.id === propertyId
          ? { ...property, status: "tu-choi" as PropertyStatus }
          : property
      )
    );
    // Remove from selected if it was selected
    setSelectedProperties((prev) => {
      const newSelected = new Set(prev);
      newSelected.delete(propertyId);
      return newSelected;
    });
  };

  // Handle bulk approval
  const handleBulkApprove = () => {
    if (selectedProperties.size === 0) return;

    setProperties((prev) =>
      prev.map((property) =>
        selectedProperties.has(property.id)
          ? { ...property, status: "da-duyet" as PropertyStatus }
          : property
      )
    );
    setSelectedProperties(new Set());
  };

  // Handle bulk rejection
  const handleBulkReject = () => {
    if (selectedProperties.size === 0) return;

    setProperties((prev) =>
      prev.map((property) =>
        selectedProperties.has(property.id)
          ? { ...property, status: "tu-choi" as PropertyStatus }
          : property
      )
    );
    setSelectedProperties(new Set());
  };

  return (
    <div className="min-h-screen bg-[#FFF7E9] p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header with status tabs and bulk action buttons */}
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between m-0">
          {/* Status Tabs */}
          <StatusTab
            tabs={propertyTabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          {/* Bulk Action Buttons */}
          <div className="flex items-center gap-3">
            {selectedProperties.size > 0 && (
              <span className="text-sm text-gray-600">
                Đã chọn {selectedProperties.size} bất động sản
              </span>
            )}
            <Button
              variant="ghost"
              className="bg-[#00AE26]/20 text-[#00AE26] text-xs font-bold rounded-[12px] h-7 hover:bg-[#00AE26]/40 disabled:opacity-50"
              onClick={handleBulkApprove}
              disabled={selectedProperties.size === 0}
            >
              <Check className="w-3 h-3 mr-1" />
              Duyệt ({selectedProperties.size})
            </Button>
            <Button
              variant="ghost"
              className="bg-[#FA0000]/25 text-[#FA0000] text-xs font-bold rounded-[12px] h-7 hover:bg-[#FA0000]/50 disabled:opacity-50"
              onClick={handleBulkReject}
              disabled={selectedProperties.size === 0}
            >
              <X className="w-3 h-3 mr-1" />
              Từ chối ({selectedProperties.size})
            </Button>
          </div>
        </div>

        {/* Properties List */}
        <div className="space-y-3">
          {paginatedProperties.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                Không tìm thấy bất động sản nào
              </p>
            </div>
          ) : (
            paginatedProperties.map((property) => (
              <PropertyListItem
                key={property.id}
                id={property.id}
                title={property.title}
                beds={property.beds}
                baths={property.baths}
                areaM2={property.areaM2}
                priceMonthly={property.priceMonthly}
                updatedAt={property.updatedAt}
                location={property.location}
                images={property.images}
                status={property.status}
                selectable
                selected={selectedProperties.has(property.id)}
                onSelectChange={(selected) =>
                  handlePropertySelect(property.id, selected)
                }
                onApprove={() => handleApproveProperty(property.id)}
                onReject={() => handleRejectProperty(property.id)}
                className="cursor-pointer"
              />
            ))
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
