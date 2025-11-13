"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Command, CommandItem, CommandList } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useVietnameseAddress } from "@/hooks/use-vietnamese-address";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { PropertyTypeEnum } from "@/lib/api/types";

// Mapping PropertyTypeEnum sang tiếng Việt
const propertyTypeLabels: Record<PropertyTypeEnum, string> = {
  [PropertyTypeEnum.APARTMENT]: "Chung cư",
  [PropertyTypeEnum.BOARDING]: "Nhà trọ",
  [PropertyTypeEnum.HOUSING]: "Nhà riêng",
};

export function HeroSearch() {
  const { provinces } = useVietnameseAddress();
  const router = useRouter();
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [selectedType, setSelectedType] = useState<PropertyTypeEnum | "">("");
  const [locationOpen, setLocationOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget as HTMLFormElement);
        const keyword = form.get("kw") || "";
        const params = new URLSearchParams();
        if (keyword) params.set("q", keyword.toString());
        if (selectedType) params.set("type", selectedType);
        if (selectedProvince) params.set("province", selectedProvince);
        router.push(`/search?${params.toString()}`);
      }}
      className="mx-auto flex w-full items-center gap-2 rounded-[12px] bg-background p-3.5 shadow-md"
    >
      <div className="p-3 rounded-sm bg-primary text-white">
        <Search />
      </div>
      <Input
        name="kw"
        placeholder="Tìm kiếm bất động sản..."
        className="placeholder:text-primary placeholder:font-bold text-primary font-medium"
        style={{ boxShadow: "none", border: "none" }}
      />
      <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            className=" w-70 rounded-none  border-l border-gray-200 bg-transparent  pl-4  py-2 hover:bg-primary/5 font-bold text-primary"
          >
            {selectedType ? propertyTypeLabels[selectedType] : "Danh mục"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-0">
          <Command>
            <CommandList>
              <CommandItem
                onSelect={() => {
                  setSelectedType("");
                  setCategoryOpen(false);
                }}
              >
                Tất cả
              </CommandItem>
              <CommandItem
                onSelect={() => {
                  setSelectedType(PropertyTypeEnum.APARTMENT);
                  setCategoryOpen(false);
                }}
              >
                {propertyTypeLabels[PropertyTypeEnum.APARTMENT]}
              </CommandItem>
              <CommandItem
                onSelect={() => {
                  setSelectedType(PropertyTypeEnum.HOUSING);
                  setCategoryOpen(false);
                }}
              >
                {propertyTypeLabels[PropertyTypeEnum.HOUSING]}
              </CommandItem>
              <CommandItem
                onSelect={() => {
                  setSelectedType(PropertyTypeEnum.BOARDING);
                  setCategoryOpen(false);
                }}
              >
                {propertyTypeLabels[PropertyTypeEnum.BOARDING]}
              </CommandItem>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Popover open={locationOpen} onOpenChange={setLocationOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            className="w-70 rounded-none  border-l border-gray-200 bg-transparent pl-4  py-2 hover:bg-primary/5 font-bold text-primary"
          >
            {selectedProvince || "Toàn quốc"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-0">
          <Command>
            <CommandList>
              <CommandItem
                onSelect={() => {
                  setSelectedProvince("");
                  setLocationOpen(false);
                }}
              >
                Toàn quốc
              </CommandItem>
              {provinces.map((province) => (
                <CommandItem
                  key={province.code}
                  onSelect={() => {
                    setSelectedProvince(province.name);
                    setLocationOpen(false);
                  }}
                >
                  {province.name}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <Button type="submit" className="bg-accent" size={"post"}>
        <Search />
        Tìm kiếm
      </Button>
    </form>
  );
}
