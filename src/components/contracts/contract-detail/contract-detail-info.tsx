"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Home, DollarSign } from "lucide-react";
import type { Booking } from "@/lib/api/services/booking";
import { useTranslations } from "next-intl";

interface ContractDetailInfoProps {
  booking: Booking;
}

export function ContractDetailInfo({ booking }: ContractDetailInfoProps) {
  const t = useTranslations("contract");
  const { property, room, contract } = booking;
  // Format date
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("vi-VN");
    } catch {
      return dateString;
    }
  };

  // Get price and deposit
  const price = room ? parseFloat(room.roomType.price) : property.price || 0;
  const deposit = room
    ? parseFloat(room.roomType.deposit)
    : parseFloat(property.deposit || "0");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Property Information */}
      <Card className="bg-primary-foreground shadow-sm rounded-2xl border-none">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-primary flex items-center gap-2">
            <Home className="w-5 h-5" />
            {t("propertyInfo")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">
              {t("propertyType")}
            </p>
            <p className="font-semibold text-foreground">
              {property.type === "APARTMENT"
                ? t("apartmentType")
                : property.type === "HOUSING"
                ? t("privateHouse")
                : t("boarding")}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">{t("address")}</p>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
              <p className="font-semibold text-foreground">
                {property.address}
              </p>
            </div>
          </div>
          {room && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">{t("room")}</p>
              <p className="font-semibold text-foreground">
                {room.name} - {room.roomType.name}
              </p>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">{t("area")}</p>
              <p className="font-semibold text-foreground">
                {room ? room.roomType.area : property.area} m²
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                {t("bedrooms")}
              </p>
              <p className="font-semibold text-foreground">
                {room ? room.roomType.bedrooms : property.bedrooms}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                {t("bathrooms")}
              </p>
              <p className="font-semibold text-foreground">
                {room ? room.roomType.bathrooms : property.bathrooms}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                {t("furniture")}
              </p>
              <p className="font-semibold text-foreground">
                {room ? room.roomType.furnishing : property.furnishing}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contract Information */}
      <Card className="bg-primary-foreground shadow-sm rounded-2xl border-none">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-primary flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            {t("contractInfoTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {contract && (
            <>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  {t("contractCode")}
                </p>
                <p className="font-semibold text-foreground">
                  {contract.contractCode}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  {t("contractPeriod")}
                </p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <p className="font-semibold text-foreground">
                    {formatDate(contract.startDate)} -{" "}
                    {formatDate(contract.endDate)}
                  </p>
                </div>
              </div>
            </>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-[#f5f5f5] rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-primary" />
                <p className="text-sm text-muted-foreground">
                  {t("rentPrice")}
                </p>
              </div>
              <p className="text-lg font-bold text-secondary">
                {price.toLocaleString("vi-VN")} VND
              </p>
            </div>
            <div className="p-4 bg-[#f5f5f5] rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-primary" />
                <p className="text-sm text-muted-foreground">{t("deposit")}</p>
              </div>
              <p className="text-lg font-bold text-secondary">
                {deposit.toLocaleString("vi-VN")} VND
              </p>
            </div>
          </div>
          {property.type === "BOARDING" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  {t("electricityLabel")}
                </p>
                <p className="font-semibold text-foreground">
                  {parseFloat(
                    property.electricityPricePerKwh || "0"
                  ).toLocaleString("vi-VN")}{" "}
                  VND/kWh
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  {t("waterLabel")}
                </p>
                <p className="font-semibold text-foreground">
                  {parseFloat(property.waterPricePerM3 || "0").toLocaleString(
                    "vi-VN"
                  )}{" "}
                  VND/m³
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
