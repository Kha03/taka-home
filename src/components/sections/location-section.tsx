"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "@/lib/i18n/navigation";
import { Blocks, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

// Helper function to format numbers consistently
const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

interface LocationData {
  id: string;
  name: string;
  propertyCount: number;
  image: string;
  size: "hero" | "small" | "wide";
}

const locationData: LocationData[] = [
  {
    id: "hcm",
    name: "Thành phố Hồ Chí Minh",
    propertyCount: 2793,
    image: "/assets/imgs/hochiminh-location.png",
    size: "hero",
  },
  {
    id: "danang",
    name: "Thành phố Đà Nẵng",
    propertyCount: 1247,
    image: "/assets/imgs/danang-location.png",
    size: "small",
  },
  {
    id: "cantho",
    name: "Thành phố Cần Thơ",
    propertyCount: 638,
    image: "/assets/imgs/cantho-location.png",
    size: "small",
  },
  {
    id: "hanoi",
    name: "Thành phố Hà Nội",
    propertyCount: 2793,
    image: "/assets/imgs/hanoi-location.png",
    size: "wide",
  },
];

function MapCard() {
  const t = useTranslations("hero");
  const router = useRouter();

  const handleSearch = () => {
    router.push("/search");
  };

  return (
    <Card className="h-[378px] max-w-full p-0">
      <CardContent className="p-0 relative w-full h-full">
        <Image
          src={"/assets/imgs/map-location.png"}
          alt="Map"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="h-full w-full absolute inset-0 bg-black/10 flex items-center justify-center">
          <Button
            size="lg"
            onClick={handleSearch}
            className="bg-accent text-primary-foreground px-4 py-3 rounded-full shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:bg-accent/90"
          >
            <Search className="h-6 w-6 mr-1" />
            {t("searchButton")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function LocationCard({ location }: { location: LocationData }) {
  const getCardClasses = () => {
    const baseClasses =
      "p-0 group cursor-pointer h-[200px] overflow-hidden rounded-[12px] shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]";

    switch (location.size) {
      case "hero":
        return `${baseClasses} col-span-2`;
      case "small":
        return `${baseClasses}`;
      case "wide":
        return `${baseClasses} col-span-2`;
      default:
        return baseClasses;
    }
  };

  return (
    <Card className={getCardClasses()}>
      <CardContent className="p-0 h-full relative">
        <div className="relative h-full overflow-hidden">
          <Image
            src={location.image}
            alt={`Bất động sản tại ${location.name}`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="100vw"
          />

          {/* Gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(251,163,29,0.6) 0%, rgba(230,196,143,0.4) 19%, rgba(217,217,217,0) 36%)",
            }}
          />

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-4 text-primary-foreground font-bold">
            <h3 className="text-lg  mb-2 drop-shadow-lg">{location.name}</h3>
            <p className="text-sm opacity-90 drop-shadow">
              {formatNumber(location.propertyCount)} Bất động sản
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function LocationGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      {locationData.map((location) => (
        <LocationCard key={location.id} location={location} />
      ))}
    </div>
  );
}

export function LocationSection() {
  return (
    <section className="pt-12 pb-5">
      <div className="max-w-7xl mx-auto px-4 sm-px-6 lg:px-8">
        {/* Header - Only title and icon */}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
          {/* Left Column - Description + Map */}
          <div className="space-y-4">
            {/* Description */}
            <div className="text-[#4f4f4f] text-sm  leading-relaxed flex flex-col items-center">
              <div className="flex items-center bg-primary w-[45px] h-[45px]  rounded-full mb-3 justify-center text-primary-foreground">
                <Blocks />
              </div>
              <h2 className="font-bold text-2xl text-primary mb-5">
                Bất động sản theo khu vực
              </h2>
              <p>
                <span className="font-semibold">TakaHome</span> là nền tảng hỗ
                trợ tìm kiếm nhanh các bất động sản phù hợp gần bạn, mang đến
                trải nghiệm tiện lợi và hiệu quả. Với giao diện thân thiện,
                <span className="font-semibold">TakaHome</span> cung cấp thông
                tin chi tiết về nhà ở, căn hộ, đất nền và các dự án bất động sản
                đa dạng. Người dùng dễ dàng lọc theo vị trí, giá cả, diện tích
                và tiện ích, đảm bảo tìm được lựa chọn lý tưởng.
                <span className="font-semibold">TakaHome</span> cam kết đồng
                hành cùng bạn trong hành trình tìm kiếm ngôi nhà mơ ước!
              </p>
            </div>

            {/* Map */}
            <MapCard />
          </div>

          {/* Right Column - Location Cards */}
          <div className="">
            <LocationGrid />
          </div>
        </div>
      </div>
    </section>
  );
}
