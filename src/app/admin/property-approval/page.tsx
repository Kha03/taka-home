"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Check, X } from "lucide-react";

// Components
import StatusTab from "@/components/ui/status-tab";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import PropertyListItem, {
  PropertyStatus,
} from "@/components/property-approval/PropertyApprovalItem";
import { PropertyApprovalModal } from "@/components/property-approval/PropertyApprovalModal";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// Services & Utilities
import { propertyService } from "@/lib/api/services/property";
import {
  type PropertyOrRoomType,
  getPropertyId,
  getDisplayId,
  getPropertyTitle,
  getRoomTypeName,
  getPropertyLocation,
  getPropertyImages,
  getPropertyDetails,
  getApprovalStatus,
  getUpdatedDate,
} from "@/lib/utils/property-helpers";

// Constants
const PAGE_SIZE = 10;

// Types
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

export default function PropertyApprovalPage() {
  // State
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [properties, setProperties] = useState<PropertyOrRoomType[]>([]);
  const [selectedProperties, setSelectedProperties] = useState<Set<string>>(
    new Set()
  );
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: PAGE_SIZE,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [tabCounts, setTabCounts] = useState({
    all: 0,
    pending: 0,
    approved: 0,
  });

  // Modal state
  const [selectedPropertyForView, setSelectedPropertyForView] =
    useState<PropertyOrRoomType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allRoomTypes, setAllRoomTypes] = useState<PropertyOrRoomType[]>([]); // Store all room types for modal

  // Fetch counts for all tabs
  const fetchCounts = useCallback(async () => {
    try {
      // Fetch all properties
      const allResponse = await propertyService.getProperties({
        page: 1,
        limit: 1,
      });

      // Fetch pending properties
      const pendingResponse = await propertyService.getProperties({
        page: 1,
        limit: 1,
        isApproved: false,
      });

      // Fetch approved properties
      const approvedResponse = await propertyService.getProperties({
        page: 1,
        limit: 1,
        isApproved: true,
      });

      // Extract totalItems from pagination
      const allData = allResponse.data as unknown as PropertyListResponse;
      const pendingData =
        pendingResponse.data as unknown as PropertyListResponse;
      const approvedData =
        approvedResponse.data as unknown as PropertyListResponse;

      setTabCounts({
        all: allData.pagination?.totalItems || 0,
        pending: pendingData.pagination?.totalItems || 0,
        approved: approvedData.pagination?.totalItems || 0,
      });
    } catch (error) {
      console.error("Error fetching counts:", error);
    }
  }, []);

  // Fetch properties based on active tab
  const fetchProperties = useCallback(async () => {
    setIsLoading(true);
    try {
      const query: Record<string, unknown> = {
        page: currentPage,
        limit: PAGE_SIZE,
      };

      // Add isApproved filter based on active tab
      if (activeTab === "cho-duyet") {
        query.isApproved = false;
      } else if (activeTab === "da-duyet") {
        query.isApproved = true;
      }

      const response = await propertyService.getProperties(query);

      if (response.code === 200 && response.data) {
        const responseData = response.data as unknown as PropertyListResponse;

        if (responseData.data && Array.isArray(responseData.data)) {
          setProperties(responseData.data);
          if (responseData.pagination) {
            setPagination(responseData.pagination);
          }
        } else if (Array.isArray(response.data)) {
          setProperties(response.data as PropertyOrRoomType[]);
        } else {
          setProperties([response.data] as PropertyOrRoomType[]);
        }
      } else {
        setProperties([]);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
      toast.error("Không thể tải danh sách bất động sản");
      setProperties([]);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, currentPage]);

  // Fetch counts on mount
  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);

  // Fetch properties when tab or page changes
  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const propertyTabs = [
    { id: "all", label: "Tất cả", count: tabCounts.all },
    { id: "cho-duyet", label: "Chờ duyệt", count: tabCounts.pending },
    { id: "da-duyet", label: "Đã duyệt", count: tabCounts.approved },
  ];

  // Group boarding properties to avoid duplicates in list view
  // But keep track of all room types for each property
  const paginatedProperties = useMemo(() => {
    if (!Array.isArray(properties)) return [];

    const grouped = new Map<
      string,
      { item: PropertyOrRoomType; allTypes: PropertyOrRoomType[] }
    >();

    properties.forEach((item) => {
      const propertyId = getPropertyId(item);
      if (!grouped.has(propertyId)) {
        grouped.set(propertyId, {
          item: item, // First roomType for display in list
          allTypes: [item], // All roomTypes for modal
        });
      } else {
        // Add this roomType to allTypes array
        grouped.get(propertyId)!.allTypes.push(item);
      }
    });

    return Array.from(grouped.values());
  }, [properties]);

  // Handlers
  const handlePropertySelect = (itemId: string, selected: boolean) => {
    setSelectedProperties((prev) => {
      const newSelected = new Set(prev);
      if (selected) {
        newSelected.add(itemId);
      } else {
        newSelected.delete(itemId);
      }
      return newSelected;
    });
  };

  const handleApproveProperty = async (item: PropertyOrRoomType) => {
    try {
      const propertyId = getPropertyId(item);
      const displayId = getDisplayId(item);

      const response = await propertyService.approveProperties([propertyId]);

      if (response.code === 200) {
        toast.success("Duyệt bất động sản thành công");

        // Clear selection
        setSelectedProperties((prev) => {
          const newSelected = new Set(prev);
          newSelected.delete(displayId);
          return newSelected;
        });

        // Refresh both counts and properties
        await Promise.all([fetchCounts(), fetchProperties()]);
      }
    } catch (error) {
      console.error("Error approving property:", error);
      toast.error("Không thể duyệt bất động sản");
    }
  };

  const handleRejectProperty = () => {
    toast.info("Chức năng từ chối đang được phát triển");
  };

  const handleBulkApprove = async () => {
    if (selectedProperties.size === 0) return;

    try {
      const propertyIds = properties
        .filter((item) => selectedProperties.has(getDisplayId(item)))
        .map((item) => getPropertyId(item));

      const response = await propertyService.approveProperties(propertyIds);

      if (response.code === 200) {
        toast.success(`Duyệt thành công ${propertyIds.length} bất động sản`);

        // Clear selection
        setSelectedProperties(new Set());

        // Refresh both counts and properties
        await Promise.all([fetchCounts(), fetchProperties()]);
      }
    } catch (error) {
      console.error("Error bulk approving:", error);
      toast.error("Không thể duyệt hàng loạt");
    }
  };

  const handleBulkReject = () => {
    if (selectedProperties.size === 0) return;
    toast.info("Chức năng từ chối đang được phát triển");
    setSelectedProperties(new Set());
  };

  // Map Property/RoomType to PropertyListItem format
  const mapPropertyToApprovalFormat = (item: PropertyOrRoomType) => {
    const details = getPropertyDetails(item);
    const images = getPropertyImages(item);

    return {
      id: getDisplayId(item),
      title: getPropertyTitle(item),
      roomType: getRoomTypeName(item) ? "Phòng trọ" : undefined,
      beds: details.bedrooms,
      baths: details.bathrooms,
      areaM2: details.area,
      priceMonthly: details.price,
      updatedAt: getUpdatedDate(item) || new Date().toISOString(),
      location: getPropertyLocation(item),
      images: images.length > 0 ? images : ["/assets/imgs/house-item.png"],
      status: getApprovalStatus(item)
        ? ("da-duyet" as PropertyStatus)
        : ("cho-duyet" as PropertyStatus),
    };
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
          {isLoading ? (
            <div className="text-center py-12">
              <LoadingSpinner size="lg" text="Đang tải dữ liệu..." />
            </div>
          ) : paginatedProperties.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                Không tìm thấy bất động sản nào
              </p>
            </div>
          ) : (
            paginatedProperties.map((groupedItem) => {
              const { item, allTypes } = groupedItem;
              const mapped = mapPropertyToApprovalFormat(item);
              const displayId = getDisplayId(item);

              return (
                <PropertyListItem
                  key={displayId}
                  {...mapped}
                  selectable
                  selected={selectedProperties.has(displayId)}
                  onSelectChange={(selected) =>
                    handlePropertySelect(displayId, selected)
                  }
                  onClick={() => {
                    setSelectedPropertyForView(item);
                    setAllRoomTypes(allTypes); // Store all room types for modal
                    setIsModalOpen(true);
                  }}
                  onApprove={() => handleApproveProperty(item)}
                  onReject={handleRejectProperty}
                  className="cursor-pointer"
                />
              );
            })
          )}
        </div>

        {/* Property Detail Modal */}
        <PropertyApprovalModal
          property={selectedPropertyForView}
          allRoomTypes={allRoomTypes} // Pass all room types to modal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          onApprove={() => {
            if (selectedPropertyForView) {
              handleApproveProperty(selectedPropertyForView);
            }
          }}
          onReject={handleRejectProperty}
        />

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <Pagination className="pt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  className={
                    !pagination.hasPrevPage
                      ? "pointer-events-none opacity-40"
                      : ""
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    if (pagination.hasPrevPage) {
                      setCurrentPage((p) => Math.max(1, p - 1));
                    }
                  }}
                />
              </PaginationItem>
              {Array.from(
                { length: pagination.totalPages },
                (_, i) => i + 1
              ).map((page) => (
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
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  className={
                    !pagination.hasNextPage
                      ? "pointer-events-none opacity-40"
                      : ""
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    if (pagination.hasNextPage) {
                      setCurrentPage((p) =>
                        Math.min(pagination.totalPages, p + 1)
                      );
                    }
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
