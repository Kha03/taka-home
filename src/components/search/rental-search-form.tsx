"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ArrowRight, Search } from "lucide-react";
import { useTranslations } from "next-intl";

export function RentalSearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("search.filters");

  const [priceRange, setPriceRange] = useState([0, 1000000000]); // 0 to 1 billion VND
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [minArea, setMinArea] = useState("");
  const [maxArea, setMaxArea] = useState("");
  const [furnitureCondition, setFurnitureCondition] = useState("");

  // Initialize filters from URL params
  useEffect(() => {
    const fromPrice = searchParams.get("fromPrice");
    const toPrice = searchParams.get("toPrice");
    const bedroomsParam = searchParams.get("bedrooms");
    const bathroomsParam = searchParams.get("bathrooms");
    const fromArea = searchParams.get("fromArea");
    const toArea = searchParams.get("toArea");
    const furnishing = searchParams.get("furnishing");

    if (fromPrice) setMinPrice(fromPrice);
    if (toPrice) setMaxPrice(toPrice);
    if (bedroomsParam) setBedrooms(bedroomsParam);
    if (bathroomsParam) setBathrooms(bathroomsParam);
    if (fromArea) setMinArea(fromArea);
    if (toArea) setMaxArea(toArea);
    if (furnishing) setFurnitureCondition(furnishing);
  }, [searchParams]);

  const handlePriceRangeChange = (values: number[]) => {
    setPriceRange(values);
    setMinPrice(values[0].toString());
    setMaxPrice(values[1].toString());
  };

  const formatPrice = (price: number) => {
    if (price === 0) return `0 ${t("priceUnit")}`;
    if (price >= 1000000)
      return `${(price / 1000000).toFixed(1)} ${t("priceMillions")}`;
    if (price >= 1000)
      return `${(price / 1000).toFixed(0)}${t("priceThousands")}`;
    return `${price} ${t("priceUnit")}`;
  };

  const handleApplyFilters = () => {
    // Get existing search params (keep q, type, province from hero-search)
    const params = new URLSearchParams(searchParams.toString());

    // Update filter params
    if (minPrice) {
      params.set("fromPrice", minPrice);
    } else {
      params.delete("fromPrice");
    }

    if (maxPrice) {
      params.set("toPrice", maxPrice);
    } else {
      params.delete("toPrice");
    }

    if (bedrooms) {
      params.set("bedrooms", bedrooms);
    } else {
      params.delete("bedrooms");
    }

    if (bathrooms) {
      params.set("bathrooms", bathrooms);
    } else {
      params.delete("bathrooms");
    }

    if (minArea) {
      params.set("fromArea", minArea);
    } else {
      params.delete("fromArea");
    }

    if (maxArea) {
      params.set("toArea", maxArea);
    } else {
      params.delete("toArea");
    }

    if (furnitureCondition) {
      params.set("furnishing", furnitureCondition);
    } else {
      params.delete("furnishing");
    }

    // Navigate with updated params
    router.push(`/search?${params.toString()}`);
  };

  const handleResetFilters = () => {
    // Keep only q, type, province params
    const params = new URLSearchParams();
    const q = searchParams.get("q");
    const type = searchParams.get("type");
    const province = searchParams.get("province");

    if (q) params.set("q", q);
    if (type) params.set("type", type);
    if (province) params.set("province", province);

    // Reset local state
    setMinPrice("");
    setMaxPrice("");
    setBedrooms("");
    setBathrooms("");
    setMinArea("");
    setMaxArea("");
    setFurnitureCondition("");
    setPriceRange([0, 1000000000]);

    // Navigate with reset params
    router.push(`/search?${params.toString()}`);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-primary-foreground p-5">
      <CardContent className="p-0 space-y-3">
        {/* Price Range Section */}
        <div className="space-y-4">
          <p className="text-sm font-bold text-primary">{t("priceRange")}</p>

          <div className="space-y-3">
            <div className="relative">
              <Slider
                value={priceRange}
                onValueChange={handlePriceRangeChange}
                max={100000000}
                min={0}
                step={100000}
                className="w-full"
              />
              <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                <span>0 {t("priceUnit")}</span>
                <span>100 {t("priceMillions")}</span>
              </div>
            </div>

            {/* Display selected price range */}
            <div className="flex items-center justify-center gap-2 py-2 px-4 bg-primary/5 rounded-lg">
              <span className="text-sm font-medium text-primary">
                {formatPrice(priceRange[0])}
              </span>
              <ArrowRight className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                {formatPrice(priceRange[1])}
              </span>
            </div>
          </div>
        </div>

        {/* Bedrooms Section */}
        <div className="space-y-3">
          <p className="text-sm font-bold text-primary">{t("bedrooms")}</p>
          <Select value={bedrooms} onValueChange={setBedrooms}>
            <SelectTrigger className="w-full bg-[#F4F4F4] rounded-[30px] text-xs data-[placeholder]:text-[#A1A1A1]">
              <SelectValue placeholder={t("bedroomsPlaceholder")} />
            </SelectTrigger>
            <SelectContent className="bg-primary-foreground">
              <SelectItem value="1">{t("bedroomOptions.1")}</SelectItem>
              <SelectItem value="2">{t("bedroomOptions.2")}</SelectItem>
              <SelectItem value="3">{t("bedroomOptions.3")}</SelectItem>
              <SelectItem value="4">{t("bedroomOptions.4")}</SelectItem>
              <SelectItem value="5+">{t("bedroomOptions.5+")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bathrooms Section */}
        <div className="space-y-3">
          <p className="text-sm font-bold text-primary">{t("bathrooms")}</p>
          <Select value={bathrooms} onValueChange={setBathrooms}>
            <SelectTrigger className="w-full bg-[#F4F4F4] rounded-[30px] text-xs data-[placeholder]:text-[#A1A1A1]">
              <SelectValue placeholder={t("bathroomsPlaceholder")} />
            </SelectTrigger>
            <SelectContent className="bg-primary-foreground">
              <SelectItem value="1">{t("bathroomOptions.1")}</SelectItem>
              <SelectItem value="2">{t("bathroomOptions.2")}</SelectItem>
              <SelectItem value="3">{t("bathroomOptions.3")}</SelectItem>
              <SelectItem value="4">{t("bathroomOptions.4")}</SelectItem>
              <SelectItem value="5+">{t("bathroomOptions.5+")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Area Section */}
        <div className="space-y-3">
          <p className="text-sm font-bold text-primary">{t("area")}</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <Input
                placeholder={t("minArea")}
                value={minArea}
                onChange={(e) => setMinArea(e.target.value)}
                className="bg-[#F4F4F4] placeholder:text-xs placeholder:text-[#A1A1A1] rounded-[30px] "
              />
            </div>
            <ArrowRight className="h-3 w-3 text-muted-foreground" />
            <div className="flex-1 relative">
              <Input
                placeholder={t("maxArea")}
                value={maxArea}
                onChange={(e) => setMaxArea(e.target.value)}
                className="bg-[#F4F4F4] placeholder:text-xs placeholder:text-[#A1A1A1] rounded-[30px]"
              />
            </div>
          </div>
        </div>

        {/* Furniture Condition Section */}
        <div className="space-y-3">
          <p className="text-sm font-bold text-primary">{t("furnishing")}</p>
          <Select
            value={furnitureCondition}
            onValueChange={setFurnitureCondition}
          >
            <SelectTrigger className="w-full bg-[#F4F4F4] rounded-[30px] text-xs data-[placeholder]:text-[#A1A1A1]">
              <SelectValue placeholder={t("furnishingPlaceholder")} />
            </SelectTrigger>
            <SelectContent className="bg-primary-foreground">
              <SelectItem value="Đầy đủ">
                {t("furnishingOptions.full")}
              </SelectItem>
              <SelectItem value="Cơ bản">
                {t("furnishingOptions.basic")}
              </SelectItem>
              <SelectItem value="Không">
                {t("furnishingOptions.none")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            onClick={handleApplyFilters}
            className="flex-1 bg-primary hover:bg-primary/90 text-white rounded-[30px]"
          >
            <Search className="h-4 w-4 mr-2" />
            {t("applyFilters")}
          </Button>
          <Button
            onClick={handleResetFilters}
            variant="outline"
            className="flex-1 rounded-[30px] border-primary text-primary hover:bg-primary/10"
          >
            {t("resetFilters")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
