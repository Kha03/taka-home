"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ArrowRight } from "lucide-react";

export function RentalSearchForm() {
  const [priceRange, setPriceRange] = useState([0, 1000000000]); // 0 to 1 billion VND
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [minArea, setMinArea] = useState("");
  const [maxArea, setMaxArea] = useState("");
  const [furnitureCondition, setFurnitureCondition] = useState("");

  const formatPrice = (price: number) => {
    if (price >= 1000000000) return `${price / 1000000000} tỷ VND`;
    if (price >= 1000000) return `${price / 1000000} tr VND`;
    if (price >= 1000) return `${price / 1000}k VND`;
    return `${price} VND`;
  };

  const handlePriceRangeChange = (values: number[]) => {
    setPriceRange(values);
    setMinPrice(values[0].toString());
    setMaxPrice(values[1].toString());
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-primary-foreground p-5">
      <CardContent className="p-0 space-y-3">
        {/* Price Range Section */}
        <div className="space-y-4">
          <p className="text-sm font-bold text-primary">Giá thuê</p>

          <div className="space-y-3">
            <div className="relative">
              <Slider
                value={priceRange}
                onValueChange={handlePriceRangeChange}
                max={1000000000}
                min={0}
                step={1000000}
                className="w-full"
              />
              <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                <span>0VND</span>
                <span>1 tỷ VND</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <Input
                  placeholder="Giá tối thiểu"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="bg-[#F4F4F4] placeholder:text-xs placeholder:text-[#A1A1A1] pr-10  rounded-[30px]"
                />
                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground text-xs">
                  VND
                </span>
              </div>
              <ArrowRight className="h-3 w-3 text-muted-foreground" />
              <div className="flex-1 relative">
                <Input
                  placeholder="Giá tối đa"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="bg-[#F4F4F4] placeholder:text-xs placeholder:text-[#A1A1A1] pr-10  rounded-[30px]"
                />
                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground text-xs">
                  VND
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bedrooms Section */}
        <div className="space-y-3">
          <p className="text-sm font-bold text-primary">Số phòng ngủ</p>
          <Select value={bedrooms} onValueChange={setBedrooms}>
            <SelectTrigger className="w-full bg-[#F4F4F4] rounded-[30px] text-xs data-[placeholder]:text-[#A1A1A1]">
              <SelectValue placeholder="Số phòng ngủ" />
            </SelectTrigger>
            <SelectContent className="bg-primary-foreground">
              <SelectItem value="1">1 phòng ngủ</SelectItem>
              <SelectItem value="2">2 phòng ngủ</SelectItem>
              <SelectItem value="3">3 phòng ngủ</SelectItem>
              <SelectItem value="4">4 phòng ngủ</SelectItem>
              <SelectItem value="5+">5+ phòng ngủ</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bathrooms Section */}
        <div className="space-y-3">
          <p className="text-sm font-bold text-primary">Số nhà vệ sinh</p>
          <Select value={bathrooms} onValueChange={setBathrooms}>
            <SelectTrigger className="w-full bg-[#F4F4F4] rounded-[30px] text-xs data-[placeholder]:text-[#A1A1A1]">
              <SelectValue placeholder="Số nhà vệ sinh" />
            </SelectTrigger>
            <SelectContent className="bg-primary-foreground">
              <SelectItem value="1">1 nhà vệ sinh</SelectItem>
              <SelectItem value="2">2 nhà vệ sinh</SelectItem>
              <SelectItem value="3">3 nhà vệ sinh</SelectItem>
              <SelectItem value="4">4 nhà vệ sinh</SelectItem>
              <SelectItem value="5+">5+ nhà vệ sinh</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Area Section */}
        <div className="space-y-3">
          <p className="text-sm font-bold text-primary">Diện tích (m²)</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <Input
                placeholder="Diện tích tối thiểu"
                value={minArea}
                onChange={(e) => setMinArea(e.target.value)}
                className="bg-[#F4F4F4] placeholder:text-xs placeholder:text-[#A1A1A1] rounded-[30px] "
              />
            </div>
            <ArrowRight className="h-3 w-3 text-muted-foreground" />
            <div className="flex-1 relative">
              <Input
                placeholder="Diện tích tối đa"
                value={maxArea}
                onChange={(e) => setMaxArea(e.target.value)}
                className="bg-[#F4F4F4] placeholder:text-xs placeholder:text-[#A1A1A1] rounded-[30px]"
              />
            </div>
          </div>
        </div>

        {/* Furniture Condition Section */}
        <div className="space-y-3">
          <p className="text-sm font-bold text-primary">Tình trạng nội thất</p>
          <Select
            value={furnitureCondition}
            onValueChange={setFurnitureCondition}
          >
            <SelectTrigger className="w-full bg-[#F4F4F4] rounded-[30px] text-xs data-[placeholder]:text-[#A1A1A1]">
              <SelectValue placeholder="Tình trạng nội thất" />
            </SelectTrigger>
            <SelectContent className="bg-primary-foreground">
              <SelectItem value="fully-furnished">Đầy đủ nội thất</SelectItem>
              <SelectItem value="partially-furnished">
                Nội thất cơ bản
              </SelectItem>
              <SelectItem value="unfurnished">Không nội thất</SelectItem>
              <SelectItem value="new-furniture">Nội thất mới</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
