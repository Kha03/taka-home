"use client";

import { useState, useMemo } from "react";
import ContractFilter from "@/components/contracts/contract-filter";
import StatusTab from "@/components/ui/status-tab";
import ContractCard from "@/components/contracts/contract-card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Contract {
  id: string;
  type: string;
  tenant: string;
  startDate: string;
  endDate: string;
  address: string;
  propertyCode: string;
  propertyType: string;
  category: string;
  price: number;
  status: "active" | "expired";
  invoices: Invoice[];
}

interface Invoice {
  id: number;
  month: string;
  dueDate: string;
  status: "paid" | "pending" | "overdue";
}

const mockContracts: Contract[] = [
  {
    id: "#A101-23485",
    type: "Hợp đồng thuê nhà",
    tenant: "Nguyễn Phạm Hữu Hiếu Huy",
    startDate: "01/07/2025",
    endDate: "01/01/2026",
    address:
      "Nguyễn Xiển, Phường Long Thạnh Mỹ (Quận 9 cũ), Thành phố Thủ Đức, Tp Hồ Chí Minh",
    propertyCode: "A101",
    propertyType: "Nội thất đầy đủ",
    category: "Chung cư",
    price: 12000000,
    status: "active",
    invoices: [
      {
        id: 7,
        month: "Tháng 8 Năm 2025",
        dueDate: "10/09/2025",
        status: "pending",
      },
      {
        id: 6,
        month: "Tháng 7 Năm 2025",
        dueDate: "10/08/2025",
        status: "paid",
      },
      {
        id: 5,
        month: "Tháng 6 Năm 2025",
        dueDate: "10/07/2025",
        status: "paid",
      },
      {
        id: 4,
        month: "Tháng 5 Năm 2025",
        dueDate: "10/06/2025",
        status: "paid",
      },
      {
        id: 3,
        month: "Tháng 4 Năm 2025",
        dueDate: "10/05/2025",
        status: "paid",
      },
    ],
  },
  {
    id: "#A101-22185",
    type: "Hợp đồng thuê nhà",
    tenant: "Nguyễn Phạm Hữu Hiếu Huy",
    startDate: "01/07/2025",
    endDate: "01/01/2026",
    address:
      "Nguyễn Xiển, Phường Long Thạnh Mỹ (Quận 9 cũ), Thành phố Thủ Đức, Tp Hồ Chí Minh",
    propertyCode: "A101",
    propertyType: "Nội thất đầy đủ",
    category: "Chung cư",
    price: 12000000,
    status: "active",
    invoices: [
      {
        id: 7,
        month: "Tháng 8 Năm 2025",
        dueDate: "10/09/2025",
        status: "pending",
      },
      {
        id: 6,
        month: "Tháng 7 Năm 2025",
        dueDate: "10/08/2025",
        status: "paid",
      },
      {
        id: 5,
        month: "Tháng 6 Năm 2025",
        dueDate: "10/07/2025",
        status: "paid",
      },
      {
        id: 4,
        month: "Tháng 5 Năm 2025",
        dueDate: "10/06/2025",
        status: "paid",
      },
      {
        id: 3,
        month: "Tháng 4 Năm 2025",
        dueDate: "10/05/2025",
        status: "paid",
      },
      {
        id: 312,
        month: "Tháng 4 Năm 2025",
        dueDate: "10/05/2025",
        status: "paid",
      },
      {
        id: 13,
        month: "Tháng 4 Năm 2025",
        dueDate: "10/05/2025",
        status: "paid",
      },
      {
        id: 23,
        month: "Tháng 4 Năm 2025",
        dueDate: "10/05/2025",
        status: "paid",
      },
      {
        id: 43,
        month: "Tháng 4 Năm 2025",
        dueDate: "10/05/2025",
        status: "paid",
      },
      {
        id: 121,
        month: "Tháng 4 Năm 2025",
        dueDate: "10/05/2025",
        status: "paid",
      },
      {
        id: 32131,
        month: "Tháng 4 Năm 2025",
        dueDate: "10/05/2025",
        status: "paid",
      },
      {
        id: 3131,
        month: "Tháng 4 Năm 2025",
        dueDate: "10/05/2025",
        status: "paid",
      },
      {
        id: 3133,
        month: "Tháng 4 Năm 2025",
        dueDate: "10/05/2025",
        status: "paid",
      },
      {
        id: 13133,
        month: "Tháng 4 Năm 2025",
        dueDate: "10/05/2025",
        status: "paid",
      },
      {
        id: 1133,
        month: "Tháng 4 Năm 2025",
        dueDate: "10/05/2025",
        status: "paid",
      },
    ],
  },
];

export default function ContractsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const contractTabs = [
    { id: "all", label: "Tất cả", count: 12 },
    { id: "active", label: "Còn hiệu lực", count: 2 },
    { id: "expired", label: "Hết hiệu lực", count: 10 },
  ];

  const PAGE_SIZE = 4;

  // (Optional future) filter contracts by tab / search; currently just returns all
  const filteredContracts = useMemo(() => {
    // Basic search across id, tenant, propertyCode
    const q = searchQuery.trim().toLowerCase();
    let list = mockContracts;
    if (q) {
      list = list.filter(
        (c) =>
          c.id.toLowerCase().includes(q) ||
          c.tenant.toLowerCase().includes(q) ||
          c.propertyCode.toLowerCase().includes(q)
      );
    }
    // activeTab logic placeholder (e.g., filter by status) – extend later
    if (activeTab === "active")
      return list.filter((c) => c.status === "active");
    if (activeTab === "expired")
      return list.filter((c) => c.status === "expired");
    return list;
  }, [activeTab, searchQuery]);

  const totalPages = Math.ceil(filteredContracts.length / PAGE_SIZE) || 1;

  // Ensure current page within bounds when filters change
  if (currentPage > totalPages) {
    // Simple corrective set (render-time) – safe because value only changes when out of bounds
    setCurrentPage(totalPages);
  }

  const paginatedContracts = useMemo(
    () =>
      filteredContracts.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
      ),
    [filteredContracts, currentPage]
  );

  return (
    <div className="min-h-screen bg-[#FFF7E9] p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Tabs */}
        <StatusTab
          tabs={contractTabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* Search and Navigation Bar */}
        <ContractFilter
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Contracts List */}
        <div className="space-y-6">
          {paginatedContracts.map((contract) => (
            <ContractCard key={contract.id} contract={contract} />
          ))}
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
