"use client";

import { Breadcrumb } from "@/components/ui/breadcrumb";
import { HeroSearch } from "@/components/hero/hero-search";
import { RentalSearchForm } from "@/components/search/rental-search-form";
import { SearchResults } from "@/components/search/search-results";
import { useSearchParams } from "next/navigation";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const location = searchParams.get("loc") || "Tp Hồ Chí Minh";
  const category = searchParams.get("cat") || "Nhà ở";

  const breadcrumbItems = [
    {
      label: `Mua bán ${category} ở ${location}`,
      current: true,
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFF7E9]">
      {/* Header with Search */}
      <div className="max-w-6xl  mx-auto py-4">
        <div className="w-full">
          <HeroSearch />
        </div>
        <div className="mt-4 pl-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto  px-4">
        <div className="grid grid-cols-12 gap-2">
          {/* Results - Left/Top on mobile */}
          <div className="col-span-12 lg:col-span-9 order-2 lg:order-1">
            <SearchResults />
          </div>

          {/* Filters Sidebar - Right/Bottom on mobile */}
          <div className="col-span-12 lg:col-span-3 order-1 lg:order-2">
            <div className="lg:sticky lg:top-6">
              <RentalSearchForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
