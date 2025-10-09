/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useId } from "react";
import {
  useForm,
  FormProvider,
  useFieldArray,
  FieldValues,
} from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Upload,
  Plus,
  Trash2,
  ImageIcon,
  Ruler,
  Info,
  CircleAlert,
  X,
  Play,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useVietnameseAddress } from "@/hooks/use-vietnamese-address";

/**
 * NEW PROPERTY FORM (Next.js App Router — Client Component)
 * --------------------------------------------------------
 * - Matches the provided UI (VN labels) closely
 * - Built with shadcn/ui + Tailwind + RHF + zod
 * - Two listing modes: "Căn hộ/Chung cư" (apartment) & "Phòng trọ" (boarding)
 * - Stepper: 1) Nhập thông tin BĐS → 2) Tạo hợp đồng → 3) Chờ xét duyệt
 * - Image upload components are mocked; wire them to your upload later
 */

// ------------------------------
// Schema
// ------------------------------
const BASE_REQUIRED = "Trường này là bắt buộc";
const VALIDATION_MESSAGES = {
  title: {
    required: "Tên bất động sản là bắt buộc",
    min: "Tên bất động sản phải có ít nhất 1 ký tự",
    max: "Tên bất động sản không được vượt quá 100 ký tự",
  },
  area: {
    required: "Diện tích là bắt buộc",
    min: "Diện tích phải lớn hơn 0",
  },
  price: {
    required: "Giá thuê là bắt buộc",
    min: "Giá thuê phải lớn hơn 0",
  },
  address: {
    province: "Vui lòng chọn tỉnh, thành phố",
    district: "Vui lòng chọn quận, huyện",
    ward: "Vui lòng chọn phường, xã",
    street: "Vui lòng nhập số nhà, tên đường",
  },
  description: {
    max: "Mô tả không được vượt quá 1500 ký tự",
  },
};

const ListingKind = z.enum(["apartment", "boarding"], {
  required_error: BASE_REQUIRED,
});

const RoomTypeSchema = z.object({
  name: z.string().min(1, BASE_REQUIRED),
  bedrooms: z.coerce.number().min(0).default(0),
  bathrooms: z.coerce.number().min(0).default(0),
  legalDoc: z.string().optional(),
  area: z.coerce.number().min(0.1, BASE_REQUIRED),
  price: z.coerce.number().min(0, BASE_REQUIRED),
  deposit: z.coerce.number().min(0).optional(),
  count: z.coerce.number().min(1, BASE_REQUIRED),
  locations: z.array(z.string()).default([]),
  images: z.array(z.string()).max(8).default([]),
});

const FormSchema = z.object({
  title: z
    .string()
    .min(1, VALIDATION_MESSAGES.title.min)
    .max(100, VALIDATION_MESSAGES.title.max),
  kind: ListingKind,
  province: z.string().min(1, VALIDATION_MESSAGES.address.province),
  district: z.string().min(1, VALIDATION_MESSAGES.address.district),
  ward: z.string().min(1, VALIDATION_MESSAGES.address.ward),
  street: z.string().min(1, VALIDATION_MESSAGES.address.street),

  // Apartment specific
  block: z.string().optional(),
  floor: z.string().optional(),
  unit: z.string().optional(),

  // Boarding specific
  floors: z
    .array(
      z.object({
        name: z.string(),
        rooms: z.array(z.string()),
      })
    )
    .default([]),

  description: z
    .string()
    .max(1500, VALIDATION_MESSAGES.description.max)
    .optional(),

  // Details
  bedrooms: z.coerce.number().min(0).optional(),
  bathrooms: z.coerce.number().min(0).optional(),
  furnishing: z.string().optional(),
  legalDoc: z.string().optional(),
  area: z.coerce.number().min(0.1, VALIDATION_MESSAGES.area.min),
  price: z.coerce.number().min(0, VALIDATION_MESSAGES.price.min),
  deposit: z.coerce.number().min(0).optional(),

  heroImage: z.string().optional(),
  gallery: z.array(z.string()).max(8).default([]),

  // Boarding groups
  roomTypes: z.array(RoomTypeSchema).default([]),
});

export type NewPropertyForm = z.infer<typeof FormSchema>;

// ------------------------------
// Helpers
// ------------------------------

function DottedBox({
  children,
  className = "",
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div className={`rounded-xl border-2 border-dotted p-4 ${className}`}>
      {children}
    </div>
  );
}

