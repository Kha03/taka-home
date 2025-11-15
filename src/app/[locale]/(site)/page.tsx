import { Hero } from "@/components/hero";
import { AboutUs } from "@/components/sections/about-us";
import { FeaturedProperties } from "@/components/sections/featured-properties";
import { LocationSection } from "@/components/sections/location-section";
import { NewestProperties } from "@/components/sections/newest-properties";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      <div className="bg-[#FFF7E9]">
        {/* Featured Properties Section */}
        <FeaturedProperties />
        <div className="mx-auto h-px w-full max-w-7xl bg-gray-200" />
        {/* Newest Properties Section */}
        <NewestProperties />
      </div>

      <div className="bg-primary-foreground mt-5">
        {/* Location Section */}
        <LocationSection />
      </div>
      {/* About Us Section */}
      <AboutUs />
    </div>
  );
}
