/* eslint-disable @next/next/no-img-element */
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import type { Property, RoomTypeDetail } from "@/lib/api/types";
import { ChevronLeft, ChevronRight, Heart, MapPin } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import MapLocation from "../property-detail/MapLocation";
import { PropertyDescription } from "../property-detail/PropertyDescription";
import { PropertyMainContent } from "../property-detail/PropertyMainContent";
import { PropertySidebar } from "../property-detail/PropertySidebar";

interface PropertyDetailViewProps {
  property: Property | RoomTypeDetail;
  type: string;
}

export function PropertyDetailView({
  property,
  type,
}: PropertyDetailViewProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

  const thumbnailsPerView = 4;

  // Helper function to check if property is RoomTypeDetail
  const isRoomTypeDetail = (
    prop: Property | RoomTypeDetail
  ): prop is RoomTypeDetail => {
    return (
      "rooms" in prop && Array.isArray(prop.rooms) && prop.rooms.length > 0
    );
  };

  // Get images based on type
  const getImages = (): string[] => {
    if (isRoomTypeDetail(property)) {
      // For BOARDING: use heroImage + images array
      const imgs: string[] = [];
      if (property.heroImage) imgs.push(property.heroImage);
      if (property.images) imgs.push(...property.images);
      return imgs.length > 0 ? imgs : ["/assets/imgs/property-placeholder.svg"];
    } else {
      // For APARTMENT: use heroImage + gallery
      const imgs: string[] = [];
      if (property.heroImage) imgs.push(property.heroImage);
      if (property.images) imgs.push(...property.images);
      return imgs.length > 0 ? imgs : ["/assets/imgs/property-placeholder.svg"];
    }
  };

  // Get title based on type
  const getTitle = (): string => {
    if (isRoomTypeDetail(property)) {
      return property.rooms[0]?.property?.title || "Chi tiết phòng trọ";
    }
    return property.title || "Chi tiết bất động sản";
  };

  const images = getImages();
  const title = getTitle();

  // Get landlord data based on type
  const getLandlord = () => {
    if (isRoomTypeDetail(property)) {
      // For BOARDING: landlord is in nested property
      return property.rooms[0]?.property?.landlord;
    }
    // For APARTMENT: landlord would be in property.landlord (if exists)
    if (property.hasOwnProperty("landlord")) {
      return (property as Property).landlord;
    }
    // Currently Property type doesn't have landlord field, return default
    return {
      id: "default",
      fullName: "Chủ nhà",
      phone: "0987654321",
      email: "landlord@example.com",
      avatarUrl: null,
      isVerified: false,
      status: "active",
      CCCD: null,
      createdAt: "",
      updatedAt: "",
    };
  };

  // Get available units/rooms
  const getUnits = (): string[] => {
    if (isRoomTypeDetail(property)) {
      // For BOARDING: get visible room names
      return property.rooms
        .filter((room) => room.isVisible)
        .map((room) => room.name);
    }
    // For APARTMENT: return unit if available
    const apartmentProperty = property as Property;
    if (apartmentProperty.unit) {
      return [apartmentProperty.unit];
    }
    return ["A101", "A102", "A103"]; // Default mock data
  };

  const landlord = getLandlord();
  const units = getUnits();

  // Get unit info for APARTMENT
  const getUnitForApartment = () => {
    if (!isRoomTypeDetail(property)) {
      const apartmentProperty = property as Property;
      return {
        unit: apartmentProperty.unit || "",
        floor: apartmentProperty.floor || 0,
        block: apartmentProperty.block || "",
      };
    }
    return undefined;
  };

  const unitForApartment = getUnitForApartment();

  // Get propertyId based on type
  const getPropertyId = (): string => {
    if (isRoomTypeDetail(property)) {
      // For BOARDING: get ID from nested property
      return property.rooms[0]?.property?.id || "";
    }
    // For APARTMENT: get ID directly
    return property.id || "";
  };

  const propertyId = getPropertyId();

  // Get rooms data with IDs for boarding
  const getRoomsData = () => {
    if (isRoomTypeDetail(property)) {
      return property.rooms
        .filter((room) => room.isVisible)
        .map((room) => ({
          id: room.id,
          name: room.name,
        }));
    }
    return [];
  };

  const roomsData = getRoomsData();

  // Get mapLocation based on type
  const getMapLocation = (): string | undefined => {
    if (isRoomTypeDetail(property)) {
      // For BOARDING: get mapLocation from nested property
      return property.rooms[0]?.property?.mapLocation;
    }
    // For APARTMENT: get mapLocation directly
    return (property as Property).mapLocation;
  };

  const mapLocation = getMapLocation();

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
                alt={title}
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
                          alt={`${title} ${index + 1}`}
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
          <PropertyMainContent property={property} type={type} />
          {/* Property Description */}
          <PropertyDescription
            description={
              isRoomTypeDetail(property)
                ? property.rooms[0]?.property?.description || ""
                : property.description || ""
            }
          />
          {/* Map Location */}
          {mapLocation ? (
            <MapLocation mapLocation={mapLocation} />
          ) : (
            <Card className="shadow-none bg-background border-0 p-4 rounded-[12px]">
              <CardContent className="p-0">
                <div className="font-bold text-primary mb-4 flex items-center gap-2">
                  <div className="w-6 h-6 flex items-center justify-center bg-[#D9D9D9] rounded-full">
                    <MapPin className="h-3 w-3 text-primary" />
                  </div>
                  Vị trí bất động sản trên bản đồ
                </div>
                <div className="w-full h-[160px] rounded-lg overflow-hidden relative">
                  <Image
                    src="/assets/imgs/map-location.png"
                    alt="Map location"
                    fill
                    className="object-cover"
                    sizes="100vw"
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Agent and Actions */}
        <div className="space-y-6">
          <PropertySidebar
            landlord={
              landlord ?? {
                id: "default",
                fullName: "Chủ nhà",
                phone: "0987654321",
                email: "landlord@example.com",
                avatarUrl: null,
                isVerified: false,
                status: "active",
                CCCD: null,
                createdAt: "",
                updatedAt: "",
              }
            }
            units={units}
            unitForApartment={unitForApartment}
            propertyId={propertyId}
            propertyType={type === "boarding" ? "boarding" : "apartment"}
            roomsData={roomsData}
            isRented={
              type === "apartment" &&
              !isRoomTypeDetail(property) &&
              property.isVisible === false
            }
          />
        </div>
      </div>
    </div>
  );
}
