"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import {
  Calendar,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  MapPin,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";

interface Invoice {
  id: number;
  month: string;
  dueDate: string;
  status: "paid" | "pending" | "overdue";
}

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

interface ContractCardProps {
  contract: Contract;
}

export default function ContractCard({ contract }: ContractCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  //   const getStatusIcon = (status: Invoice["status"]) => {
  //     switch (status) {
  //       case "paid":
  //         return <CheckCircle className="w-4 h-4 text-green-500" />;
  //       case "pending":
  //         return <Clock className="w-4 h-4 text-orange-500" />;
  //       case "overdue":
  //         return <AlertCircle className="w-4 h-4 text-red-500" />;
  //     }
  //   };

  //   const getStatusText = (status: Invoice["status"]) => {
  //     switch (status) {
  //       case "paid":
  //         return "Đã thanh toán";
  //       case "pending":
  //         return "Nhận tin";
  //       case "overdue":
  //         return "Quá hạn";
  //     }
  //   };

  //   const getStatusBadgeColor = (status: Invoice["status"]) => {
  //     switch (status) {
  //       case "paid":
  //         return "bg-green-100 text-green-800 hover:bg-green-100";
  //       case "pending":
  //         return "bg-orange-100 text-orange-800 hover:bg-orange-100";
  //       case "overdue":
  //         return "bg-red-100 text-red-800 hover:bg-red-100";
  //     }
  //   };

  const toggleContractExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  const mostRecentInvoice = contract.invoices[0];
  const remainingInvoices = contract.invoices.slice(1);
  const PAGE_SIZE = 4;

  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(remainingInvoices.length / PAGE_SIZE);
  const start = (page - 1) * PAGE_SIZE;
  const pageInvoices = remainingInvoices.slice(start, start + PAGE_SIZE);

  // Khi đóng/mở hoặc thay đổi remainingInvoices -> reset về trang 1
  useEffect(() => {
    setPage(1);
  }, [isExpanded, remainingInvoices.length]);
  return (
    <Card className="bg-primary-foreground shadow-sm rounded-2xl border-none px-5 pt-2 pb-9 gap-2">
      <CardHeader className="p-0">
        <div className="flex items-start justify-between ">
          <div className="flex  gap-9 ">
            <div className="flex flex-col gap-2 items-center">
              <div className="relative inline-flex items-center">
                <span className="bg-secondary text-primary font-bold text-sm px-3 py-1.5 rounded-full">
                  #A101-23485
                </span>
                <span className="absolute left-full top-1/2 -translate-y-1/2 flex items-center">
                  <span className="w-5 h-px bg-[#B3B3B3]" />
                  <span className="w-2 h-2 bg-[#B3B3B3] rounded-full" />
                </span>
              </div>

              {/* Thẻ trạng thái */}
              <div className="bg-[#00AE26]/20 w-[116px] rounded-[10px] p-5 flex flex-col items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <p className="text-xs font-medium">Còn hiệu lực</p>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-bold text-primary text-lg">
                  {contract.type}
                </span>
                <span className="text-[#4F4F4F]">•</span>
                <span className="text-[#4F4F4F] text-sm">
                  Người thuê:
                  <span className="text-secondary font-bold text-sm ml-1">
                    {contract.tenant}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-1 text-sm text-[#4f4f4f]">
                <div className="w-6 h-6 rounded-full bg-[#e5e5e5] flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-primary" />
                </div>
                <span>
                  Thời hạn hợp đồng:
                  <strong className="ml-1">
                    {contract.startDate} - {contract.endDate}
                  </strong>
                </span>
              </div>
              <div className="flex items-center gap-1 text-sm text-[#4f4f4f] mt-3">
                <div className="w-6 h-6 rounded-full bg-[#e5e5e5] flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <span>{contract.address}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-3 mb-2">
              <div className="text-center p-3 border border-dashed rounded-lg border-[#e5e5e5]">
                <div className="text-xs text-[#8d8d8d]">Mã bất động sản</div>
                <div className="font-medium text-primary">
                  {contract.propertyCode}
                </div>
              </div>
              <div className="text-center p-3 border border-dashed rounded-lg border-[#e5e5e5]">
                <div className="text-xs text-[#8d8d8d]">
                  Tình trạng nội thất
                </div>
                <div className="font-medium text-primary">
                  {contract.propertyType}
                </div>
              </div>
              <div className="text-center p-3 border border-dashed rounded-lg border-[#e5e5e5]">
                <div className="text-xs text-[#8d8d8d]">Danh mục</div>
                <div className="font-medium text-primary">
                  {contract.category}
                </div>
              </div>
            </div>
            <div className="flex bg-[#f5f5f5] rounded-2xl py-2 justify-center">
              <div className="text-sm text-muted-foreground">Giá thuê:</div>
              <div className="text-sm font-bold text-secondary ml-1">
                {contract.price.toLocaleString("vi-VN")} VND
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="ml-35 relative rounded-2xl border border-dashed border-[#E5E5E5] p-6">
        <Collapsible open={isExpanded} onOpenChange={toggleContractExpansion}>
          <span className="absolute -top-3 left-6 inline-flex items-center rounded-full bg-[#13337A] px-3 py-1 text-xs font-semibold text-white shadow-sm">
            Lịch sử hóa đơn ({contract.invoices.length})
          </span>

          <Button
            size="sm"
            variant="ghost"
            className="absolute -top-3 right-6 rounded-full bg-secondary text-primary-foreground hover:bg-secondary/85 hover:text-primary"
          >
            Nhắn tin
          </Button>

          {/* Most recent invoice (luôn hiển thị) */}
          <div className="flex items-center justify-between rounded-lg bg-[#f5f5f5] py-3 px-4 mt-2">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "grid h-6 w-6 place-items-center rounded-full",
                  mostRecentInvoice.status === "paid"
                    ? "bg-[#00AE26]"
                    : "bg-secondary"
                )}
              >
                <span className="text-xs font-semibold text-primary-foreground">
                  {mostRecentInvoice.id}
                </span>
              </div>
              <div>
                <div className="font-bold text-foreground">
                  Hóa đơn thuê nhà {mostRecentInvoice.month}
                </div>
                <div className="text-xs text-[#4f4f4f]">
                  Hạn thanh toán: <strong>{mostRecentInvoice.dueDate}</strong>
                </div>
              </div>
            </div>

            {mostRecentInvoice.status === "paid" ? (
              <div className="flex items-center gap-2 text-xs text-foreground">
                <div className="h-4 w-4 rounded-full bg-[#00AE26] flex items-center justify-center">
                  <Check className="h-3 w-3 text-primary-foreground" />
                </div>
                <span>Đã thanh toán</span>
              </div>
            ) : (
              <Button
                size="sm"
                className="rounded-full bg-secondary text-primary-foreground hover:bg-secondary/85"
              >
                Chưa thanh toán
              </Button>
            )}
          </div>

          {/* Các hóa đơn còn lại */}
          <CollapsibleContent className="space-y-2">
            {pageInvoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between rounded-lg bg-[#f5f5f5] py-3 px-4 mt-2"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "grid h-6 w-6 place-items-center rounded-full",
                      invoice.status === "paid"
                        ? "bg-[#00AE26]"
                        : "bg-secondary"
                    )}
                  >
                    <span className="text-xs font-semibold text-primary-foreground">
                      {invoice.id}
                    </span>
                  </div>
                  <div>
                    <div className="font-bold text-foreground">
                      Hóa đơn thuê nhà {invoice.month}
                    </div>
                    <div className="text-xs text-[#4f4f4f]">
                      Hạn thanh toán: <strong>{invoice.dueDate}</strong>
                    </div>
                  </div>
                </div>

                {invoice.status === "paid" ? (
                  <div className="flex items-center gap-2 text-xs text-foreground">
                    <div className="h-4 w-4 rounded-full bg-[#00AE26] flex items-center justify-center">
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </div>
                    <span>Đã thanh toán</span>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    className="rounded-full bg-secondary text-primary-foreground hover:bg-secondary/85"
                  >
                    Chưa thanh toán
                  </Button>
                )}
              </div>
            ))}
          </CollapsibleContent>

          {remainingInvoices.length > 0 && (
            <div className="flex justify-between items-center pt-2">
              <div className="flex-1"></div>
              {/* Center toggle button */}
              <div className="flex-1 flex justify-center">
                <CollapsibleTrigger asChild>
                  <Button
                    variant="outline"
                    className="inline-flex items-center gap-1 bg-transparent px-4 py-2 text-muted-foreground border-none shadow-none"
                  >
                    {isExpanded ? (
                      <>
                        <div className="h-5 w-5 bg-secondary rounded-full flex items-center justify-center">
                          <ChevronUp className="h-4 w-4 text-primary-foreground" />
                        </div>
                        <span>Ẩn bớt</span>
                      </>
                    ) : (
                      <>
                        <div className="h-5 w-5 bg-secondary rounded-full flex items-center justify-center">
                          <ChevronDown className="w-4 h-4 text-primary-foreground" />
                        </div>
                        <span>
                          Xem thêm {remainingInvoices.length} hợp đồng
                        </span>
                      </>
                    )}
                  </Button>
                </CollapsibleTrigger>
              </div>
              <div className="flex-1">
                {isExpanded && totalPages > 1 && (
                  <Pagination className="justify-end">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setPage(page - 1);
                          }}
                          className="h-7 w-7 rounded-full"
                        />
                      </PaginationItem>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (n) => (
                          <PaginationItem key={n}>
                            <PaginationLink
                              href="#"
                              isActive={n === page}
                              onClick={(e) => {
                                e.preventDefault();
                                setPage(n);
                              }}
                              className="
                h-7 w-7 rounded-full p-0
                data-[active]:bg-primary data-[active]:text-primary-foreground
              "
                            >
                              {n}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      )}

                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setPage(page + 1);
                          }}
                          className="h-7 w-7 rounded-full"
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </div>
            </div>
          )}
        </Collapsible>
      </CardContent>
    </Card>
  );
}
