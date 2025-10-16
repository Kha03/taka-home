"use client";

import React, { ReactNode, useMemo } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin, Clock, Check, X } from "lucide-react";
import { PropertyDetails } from "../property-detail/PropertyDetails";
import { Button } from "../ui/button";

/**
 * PropertyListItem — a real-estate list row component
 *
 * Visuals inspired by the provided screenshot. Uses shadcn/ui + Tailwind.
 */
export type PropertyStatus = "cho-duyet" | "tu-choi" | "da-duyet";

export type PropertyListItemProps = {
  id?: string | number;
  title: string;
  roomType?: string; // "Phòng trọ" for boarding properties
  beds: number;
  baths: number;
  areaM2: number;
  priceMonthly?: number; // in VND
  priceText?: string; // overrides formatted price
  updatedAt?: Date | string | number; // used for "Cập nhật ... trước"
  location: string;
  images: string[]; // [main, ...thumbs]
  status?: PropertyStatus;
  /** Left selection checkbox */
  selectable?: boolean;
  selected?: boolean;
  onSelectChange?: (selected: boolean) => void;
  onClick?: () => void; // clicking the row
  /** Optional right-side action(s) */
  actions?: ReactNode;
  /** Admin actions */
  onApprove?: () => void;
  onReject?: () => void;
  onView?: () => void;
  className?: string;
};

const fmtVND = (v?: number) =>
  typeof v === "number"
    ? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" })
        .format(v)
        .replace(/\s?₫$/, "VND")
    : undefined;

function timeAgo(input?: Date | string | number) {
  if (!input) return undefined;
  const d = new Date(input);
  const diff = Math.max(0, Date.now() - d.getTime());
  const h = Math.floor(diff / 36e5);
  if (h < 1) {
    const m = Math.max(1, Math.floor(diff / 6e4));
    return `${m} phút trước`;
  }
  if (h < 24) return `${h} giờ trước`;
  const days = Math.floor(h / 24);
  return `${days} ngày trước`;
}

const statusMap: Record<
  NonNullable<PropertyListItemProps["status"]>,
  { label: string; tone: "amber" | "red" | "green" }
> = {
  "cho-duyet": { label: "Chờ duyệt", tone: "amber" },
  "tu-choi": { label: "Từ chối", tone: "red" },
  "da-duyet": { label: "Đã duyệt", tone: "green" },
};

