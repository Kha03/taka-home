/* eslint-disable @next/next/no-img-element */
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { PropertySidebar } from "../property-detail/PropertySidebar";
import { PropertyMainContent } from "../property-detail/PropertyMainContent";
import { PropertyDescription } from "../property-detail/PropertyDescription";
import MapLocation from "../property-detail/MapLocation";

interface PropertyAgent {
  name: string;
  phone: string;
  avatar: string;
}

interface Property {
  id: string;
  title: string;
  price: string;
  location: string;
  area: string;
  bedrooms: number;
  bathrooms: number;
  type: string;
  images: string[];
  description: string;
  features: string[];
  agent: PropertyAgent;
}

interface PropertyDetailViewProps {
  property: Property;
}

export function PropertyDetailView({ property }: PropertyDetailViewProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

  const thumbnailsPerView = 4;

  const hasImages = property.images && property.images.length > 0;
  const images = hasImages
    ? property.images
    : ["/assets/imgs/property-placeholder.svg"];

  // Tính index bắt đầu của "trang" hiện tại cho strip
  useEffect(() => {
    if (!carouselApi) return;
    const pageStartIndex =
      Math.floor(currentImageIndex / thumbnailsPerView) * thumbnailsPerView;

    if (carouselApi.selectedScrollSnap() !== pageStartIndex) {
      carouselApi.scrollTo(pageStartIndex);
    }
  }, [currentImageIndex, carouselApi]);

  const lastStartIndex = useMemo(() => {
    return Math.max(0, images.length - thumbnailsPerView);
  }, [images.length]);

  const nextImage = () => {
    if (images.length <= 1) return;

    const nextIndex = currentImageIndex + 1;
    if (nextIndex >= images.length) {
      // Wrap về ảnh đầu
      setCurrentImageIndex(0);
      // Đưa strip về trang đầu
      carouselApi?.scrollTo(0);
    } else {
      setCurrentImageIndex(nextIndex);
      // Nếu nhảy tới ảnh cuối, đảm bảo strip đang ở trang cuối
      if (nextIndex === images.length - 1) {
        carouselApi?.scrollTo(lastStartIndex);
      }
    }
  };

  const prevImage = () => {
    if (images.length <= 1) return;

    const prevIndex = currentImageIndex - 1;
    if (prevIndex < 0) {
      // Wrap về ảnh cuối
      setCurrentImageIndex(images.length - 1);
      // Đưa strip về trang cuối
      carouselApi?.scrollTo(lastStartIndex);
    } else {
      setCurrentImageIndex(prevIndex);
      // Nếu lùi tới đầu một trang, Embla sẽ được đồng bộ bởi useEffect
    }
  };

  const selectImage = (index: number) => {
    if (index >= 0 && index < images.length) {
      setCurrentImageIndex(index);
    }
  };

  const canScrollPrev = images.length > 1;
  const canScrollNext = images.length > 1;

  return (
    <div className="space-y-6">
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column - Images and Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <Card className="p-0 gap-2 bg-transparent border-0 shadow-none mb-4">
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden">
              <img
                src={images[currentImageIndex]}
                alt={property.title}
                className="w-full h-full object-cover"
              />

              {/* Action buttons */}
              <div className="absolute top-4 right-4 flex gap-2">
                <Button
                  variant="default"
                  size="sm"
                  className="bg-primary/20 hover:bg-primary/10 backdrop-blur-sm"
                  onClick={() => setIsLiked(!isLiked)}
                >
                  <Heart
                    className={`h-4 w-4 ${
                      isLiked ? "fill-red-500 text-red-500" : ""
                    }`}
                  />
                </Button>
              </div>

              {/* Image indicators */}
              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentImageIndex ? "bg-white" : "bg-white/50"
                      }`}
                      onClick={() => selectImage(index)}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <Carousel
                className="w-full"
                opts={{
                  align: "start",
                  loop: false,
                  skipSnaps: false,
                  dragFree: false,
                }}
                setApi={setCarouselApi}
              >
                <CarouselContent className="-ml-2">
                  {images.map((image, index) => (
                    <CarouselItem key={index} className="pl-2 basis-1/4">
                      <button
                        className={`w-full aspect-[195/110] rounded-lg overflow-hidden border-2 transition-all ${
                          index === currentImageIndex
                            ? "border-primary "
                            : "border-gray-200 hover:border-secondary/50"
                        }`}
                        onClick={() => selectImage(index)}
                        aria-label={`Select image ${index + 1}`}
                      >
                        <img
                          src={image}
                          alt={`${property.title} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    </CarouselItem>
                  ))}
                </CarouselContent>

                {/* Custom Navigation Buttons */}
                <Button
                  variant="secondary"
                  className="absolute left-[-15px] top-1/2 -translate-y-1/2 h-7 w-7 bg-white hover:bg-gray-50 border border-gray-200 shadow-md rounded-full p-0"
                  onClick={prevImage}
                  disabled={!canScrollPrev}
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-4 w-4 text-primary" />
                </Button>
                <Button
                  variant="secondary"
                  className="absolute right-[-15px] top-1/2 -translate-y-1/2 h-7 w-7 bg-white hover:bg-gray-50 border border-gray-200 shadow-md rounded-full p-0"
                  onClick={nextImage}
                  disabled={!canScrollNext}
                  aria-label="Next image"
                >
                  <ChevronRight className="h-4 w-4 text-primary" />
                </Button>
              </Carousel>
            )}
          </Card>

          {/* Property Information */}
          <PropertyMainContent />
          {/* Property Description */}
          <PropertyDescription />
          {/* Map Location */}
          <MapLocation />
        </div>

        {/* Right Column - Agent and Actions */}
        <div className="space-y-6">
          <PropertySidebar
            units={[
              "A101",
              "A102",
              "A103",
              "A104",
              "A105",
              "A106",
              "A107",
              "A108",
              "A109",
              "A110",
              "A111",
              "A112",
            ]}
            reviews={[
              {
                id: 1,
                name: "Nguyễn Thị Người Thuê",
                avatar: "/vietnamese-woman-profile.jpg",
                rating: 5,
                time: "Vừa xong",
                content:
                  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
              },
              {
                id: 2,
                name: "Nguyễn Thị Người Thuê",
                avatar: "/vietnamese-woman-profile.jpg",
                rating: 5,
                time: "Vừa xong",
                content:
                  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
              },
              {
                id: 3,
                name: "Nguyễn Thị Người Thuê",
                avatar: "/vietnamese-woman-profile.jpg",
                rating: 5,
                time: "Vừa xong",
                content:
                  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
              },
              {
                id: 33,
                name: "Nguyễn Thị Người Thuê",
                avatar: "/vietnamese-woman-profile.jpg",
                rating: 5,
                time: "Vừa xong",
                content:
                  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
              },
              {
                id: 3131,
                name: "Nguyễn Thị Người Thuê",
                avatar: "/vietnamese-woman-profile.jpg",
                rating: 5,
                time: "Vừa xong",
                content:
                  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
              },
              {
                id: 1313,
                name: "Nguyễn Thị Người Thuê",
                avatar: "/vietnamese-woman-profile.jpg",
                rating: 5,
                time: "Vừa xong",
                content:
                  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
