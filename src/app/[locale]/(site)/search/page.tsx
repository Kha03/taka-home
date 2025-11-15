"use client";

import { Breadcrumb } from "@/components/ui/breadcrumb";
import { HeroSearch } from "@/components/hero/hero-search";
import { RentalSearchForm } from "@/components/search/rental-search-form";
import { SearchResults } from "@/components/search/search-results";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useTranslations } from "next-intl";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const type = searchParams.get("type");
  const province = searchParams.get("province");
  const t = useTranslations("search.breadcrumb");

  // Generate breadcrumb label based on search params
  const generateBreadcrumbLabel = () => {
    const parts: string[] = [t("search")];

    if (type === "APARTMENT") {
      parts.push(t("apartment"));
    } else if (type === "HOUSING") {
      parts.push(t("housing"));
    } else if (type === "BOARDING") {
      parts.push(t("boarding"));
    } else {
      parts.push(t("property"));
    }

    if (province) {
      parts.push(`${t("in")} ${province}`);
    }

    if (query) {
      parts.push(`"${query}"`);
    }

    return parts.join(" ");
  };

  const breadcrumbItems = [
    {
      label: generateBreadcrumbLabel(),
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
      <div className="max-w-7xl mx-auto px-4 pb-10">
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

export default function SearchPage() {
  const t = useTranslations("common");

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FFF7E9] flex items-center justify-center">
          {t("loading")}
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
