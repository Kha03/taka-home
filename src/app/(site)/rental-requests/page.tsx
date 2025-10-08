"use client";

import { useState, useMemo, useEffect } from "react";
import StatusTab from "@/components/ui/status-tab";
import { PropertyRoom } from "@/components/myproperties/PropertyRoom";
import { mockRentalRequestProperties } from "@/components/rental-requests/rental-requests-properties-mock";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { RentalRequestStatus } from "@/types/rental-request";

const rentalRequestTabs = [
  { id: "all", label: "Tất cả", count: 15 },
  { id: "pending", label: "Chờ duyệt", count: 5 },
  { id: "approved", label: "Đã duyệt", count: 8 },
  { id: "rejected", label: "Đã từ chối", count: 2 },
];

export default function RentalRequestsPage() {
  const [activeTab, setActiveTab] = useState<RentalRequestStatus>("all");
  const [currentPage, setCurrentPage] = useState(1);

  const PAGE_SIZE = 4;

  // Filter rental request properties based on tab only
  const filteredProperties = useMemo(() => {
    let list = mockRentalRequestProperties;

    // Filter by tab status based on rental request status
    if (activeTab !== "all") {
      list = list.filter((property) =>
        property.rentalRequests?.some((request) => request.status === activeTab)
      );
    }

    return list;
  }, [activeTab]);

  // Pagination
  const totalPages = Math.ceil(filteredProperties.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedProperties = filteredProperties.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  // Reset pagination when tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-[#FFF7E9] p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Status Tabs */}
        <div className="mb-6">
          <StatusTab
            tabs={rentalRequestTabs}
            activeTab={activeTab}
            setActiveTab={(tab: string) =>
              setActiveTab(tab as RentalRequestStatus)
            }
          />
        </div>
        {/* Rental Request Properties List */}
        <div className="space-y-4">
          {paginatedProperties.length > 0 ? (
            paginatedProperties.map((property) => (
              <PropertyRoom key={property.id} {...property} />
            ))
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Không tìm thấy yêu cầu nào
              </h3>
              <p className="text-gray-500">
                Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8">
            <Pagination>
              <PaginationContent>
                {currentPage > 1 && (
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage(currentPage - 1)}
                      className="cursor-pointer"
                    />
                  </PaginationItem>
                )}

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}

                {currentPage < totalPages && (
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage(currentPage + 1)}
                      className="cursor-pointer"
                    />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
}
