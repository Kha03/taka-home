import { Filter, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface PropertyFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  location?: string;
  setLocation?: (location: string) => void;
  propertyType?: string;
  setPropertyType?: (type: string) => void;
}

export default function PropertyFilter({
  searchQuery,
  setSearchQuery,
  location,
  setLocation,
  propertyType,
  setPropertyType,
}: PropertyFilterProps) {
  const t = useTranslations("myProperties");

  return (
    <div className="flex gap-3 items-center">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary w-4 h-4" />
        <Input
          placeholder={t("searchPlaceholder")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="
            pl-10 h-11 w-full rounded-full
            bg-primary-foreground border border-secondary/50
            shadow-secondary
            focus-visible:border-secondary focus-visible:ring-2 focus-visible:ring-secondary/20
            focus:outline-none transition-colors
            placeholder:text-sm placeholder:text-primary
            text-sm text-primary
          "
        />
      </div>

      <Select value={location} onValueChange={setLocation}>
        <SelectTrigger className="bg-primary-foreground text-secondary font-bold border-secondary rounded-full px-6 h-11 shadow-secondary min-w-[160px] data-[placeholder]:text-secondary">
          <SelectValue placeholder={t("location")} />
        </SelectTrigger>
        <SelectContent className="bg-primary-foreground">
          <SelectItem value="all">{t("nationwide")}</SelectItem>
          <SelectItem value="ho-chi-minh">TP. Hồ Chí Minh</SelectItem>
          <SelectItem value="ha-noi">Hà Nội</SelectItem>
          <SelectItem value="da-nang">Đà Nẵng</SelectItem>
          <SelectItem value="can-tho">Cần Thơ</SelectItem>
          <SelectItem value="hai-phong">Hải Phòng</SelectItem>
          <SelectItem value="bien-hoa">Biên Hòa</SelectItem>
          <SelectItem value="nha-trang">Nha Trang</SelectItem>
          <SelectItem value="hue">Huế</SelectItem>
          <SelectItem value="thu-duc">Thủ Đức</SelectItem>
        </SelectContent>
      </Select>

      <Select value={propertyType} onValueChange={setPropertyType}>
        <SelectTrigger className="bg-primary-foreground text-secondary font-bold border-secondary rounded-full px-6 h-11 shadow-secondary min-w-[160px] data-[placeholder]:text-secondary">
          <SelectValue placeholder={t("propertyType")} />
        </SelectTrigger>
        <SelectContent className="bg-primary-foreground">
          <SelectItem value="all">{t("all")}</SelectItem>
          <SelectItem value="APARTMENT">{t("apartment")}</SelectItem>
          <SelectItem value="HOUSING">{t("privateHouse")}</SelectItem>
          <SelectItem value="BOARDING">{t("boarding")}</SelectItem>
        </SelectContent>
      </Select>

      <Button className="bg-secondary text-primary-foreground font-bold border-secondary rounded-full px-6 h-11 w-[100px] shadow-secondary hover:bg-secondary/90 transition-colors">
        <Filter className="w-4 h-4" />
        {t("filter")}
      </Button>
    </div>
  );
}