export default function PropertyListItem(props: PropertyListItemProps) {
  const {
    title,
    roomType,
    beds,
    baths,
    areaM2,
    priceMonthly,
    priceText,
    updatedAt,
    location,
    images,
    status = "cho-duyet",
    selectable,
    selected,
    onSelectChange,
    onClick,
    actions,
    className,
  } = props;

  const price =
    priceText ??
    (fmtVND(priceMonthly) ? `${fmtVND(priceMonthly)}/Tháng` : undefined);
  const updated = timeAgo(updatedAt);
  const [mainImage, ...thumbs] = images.length ? images : ["/placeholder.svg"];

  const StatusPill = useMemo(() => {
    const meta = statusMap[status];
    if (!meta) return null;
    const base =
      "rounded-full px-2 py-1 text-xs font-bold text-primary-foreground w-20 text-center flex-shrink-0";
    const variantClass =
      meta.tone === "amber"
        ? "bg-accent "
        : meta.tone === "red"
        ? "bg-[#8D8D8D]"
        : "bg-[#00AE26]";
    return <span className={`${base} ${variantClass}`}>{meta.label}</span>;
  }, [status]);

  return (
    <Card
      tabIndex={0}
      className={`group flex items-center flex-row gap-2.5 rounded-[8px] border-none shadow-none bg-transparent p-3 transition hover:bg-accent/10  ${
        className ?? ""
      }`}
    >
      {/* Select checkbox */}
      {selectable ? (
        <div onClick={(e) => e.stopPropagation()}>
          <Checkbox
            checked={selected}
            onCheckedChange={(v) => onSelectChange?.(!!v)}
            aria-label={selected ? "Bỏ chọn" : "Chọn"}
            className="data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500 shrink-0 cursor-pointer"
          />
        </div>
      ) : (
        <div className="w-4 shrink-0" />
      )}

      {/* Main image */}
      <div className="relative h-30 w-40 overflow-hidden rounded-[8px] md:h-33 md:w-54 shrink-0">
        <Image
          src={mainImage}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 216px"
        />
      </div>

      {/* Content section - grows to fill available space */}
      <div className="flex-1 min-w-0 flex flex-col justify-between gap-2 h-full">
        {/* Title and room type */}
        <div className="flex  gap-2 items-center">
          <p className="line-clamp-2 text-lg font-bold text-primary">{title}</p>
          {roomType && (
            <span className="text-xs font-medium text-[#DCBB87] bg-[#DCBB87]/30 px-2 py-0.5 rounded-full w-fit">
              {roomType}
            </span>
          )}
        </div>

        {/* Stats and info in horizontal layout */}
        <div className="flex items-center justify-between">
          <PropertyDetails bedrooms={beds} bathrooms={baths} area={areaM2} />
          {price ? (
            <p className="text-sm font-semibold text-accent md:text-base ">
              {price}
            </p>
          ) : null}
        </div>
        {updated && (
          <div className="flex items-center gap-1 text-sm text-[#4f4f4f]">
            <div className="w-6 h-6 rounded-full bg-[#e5e5e5] flex items-center justify-center">
              <Clock className="w-4 h-4 text-primary" />
            </div>
            <span>cập nhật {updated}</span>
          </div>
        )}
        <div className="flex items-center gap-1 text-sm text-[#4f4f4f]">
          <div className="w-6 h-6 rounded-full bg-[#e5e5e5] flex items-center justify-center">
            <MapPin className="w-4 h-4 text-primary" />
          </div>
          <span className="truncate max-w-full" title={location}>
            {location}
          </span>
        </div>
      </div>

      {/* Thumbnails in 2x2 grid */}
      <div className="grid grid-cols-2 gap-2">
        {thumbs.slice(0, 4).map((src, i) => (
          <div
            key={i}
            className="relative h-14 w-20 overflow-hidden rounded-md md:h-16 md:w-24"
          >
            <Image
              src={src}
              alt={`thumb-${i + 1}`}
              fill
              sizes="96px"
              className="object-cover"
            />
          </div>
        ))}
      </div>
      {/* Status pill */}
      <div className="flex flex-col items-center justify-between gap-2 shrink-0 h-full ">
        {StatusPill}
        {status === "cho-duyet" && (
          <div className="flex items-center justify-center gap-1 w-full">
            <Button
              variant="outline"
              className="h-6 w-6 rounded-full bg-[#00AE26]/20 text-[#00AE26] hover:bg-[#00AE26]/40 border-none flex-shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                props.onApprove?.();
              }}
            >
              <Check className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              className="h-6 w-6 rounded-full bg-[#FA0000]/25 text-[#FA0000] hover:bg-[#FA0000]/50 border-none flex-shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                props.onReject?.();
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}

// Skeleton for loading state
export function PropertyListItemSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border bg-muted/20 p-3 md:p-4">
      <div className="flex items-center gap-4">
        <div className="h-4 w-4 rounded bg-muted shrink-0" />
        <div className="h-[120px] w-[160px] rounded-lg bg-muted md:h-[160px] md:w-[210px] shrink-0" />
        <div className="flex-1 flex flex-col gap-3">
          <div className="h-4 w-2/3 rounded bg-muted" />
          <div className="flex gap-3">
            <div className="h-4 w-16 rounded bg-muted" />
            <div className="h-4 w-16 rounded bg-muted" />
            <div className="h-4 w-16 rounded bg-muted" />
          </div>
          <div className="h-4 w-5/6 rounded bg-muted" />
        </div>
        <div className="flex flex-col items-end justify-between gap-2 shrink-0 h-full">
          <div className="h-4 w-28 rounded bg-muted" />
          <div className="grid grid-cols-2 gap-2">
            <div className="h-14 w-20 rounded-md bg-muted md:h-16 md:w-24" />
            <div className="h-14 w-20 rounded-md bg-muted md:h-16 md:w-24" />
            <div className="h-14 w-20 rounded-md bg-muted md:h-16 md:w-24" />
            <div className="h-14 w-20 rounded-md bg-muted md:h-16 md:w-24" />
          </div>
        </div>
      </div>
    </div>
  );
}