// Real image uploader with API integration
function ImageDrop({
  label,
  onPick,
  onError,
}: {
  label: string;
  onPick: (src: string) => void;
  onError?: (error: string) => void;
}) {
  const [isUploading, setIsUploading] = useState(false);
  // Tạo id cố định để tránh hydration mismatch
  const inputId = useId();

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        onPick(result.data.url);
      } else {
        onError?.(result.message || "Có lỗi xảy ra khi upload ảnh");
      }
    } catch (error) {
      console.error("Upload error:", error);
      onError?.("Có lỗi xảy ra khi upload ảnh");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <DottedBox className="flex h-40 w-full items-center justify-center bg-muted/30 border-accent">
      <input
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
        id={inputId}
        disabled={isUploading}
      />
      <label
        htmlFor={inputId}
        className="flex cursor-pointer items-center gap-2 text-muted-foreground hover:text-foreground"
      >
        <Upload className="h-5 w-5" />
        <span>{isUploading ? "Đang tải..." : label}</span>
      </label>
    </DottedBox>
  );
}

// ------------------------------
// Stepper
// ------------------------------
function Stepper({ step }: { step: 1 | 2 | 3 }) {
  const items = [
    { id: 1, label: "Nhập thông tin BĐS" },
    { id: 2, label: "Tạo hợp đồng" },
    { id: 3, label: "Chờ xét duyệt" },
  ] as const;
  return (
    <div className="mx-auto mb-6 flex max-w-3xl items-center gap-3">
      {items.map((it, idx) => (
        <React.Fragment key={it.id}>
          <div className="flex items-center gap-2">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full border text-sm font-semibold ${
                step === it.id ? "bg-accent text-primary" : "bg-background"
              }`}
            >
              {it.id}
            </div>
            <span className="text-sm text-primary">{it.label}</span>
          </div>
          {idx < items.length - 1 && <div className="h-px flex-1 bg-muted" />}
        </React.Fragment>
      ))}
    </div>
  );
}

// ------------------------------
// Boarding builder (floors & quick tags)
// ------------------------------
// Component để thêm tầng mới
function AddFloorCard({
  onAdd,
  nextFloorName,
}: {
  onAdd: () => void;
  nextFloorName: string;
}) {
  return (
    <Card
      className="group overflow-hidden bg-primary-foreground rounded-[8px] border-accent/60 border-dashed p-2 gap-2 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 cursor-pointer"
      onClick={onAdd}
    >
      <div className="items-center justify-center flex gap-2">
        <CardTitle className="text-xs px-2.5 py-1 bg-muted/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary rounded-[30px] font-bold transition-all duration-200">
          {nextFloorName}
        </CardTitle>
      </div>
      <CardContent className="p-0 flex items-center justify-center">
        <div className="flex items-center justify-center py-4 bg-accent group-hover:bg-primary h-10 w-10 mt-5 rounded-full transition-all duration-200">
          <Plus className="h-4 w-4 text-primary group-hover:text-white transition-colors duration-200" />
        </div>
      </CardContent>
    </Card>
  );
}

function BoardingStructure() {
  const { control } = useFormContextStrict<NewPropertyForm>();
  const { fields, append, remove } = useFieldArray({ control, name: "floors" });

  const getNextFloorName = () => {
    if (fields.length === 0) {
      return "Tầng trệt";
    } else if (fields.length === 1) {
      return "Tầng 1";
    } else {
      return `Tầng ${fields.length}`;
    }
  };

  const addFloor = () => {
    append({ name: getNextFloorName(), rooms: [] });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-[#4F4F4F] font-semibold text-sm">
          Cơ cấu Bất động sản
          <CircleAlert className="h-4 w-4 text-[#FA0000]" />
        </Label>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {fields.map((f, i) => (
          <Card
            key={f.id}
            className="overflow-hidden bg-primary-foreground rounded-[8px] border-accent/60 p-2 gap-2"
          >
            <div className="items-center justify-center flex gap-2">
              <CardTitle className="text-xs px-2.5 py-1 bg-accent text-primary-foreground rounded-[30px] font-bold">
                {f.name}
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => remove(i)}
                className="w-6 h-6"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <CardContent className="p-0">
              <TagEditor index={i} />
            </CardContent>
          </Card>
        ))}
        <AddFloorCard onAdd={addFloor} nextFloorName={getNextFloorName()} />
      </div>
    </div>
  );
}

function TagEditor({ index }: { index: number }) {
  const { register, watch, setValue } = useFormContextStrict<NewPropertyForm>();
  const roomsPath = `floors.${index}.rooms` as const;
  const rooms = watch(roomsPath) as string[];

  const addRoom = () =>
    setValue(roomsPath, [...rooms, `A${(rooms.length + 101).toString()}`]);
  const removeRoom = (i: number) =>
    setValue(
      roomsPath,
      rooms.filter((_, idx) => idx !== i)
    );

  return (
    <div className="space-y-2">
      {/* Grid hiển thị các phòng 3 cột một hàng */}
      <div className="grid grid-cols-3 gap-2">
        {rooms.map((r, i) => (
          <span
            key={i}
            className="rounded-full bg-muted px-2 py-1  text-xs flex items-center justify-center"
          >
            <span className="truncate">{r}</span>
            <button
              className="text-muted-foreground hover:text-foreground flex-shrink-0 p-1"
              type="button"
              onClick={() => removeRoom(i)}
            >
              <X className="h-2 w-2" />
            </button>
          </span>
        ))}
      </div>

      <div className="flex justify-center pt-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addRoom}
          className="w-full text-primary hover:bg-accent/20 border-accent"
        >
          <Plus className="mr-1 h-4 w-4 " /> Thêm phòng
        </Button>
      </div>

      <input type="hidden" {...register(roomsPath as any)} />
    </div>
  );
}

// Component để chọn vị trí phòng cho RoomType
function RoomSelector({ roomTypeIndex }: { roomTypeIndex: number }) {
  const { watch, setValue } = useFormContextStrict<NewPropertyForm>();
  const floors = watch("floors");
  const roomTypes = watch("roomTypes");
  const currentRoomTypeLocations = watch(
    `roomTypes.${roomTypeIndex}.locations`
  ) as string[];

  // Lấy tất cả phòng đã được chọn bởi các room type khác
  const getSelectedRoomsByOtherTypes = () => {
    const selectedRooms = new Set<string>();
    roomTypes.forEach((roomType, index) => {
      if (index !== roomTypeIndex) {
        roomType.locations?.forEach((room) => selectedRooms.add(room));
      }
    });
    return selectedRooms;
  };

  const selectedRoomsByOthers = getSelectedRoomsByOtherTypes();

  const toggleRoomSelection = (floorIndex: number, roomName: string) => {
    const roomId = `${floorIndex}-${roomName}`;
    const updatedLocations = currentRoomTypeLocations.includes(roomId)
      ? currentRoomTypeLocations.filter((loc) => loc !== roomId)
      : [...currentRoomTypeLocations, roomId];

    setValue(`roomTypes.${roomTypeIndex}.locations`, updatedLocations);
  };

  const isRoomSelected = (floorIndex: number, roomName: string) => {
    const roomId = `${floorIndex}-${roomName}`;
    return currentRoomTypeLocations.includes(roomId);
  };

  const isRoomDisabled = (floorIndex: number, roomName: string) => {
    const roomId = `${floorIndex}-${roomName}`;
    return selectedRoomsByOthers.has(roomId);
  };

  return (
    <div className="space-y-3">
      {floors.map((floor, floorIndex) => (
        <div key={floorIndex} className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="text-xs px-2.5 py-1 bg-accent text-primary-foreground rounded-[30px] font-bold">
              {floor.name}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {floor.rooms.map((room, roomIndex) => {
              const selected = isRoomSelected(floorIndex, room);
              const disabled = isRoomDisabled(floorIndex, room);

              return (
                <button
                  key={roomIndex}
                  type="button"
                  onClick={() =>
                    !disabled && toggleRoomSelection(floorIndex, room)
                  }
                  disabled={disabled}
                  className={`rounded-full px-2 py-1 text-xs flex items-center justify-center transition-colors ${
                    disabled
                      ? "bg-muted/50 text-muted-foreground cursor-not-allowed opacity-50"
                      : selected
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground hover:bg-primary/20"
                  }`}
                >
                  <span className="truncate">{room}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
      {floors.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          Vui lòng thêm cơ cấu bất động sản trước
        </p>
      )}
    </div>
  );
}

// ------------------------------
// Room type (boarding detail blocks)
// ------------------------------
function RoomTypes() {
  const { control } = useFormContextStrict<NewPropertyForm>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "roomTypes",
  });

  return (
    <div className="space-y-3 mt-5">
      <div className="space-y-6">
        {fields.map((f, idx) => (
          <div key={f.id} className="relative mb-8">
            <Card className="bg-primary-foreground border-2 border-dashed shadow-none pt-8">
              <div className="absolute -top-3 left-4 bg-accent px-2 py-1 rounded-[30px]">
                <CardTitle className="text-sm text-primary-foreground font-semibold">{`Phòng loại ${
                  idx + 1
                }`}</CardTitle>
              </div>
              <div className="absolute -top-3 right-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(idx)}
                  className="bg-accent/25 rounded-md h-8 w-8"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <CardContent className="grid gap-6 lg:grid-cols-3">
                {/* Thông tin chi tiết - 2 cột */}
                <div className="space-y-4 lg:col-span-2">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="h-6 w-6 bg-primary rounded-full flex items-center justify-center">
                      <Info className="w-3 h-3 text-white" />
                    </div>
                    <p className="font-bold text-primary">Thông tin chi tiết</p>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <Field
                      label="Số phòng ngủ"
                      name={`roomTypes.${idx}.bedrooms`}
                      type="number"
                      placeholder="0"
                      required
                    />
                    <Field
                      label="Số phòng vệ sinh"
                      name={`roomTypes.${idx}.bathrooms`}
                      type="number"
                      placeholder="0"
                      required
                    />
                    <SelectField
                      label="Tình trạng nội thất"
                      name="furnishing"
                      options={["Đầy đủ", "Cơ bản", "Trống"]}
                      placeholder="Chọn tình trạng nội thất"
                      required
                    />
                    <SelectField
                      label="Giấy tờ pháp lý"
                      name={`roomTypes.${idx}.legalDoc`}
                      options={["Sổ hồng", "HĐMB", "Khác"]}
                      placeholder="Chọn loại giấy tờ"
                      required
                    />
                    <Field
                      label="Diện tích"
                      name={`roomTypes.${idx}.area`}
                      type="number"
                      placeholder="m²"
                      required
                    />
                    <Field
                      label="Giá thuê"
                      name={`roomTypes.${idx}.price`}
                      type="number"
                      placeholder="VND"
                      required
                    />
                    <Field
                      label="Số lượng"
                      name={`roomTypes.${idx}.count`}
                      type="number"
                      placeholder="1"
                    />
                  </div>
                  <DepositField roomIndex={idx} />
                  <div>
                    <Label className="mb-2 block">
                      Vị trí phòng loại {idx + 1}
                    </Label>
                    <div className="rounded-xl border-2 border-dotted p-4 bg-muted/30 border-accent">
                      <RoomSelector roomTypeIndex={idx} />
                    </div>
                  </div>
                </div>

                {/* Hình ảnh đính kèm - 1 cột */}
                <div className="space-y-4 lg:col-span-1">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="h-6 w-6 bg-primary rounded-full flex items-center justify-center">
                      <Info className="w-3 h-3 text-white" />
                    </div>
                    <p className="font-bold text-primary">Hình ảnh đính kèm</p>
                  </div>
                  <ImageDrop
                    label="Tải lên ảnh phòng (850 × 450)"
                    onPick={(src) => console.log("Picked", src)}
                  />
                  <div className="grid grid-cols-3 gap-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <DottedBox
                        key={i}
                        className="aspect-video flex items-center justify-center bg-muted/30 border-accent"
                      >
                        <ImageIcon className="h-5 w-5 text-accent" />
                      </DottedBox>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
      <div
        onClick={() =>
          append({
            name: `Loại ${fields.length + 1}`,
            bedrooms: 1,
            bathrooms: 1,
            legalDoc: "Sổ hồng",
            area: 20,
            price: 0,
            count: 1,
            deposit: 0,
            locations: [],
            images: [],
          })
        }
        className="flex items-center gap-2 cursor-pointer"
      >
        <div className="flex items-center w-8 h-8 justify-center rounded-full bg-accent">
          <Plus className="h-4 w-4 text-white" />
        </div>
        <span className="text-primary hover:text-accent transition-colors">
          Thêm phân loại phòng
        </span>
      </div>
    </div>
  );
}

// ------------------------------
// Field abstractions
// ------------------------------
import { Controller, useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";
function useFormContextStrict<T extends FieldValues>() {
  const ctx = useFormContext<T>();
  if (!ctx) throw new Error("Must be used within <FormProvider>");
  return ctx;
}
function Field({
  label,
  name,
  placeholder,
  type = "text",
  rightIcon,
  required = false,
}: {
  label?: string;
  name: string;
  placeholder?: string;
  type?: string;
  rightIcon?: React.ReactNode;
  required?: boolean;
}) {
  const {
    register,
    formState: { errors },
  } = useFormContextStrict<NewPropertyForm>();

  // Get nested error path
  const getError = (path: string) => {
    const keys = path.split(".");
    let error = errors;
    for (const key of keys) {
      if (error && typeof error === "object" && key in error) {
        error = (error as any)[key];
      } else {
        return null;
      }
    }
    return typeof error === "object" && error !== null && "message" in error
      ? error
      : null;
  };

  const error = getError(name);
  const hasError = !!error;

  return (
    <div>
      <Label className="mb-2 text-[#4F4F4F] flex items-center gap-1 font-semibold">
        {label}
        {required && <CircleAlert className="h-4 w-4 text-[#FA0000]" />}
      </Label>
      <div className="relative">
        <Input
          type={type}
          placeholder={placeholder}
          className={cn(
            "w-full rounded-[30px] bg-[#F4F4F4] focus-visible:border-secondary focus-visible:ring-2 focus-visible:ring-secondary/20 focus:outline-none transition-colors placeholder:text-sm text-sm",
            hasError && "border-destructive focus:border-destructive"
          )}
          {...register(name as keyof NewPropertyForm)}
        />
        {rightIcon && (
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#FA0000]">
            {rightIcon}
          </div>
        )}
      </div>
      {hasError && (
        <p className="mt-1 text-xs text-destructive">
          {typeof error.message === "string"
            ? error.message
            : String(error.message)}
        </p>
      )}
    </div>
  );
}

function SelectField({
  label,
  name,
  options,
  loading = false,
  disabled = false,
  placeholder,
  required = false,
}: {
  label?: string;
  name: string;
  options: string[];
  loading?: boolean;
  disabled?: boolean;
  placeholder?: string;
  required?: boolean;
}) {
  const {
    control,
    formState: { errors },
  } = useFormContextStrict<NewPropertyForm>();

  // Get nested error path
  const getError = (path: string) => {
    const keys = path.split(".");
    let error = errors;
    for (const key of keys) {
      if (error && typeof error === "object" && key in error) {
        error = (error as Record<string, any>)[key];
      } else {
        return null;
      }
    }
    return typeof error === "object" && error !== null && "message" in error
      ? error
      : null;
  };

  const error = getError(name);
  const hasError = !!error;

  return (
    <div className="w-full">
      <Label className="mb-2 text-[#4F4F4F] flex items-center gap-1 font-semibold">
        {label}
        {required && <CircleAlert className="h-4 w-4 text-[#FA0000]" />}
      </Label>
      <Controller
        control={control}
        name={name as keyof NewPropertyForm}
        render={({ field, fieldState }) => (
          <Select
            onValueChange={field.onChange}
            defaultValue={String(field.value ?? "")}
          >
            <SelectTrigger
              className={cn(
                "w-full rounded-[30px] text-sm bg-[#F4F4F4] ",
                (hasError || fieldState.error) &&
                  "border-destructive focus:border-destructive"
              )}
              disabled={disabled || loading}
            >
              <SelectValue
                placeholder={
                  loading
                    ? "Đang tải..."
                    : disabled
                    ? "Vui lòng chọn mục trước"
                    : placeholder || "Chọn"
                }
              />
            </SelectTrigger>
            <SelectContent className="bg-primary-foreground">
              {options.map((op) => (
                <SelectItem key={op} value={op}>
                  {op}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      {(hasError || error) && (
        <p className="mt-1 text-xs text-destructive">
          {typeof error?.message === "string"
            ? error.message
            : String(error?.message) || "Vui lòng chọn một tùy chọn"}
        </p>
      )}
    </div>
  );
}

// ------------------------------
// Main page
// ------------------------------
// Address selector component
function AddressSelector() {
  const { watch, setValue } = useFormContextStrict<NewPropertyForm>();
  const {
    provinces,
    districts,
    wards,
    loadingProvinces,
    loadingDistricts,
    loadingWards,
    loadDistricts,
    loadWards,
  } = useVietnameseAddress();

  const selectedProvince = watch("province");
  const selectedDistrict = watch("district");

  // Load districts when province changes
  React.useEffect(() => {
    if (selectedProvince) {
      const province = provinces.find((p) => p.name === selectedProvince);
      if (province) {
        loadDistricts(province.code);
        setValue("district", ""); // Reset district
        setValue("ward", ""); // Reset ward
      }
    }
  }, [selectedProvince, provinces, loadDistricts, setValue]);

  // Load wards when district changes
  React.useEffect(() => {
    if (selectedDistrict) {
      const district = districts.find((d) => d.name === selectedDistrict);
      if (district) {
        loadWards(district.code);
        setValue("ward", ""); // Reset ward
      }
    }
  }, [selectedDistrict, districts, loadWards, setValue]);

  return (
    <>
      <SelectField
        name="province"
        options={provinces.map((p) => p.name)}
        loading={loadingProvinces}
        placeholder="Chọn tỉnh, thành phố"
      />
      <SelectField
        name="district"
        options={districts.map((d) => d.name)}
        loading={loadingDistricts}
        disabled={!selectedProvince}
        placeholder="Chọn quận, huyện, thị xã"
      />
      <SelectField
        name="ward"
        options={wards.map((w) => w.name)}
        loading={loadingWards}
        disabled={!selectedDistrict}
        placeholder="Chọn phường, xã, thị trấn"
      />
    </>
  );
}

// Component tối ưu cho field tiền cọc với checkbox (dùng chung cho cả apartment và room types)
function DepositField({ roomIndex }: { roomIndex?: number }) {
  const {
    watch,
    setValue,
    register,
    formState: { errors },
  } = useFormContextStrict<NewPropertyForm>();
  const [isDepositEqualPrice, setIsDepositEqualPrice] = useState(false);

  // Xác định field names dựa trên roomIndex
  const priceFieldName =
    roomIndex !== undefined
      ? (`roomTypes.${roomIndex}.price` as keyof NewPropertyForm)
      : "price";
  const depositFieldName =
    roomIndex !== undefined
      ? (`roomTypes.${roomIndex}.deposit` as keyof NewPropertyForm)
      : "deposit";

  const price = watch(priceFieldName);

  // Khi checkbox thay đổi
  const handleCheckboxChange = (checked: boolean) => {
    setIsDepositEqualPrice(checked);
    if (checked) {
      setValue(depositFieldName, price || 0);
    }
  };

  // Khi giá thuê thay đổi và checkbox được tick
  React.useEffect(() => {
    if (isDepositEqualPrice && price) {
      setValue(depositFieldName, price);
    }
  }, [price, isDepositEqualPrice, setValue, depositFieldName]);

  // Xác định error dựa trên roomIndex
  const fieldError =
    roomIndex !== undefined
      ? errors.roomTypes?.[roomIndex]?.deposit
      : errors.deposit;
  const hasError = !!fieldError;

  // Tạo unique ID cho checkbox
  const checkboxId =
    roomIndex !== undefined
      ? `deposit-equal-price-${roomIndex}`
      : "deposit-equal-price";

  return (
    <div>
      <Label className="mb-2 text-[#4F4F4F] flex items-center gap-1 font-semibold">
        Số tiền cọc
      </Label>
      <div className="space-y-2">
        <div className="relative">
          <Input
            type="number"
            placeholder="VND"
            disabled={isDepositEqualPrice}
            className={cn(
              "w-full rounded-[30px] bg-[#F4F4F4] focus-visible:border-secondary focus-visible:ring-2 focus-visible:ring-secondary/20 focus:outline-none transition-colors placeholder:text-sm text-sm",
              isDepositEqualPrice && "opacity-60 cursor-not-allowed",
              hasError && "border-destructive focus:border-destructive"
            )}
            {...register(depositFieldName)}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id={checkboxId}
            checked={isDepositEqualPrice}
            onCheckedChange={handleCheckboxChange}
          />
          <Label
            htmlFor={checkboxId}
            className="text-sm text-muted-foreground cursor-pointer"
          >
            Tiền cọc bằng giá thuê
          </Label>
        </div>
      </div>

      {hasError && (
        <p className="mt-1 text-xs text-destructive">{fieldError?.message}</p>
      )}
    </div>
  );
}

export default function NewPropertyPage() {
  const methods = useForm<NewPropertyForm>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      kind: "apartment",
      gallery: [],
      floors: [],
      roomTypes: [
        {
          name: "Loại 1",
          bedrooms: 1,
          bathrooms: 1,
          legalDoc: "Sổ hồng",
          area: 20,
          price: 0,
          count: 1,
          deposit: 0,
          locations: [],
          images: [],
        },
      ],
    },
    mode: "onChange",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const onSubmit = async (values: NewPropertyForm) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch("/api/properties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (result.success) {
        alert(result.message || "Đăng tin thành công!");
        // TODO: Redirect to success page or property list
        // router.push("/my-properties");
      } else {
        setSubmitError(result.message || "Có lỗi xảy ra khi đăng tin");
      }
    } catch (error) {
      console.error("Submit error:", error);
      setSubmitError("Có lỗi xảy ra khi đăng tin. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const kind = methods.watch("kind");

  return (
    <div className="min-h-screen bg-[#FFF7E9] p-4">
      <FormProvider {...methods}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-6xl space-y-6 py-8"
        >
          <Stepper step={1} />

          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
            {/* Container chung cho toàn bộ form */}
            <div className="bg-white rounded-xl shadow-lg border border-border/50 overflow-hidden backdrop-blur-sm">
              <div className="space-y-8 p-6">
                {/* Thông tin chung + Hình ảnh đính kèm */}
                <div className="grid gap-6 lg:grid-cols-3">
                  {/* Thông tin chung */}
                  <div className="space-y-4 lg:col-span-2">
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className="h-6 w-6 bg-primary rounded-full flex items-center justify-center">
                        <Info className="w-3 h-3 text-white" />
                      </div>
                      <p className="font-bold text-primary">Thông tin chung</p>
                    </div>
                    <div className="mb-6">
                      <Field
                        label="Tên bất động sản"
                        required={true}
                        name="title"
                        placeholder="Nhập tiêu đề"
                      />
                    </div>
                    <div>
                      <Label className="mb-3 flex items-center gap-1">
                        Danh mục bất động sản
                      </Label>
                      <RadioGroup
                        value={kind}
                        onValueChange={(v) =>
                          methods.setValue("kind", v as any)
                        }
                        className="flex gap-8"
                      >
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="apartment" id="kind-apart" />
                          <Label
                            htmlFor="kind-apart"
                            className="text-[#4F4F4F]"
                          >
                            Căn hộ/Chung cư
                          </Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="boarding" id="kind-board" />
                          <Label
                            htmlFor="kind-board"
                            className="text-[#4F4F4F]"
                          >
                            Phòng trọ
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <Label className="mb-2 text-[#4F4F4F] flex items-center gap-1 font-semibold">
                      Địa chỉ
                      <CircleAlert className="h-4 w-4 text-[#FA0000]" />
                    </Label>
                    <div className="grid gap-3 md:grid-cols-2">
                      <AddressSelector />
                      <Field
                        name="street"
                        placeholder="Ví dụ: 123 Nguyễn Huệ"
                      />
                    </div>

                    {kind === "apartment" ? (
                      <>
                        <Label className="mb-2 text-[#4F4F4F] flex items-center gap-1 font-semibold">
                          Vị trí
                          <CircleAlert className="h-4 w-4 text-[#FA0000]" />
                        </Label>
                        <div className="grid gap-3 md:grid-cols-3">
                          <Field name="unit" placeholder="Mã căn" />
                          <Field name="block" placeholder="Block/tháp" />
                          <Field name="floor" placeholder="Tầng số" />
                        </div>
                      </>
                    ) : (
                      <BoardingStructure />
                    )}

                    <div>
                      <Label className="text-[#4F4F4F] font-semibold text-sm mb-3">
                        Mô tả chi tiết
                      </Label>
                      <Textarea
                        rows={5}
                        placeholder="Nhập mô tả chi tiết về bất động sản..."
                        {...methods.register("description")}
                        className={cn(
                          "w-full bg-[#F4F4F4] focus-visible:border-secondary focus-visible:ring-2 focus-visible:ring-secondary/20 focus:outline-none transition-colors placeholder:text-sm text-sm",
                          methods.formState.errors.description &&
                            "border-destructive focus:border-destructive"
                        )}
                      />
                      <div className="mt-1 flex justify-between">
                        <div>
                          {methods.formState.errors.description && (
                            <p className="text-xs text-destructive">
                              {methods.formState.errors.description.message}
                            </p>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {methods.watch("description")?.length || 0}/1500
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hình ảnh đính kèm */}
                  <div className="space-y-4 lg:col-span-1">
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className="h-6 w-6 bg-primary rounded-full flex items-center justify-center">
                        <Info className="w-3 h-3 text-white" />
                      </div>
                      <p className="font-bold text-primary">
                        Hình ảnh đính kèm
                      </p>
                    </div>
                    <ImageDrop
                      label="Tải lên ảnh Bất động sản (850 × 450)"
                      onPick={(src) => methods.setValue("heroImage", src)}
                      onError={setUploadError}
                    />
                    <div className="grid grid-cols-3 gap-3">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <DottedBox
                          key={i}
                          className="aspect-video flex items-center justify-center bg-muted/30 border-accent"
                        >
                          <ImageIcon className="h-5 w-5 text-accent" />
                        </DottedBox>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Divider */}
                <hr className="border-border" />
                {/* Thông tin chi tiết + Diện tích & Giá */}
                {kind === "apartment" ? (
                  <div className="grid gap-6 lg:grid-cols-3">
                    {/* Thông tin chi tiết */}
                    <div className="space-y-4 lg:col-span-2">
                      <div className="flex items-center gap-2.5 mb-2">
                        <div className="h-6 w-6 bg-primary rounded-full flex items-center justify-center">
                          <Info className="w-3 h-3 text-white" />
                        </div>
                        <p className="font-bold text-primary">
                          Thông tin chi tiết
                        </p>
                      </div>
                      <div className="grid gap-3 md:grid-cols-2">
                        <Field
                          label="Số phòng ngủ"
                          name="bedrooms"
                          type="number"
                          placeholder="0"
                          required={true}
                        />
                        <Field
                          label="Số phòng vệ sinh"
                          name="bathrooms"
                          type="number"
                          placeholder="0"
                          required={true}
                        />
                        <SelectField
                          label="Tình trạng nội thất"
                          name="furnishing"
                          options={["Đầy đủ", "Cơ bản", "Trống"]}
                          placeholder="Chọn tình trạng nội thất"
                          required={true}
                        />
                        <SelectField
                          label="Giấy tờ pháp lý"
                          name="legalDoc"
                          options={["Sổ hồng", "HĐMB", "Khác"]}
                          placeholder="Chọn loại giấy tờ"
                          required={true}
                        />
                      </div>
                    </div>

                    {/* Diện tích & Giá */}
                    <div className="space-y-4 lg:col-span-1">
                      <div className="flex items-center gap-2.5 mb-2">
                        <div className="h-6 w-6 bg-primary rounded-full flex items-center justify-center">
                          <Info className="w-3 h-3 text-white" />
                        </div>
                        <p className="font-bold text-primary">
                          Diện tích & Giá
                        </p>
                      </div>
                      <div className="space-y-3">
                        <Field
                          label="Diện tích"
                          name="area"
                          type="number"
                          placeholder="m²"
                          required={true}
                        />
                        <Field
                          label="Giá thuê"
                          name="price"
                          type="number"
                          placeholder="VND"
                          required={true}
                        />
                        <DepositField />
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Phòng trọ - chỉ hiển thị form phòng trọ */
                  <div className="space-y-6">
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className="h-6 w-6 bg-primary rounded-full flex items-center justify-center">
                        <Info className="w-3 h-3 text-white" />
                      </div>
                      <p className="font-bold text-primary">
                        Thông tin chi tiết
                      </p>
                    </div>
                    <RoomTypes />
                  </div>
                )}
              </div>

              {/* Footer với error messages và action buttons */}
              <div className="px-6 py-4 border-t border-border bg-muted/10 space-y-4">
                {/* Error messages */}
                {submitError && (
                  <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                    {submitError}
                  </div>
                )}

                {uploadError && (
                  <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                    {uploadError}
                    <button
                      type="button"
                      onClick={() => setUploadError(null)}
                      className="ml-2 underline"
                    >
                      Đóng
                    </button>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex items-center justify-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isSubmitting}
                    className="rounded-[8px] bg-[#e5e5e5] border-0 hover:bg-[#b1b1b1] text-[#4f4f4f]"
                  >
                    <X className="h-4 w-4" />
                    Hủy
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-[8px] bg-accent border-0 hover:bg-[#e59400] text-primary-foreground"
                  >
                    <Play className="h-4 w-4" />
                    {isSubmitting ? "Đang xử lý..." : "Tiếp theo"}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </motion.div>
      </FormProvider>
    </div>
  );
}
