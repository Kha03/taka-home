/* eslint-disable @next/next/no-img-element */
"use client";
// app/(home)/_components/hero.tsx
import { Waterfall } from "next/font/google";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { HeroSearch } from "./hero-search";
import { useTranslations } from "next-intl";
import { useRouter } from "@/lib/i18n/navigation";
const waterfall = Waterfall({
  subsets: ["latin"],
  weight: ["400"],
});

export function Hero() {
  const t = useTranslations("property");
  const router = useRouter();

  const handlePropertyTypeClick = (type: "HOUSING" | "APARTMENT") => {
    router.push(`/search?type=${type}`);
  };

  return (
    <section className="relative isolate h-[425px]">
      {/* BG image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/assets/imgs/banner.png"
          alt="your home"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* overlay để ảnh dịu hơn */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Nội dung hero */}
      <div className="select-none mx-auto flex min-h-[360px] max-w-6xl flex-col items-center py-11.5 gap-6 px-4 text-center">
        <div className="flex justify-center gap-4">
          <Button
            variant={"outline"}
            onClick={() => handlePropertyTypeClick("HOUSING")}
            className="border-white rounded-[30px] text-sm font-medium"
          >
            {t("house")} <img src="/assets/icons/swap-right.svg" alt="" />
          </Button>
          <Button
            variant={"outline"}
            onClick={() => handlePropertyTypeClick("APARTMENT")}
            className="border-white rounded-[30px] text-sm font-medium"
          >
            {t("apartment")} <img src="/assets/icons/swap-right.svg" alt="" />
          </Button>
        </div>
        <div className="space-y-[-40px] w-full">
          <h1 className="text-6xl font-black text-white text-center">
            HOME FOR YOUR JOURNEY
          </h1>
          <h2
            className={`${waterfall.className} text-[110px] leading-none text-white/45`}
          >
            Find Your Space. Live Your Stay
          </h2>
        </div>
        <div className="z-20 w-full mt-7">
          <HeroSearch />
        </div>
      </div>
    </section>
  );
}
