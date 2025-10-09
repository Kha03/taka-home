"use client";

import React, { useState } from "react";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
} from "lucide-react";
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

// Generate a dotted border card for uploads
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
    <DottedBox className="flex h-40 w-full items-center justify-center bg-muted/30">
      <input
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
        id={`image-upload-${Date.now()}`}
        disabled={isUploading}
      />
      <label
        htmlFor={`image-upload-${Date.now()}`}
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
                step === it.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-background"
              }`}
            >
              {it.id}
            </div>
            <span className="text-sm text-muted-foreground">{it.label}</span>
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
function BoardingStructure() {
  const { control } = useFormContextStrict<NewPropertyForm>();
  const { fields, append, remove } = useFieldArray({ control, name: "floors" });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold">Cơ cấu Bất động sản</Label>
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            append({ name: `Tầng ${fields.length + 1}`, rooms: [] })
          }
        >
          <Plus className="mr-1 h-4 w-4" /> Thêm tầng
        </Button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {fields.map((f, i) => (
          <Card key={f.id} className="overflow-hidden">
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm">{f.name}</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => remove(i)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              <TagEditor index={i} />
            </CardContent>
          </Card>
        ))}
        {fields.length === 0 && (
          <DottedBox className="sm:col-span-2">
            <p className="text-sm text-muted-foreground">
              Chưa có tầng. Nhấn "Thêm tầng" để bắt đầu, ví dụ: Tầng trệt với
              các phòng A101, A102, ...
            </p>
          </DottedBox>
        )}
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
      <div className="flex flex-wrap gap-2">
        {rooms.map((r, i) => (
          <span key={i} className="rounded-full bg-muted px-3 py-1 text-xs">
            {r}
            <button
              className="ml-2 text-muted-foreground"
              type="button"
              onClick={() => removeRoom(i)}
            >
              ×
            </button>
          </span>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={addRoom}>
          <Plus className="mr-1 h-4 w-4" /> Thêm phòng
        </Button>
      </div>
      <input type="hidden" {...register(roomsPath as any)} />
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
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold">Phân loại phòng</Label>
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            append({
              name: `Loại ${fields.length + 1}`,
              bedrooms: 1,
              bathrooms: 1,
              area: 20,
              price: 0,
              count: 1,
              deposit: 0,
              locations: [],
              images: [],
            })
          }
        >
          <Plus className="mr-1 h-4 w-4" /> Thêm loại phòng
        </Button>
      </div>

      <div className="space-y-4">
        {fields.map((f, idx) => (
          <Card key={f.id}>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-semibold">{`Phòng loại ${
                idx + 1
              }`}</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => remove(idx)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-3">
              <Field
                label="Số phòng ngủ (*)"
                name={`roomTypes.${idx}.bedrooms`}
                type="number"
                placeholder="0"
              />
              <Field
                label="Số phòng vệ sinh (*)"
                name={`roomTypes.${idx}.bathrooms`}
                type="number"
                placeholder="0"
              />
              <SelectField
                label="Giấy tờ pháp lý (*)"
                name={`roomTypes.${idx}.legalDoc`}
                options={["Sổ hồng", "HĐMB", "Khác"]}
                placeholder="Chọn loại giấy tờ"
              />
              <Field
                label="Diện tích (*)"
                name={`roomTypes.${idx}.area`}
                type="number"
                rightIcon={<Ruler className="h-4 w-4" />}
                placeholder="m²"
              />
              <Field
                label="Giá thuê (*)"
                name={`roomTypes.${idx}.price`}
                type="number"
                placeholder="VND"
              />
              <Field
                label="Số tiền cọc"
                name={`roomTypes.${idx}.deposit`}
                type="number"
                placeholder="VND"
              />
              <Field
                label="Số lượng (*)"
                name={`roomTypes.${idx}.count`}
                type="number"
                placeholder="1"
              />
              <div className="md:col-span-2">
                <Label className="mb-2 block">
                  Vị trí phòng loại {idx + 1}
                </Label>
                <DottedBox>
                  <p className="text-sm text-muted-foreground">
                    Chọn các phòng thuộc loại này bằng logic của bạn sau này
                    (map từ "Cơ cấu BĐS").
                  </p>
                </DottedBox>
              </div>
              <div className="md:col-span-3">
                <Label className="mb-2 block">Ảnh</Label>
                <div className="grid grid-cols-4 gap-3">
                  <ImageDrop
                    label="Tải ảnh"
                    onPick={(src) => console.log("Picked", src)}
                  />
                  <div className="col-span-3 flex items-center justify-center text-sm text-muted-foreground">
                    Tối đa 8 ảnh/loại phòng
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ------------------------------
// Field abstractions
// ------------------------------
import { Controller, useFormContext } from "react-hook-form";
function useFormContextStrict<T>() {
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
    return error?.message ? error : null;
  };

  const error = getError(name);
  const hasError = !!error;

  return (
    <div className="mb-6">
      <Label className="mb-2 text-[#4F4F4F] flex items-center gap-1">
        {label}
        {required && <CircleAlert className="h-4 w-4 text-[#FA0000]" />}
      </Label>
      <div className="relative">
        <Input
          type={type}
          placeholder={placeholder}
          className={
            "w-full rounded-[30px] " +
            "bg-[#F4F4F4]" +
            "focus-visible:border-secondary focus-visible:ring-2 focus-visible:ring-secondary/20 " +
            "focus:outline-none transition-colors" +
            "placeholder:text-sm placeholder:text-primary" +
            "text-sm text-primary" +
            (hasError ? "border-destructive focus:border-destructive" : "")
          }
          {...register(name as keyof NewPropertyForm)}
        />
        {rightIcon && (
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#FA0000]">
            {rightIcon}
          </div>
        )}
      </div>
      {hasError && (
        <p className="mt-1 text-xs text-destructive">{error.message}</p>
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
}: {
  label?: string;
  name: string;
  options: string[];
  loading?: boolean;
  disabled?: boolean;
  placeholder?: string;
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
    return error?.message ? error : null;
  };

  const error = getError(name);
  const hasError = !!error;

  return (
    <div className="w-full">
      <Label className="mb-2 block">{label}</Label>
      <Controller
        control={control}
        name={name as keyof NewPropertyForm}
        render={({ field, fieldState }) => (
          <Select
            onValueChange={field.onChange}
            defaultValue={String(field.value ?? "")}
          >
            <SelectTrigger
              className={`w-full rounded-[30px] ${
                hasError || fieldState.error
                  ? "border-destructive focus:border-destructive"
                  : ""
              }`}
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
          {error?.message || "Vui lòng chọn một tùy chọn"}
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
  const { control, watch, setValue } = useFormContextStrict<NewPropertyForm>();
  const addressHook = useVietnameseAddress();

  const selectedProvince = watch("province");
  const selectedDistrict = watch("district");

  // Load districts when province changes
  React.useEffect(() => {
    if (selectedProvince) {
      const province = addressHook.provinces.find(
        (p) => p.name === selectedProvince
      );
      if (province) {
        addressHook.loadDistricts(province.code);
        setValue("district", ""); // Reset district
        setValue("ward", ""); // Reset ward
      }
    }
  }, [selectedProvince, addressHook, setValue]);

  // Load wards when district changes
  React.useEffect(() => {
    if (selectedDistrict) {
      const district = addressHook.districts.find(
        (d) => d.name === selectedDistrict
      );
      if (district) {
        addressHook.loadWards(district.code);
        setValue("ward", ""); // Reset ward
      }
    }
  }, [selectedDistrict, addressHook, setValue]);

  return (
    <>
      <SelectField
        name="province"
        options={addressHook.provinces.map((p) => p.name)}
        loading={addressHook.loadingProvinces}
        placeholder="Chọn tỉnh, thành phố"
      />
      <SelectField
        name="district"
        options={addressHook.districts.map((d) => d.name)}
        loading={addressHook.loadingDistricts}
        disabled={!selectedProvince}
        placeholder="Chọn quận, huyện, thị xã"
      />
      <SelectField
        name="ward"
        options={addressHook.wards.map((w) => w.name)}
        loading={addressHook.loadingWards}
        disabled={!selectedDistrict}
        placeholder="Chọn phường, xã, thị trấn"
      />
    </>
  );
}

export default function NewPropertyPage() {
  const methods = useForm<NewPropertyForm>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      kind: "apartment",
      gallery: [],
      floors: [],
      roomTypes: [],
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
                <div className="grid gap-6 lg:grid-cols-2">
                  {/* Thông tin chung */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className="h-6 w-6 bg-primary rounded-full flex items-center justify-center">
                        <Info className="w-3 h-3 text-white" />
                      </div>
                      <p className="font-bold text-primary">Thông tin chung</p>
                    </div>
                    <Field
                      label="Tên bất động sản"
                      required={true}
                      name="title"
                      placeholder="Nhập tiêu đề"
                    />
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

                    <div className="grid gap-3 md:grid-cols-2">
                      <AddressSelector />
                      <Field
                        name="street"
                        placeholder="Ví dụ: 123 Nguyễn Huệ"
                      />
                    </div>

                    {kind === "apartment" ? (
                      <div className="grid gap-3 md:grid-cols-3">
                        <Field
                          label="Mã căn"
                          name="unit"
                          placeholder="A-12.05"
                        />
                        <Field
                          label="Block/Tháp"
                          name="block"
                          placeholder="Block B"
                        />
                        <Field label="Tầng số" name="floor" placeholder="12" />
                      </div>
                    ) : (
                      <BoardingStructure />
                    )}

                    <div>
                      <Label className="mb-2 block">Mô tả chi tiết</Label>
                      <Textarea
                        rows={5}
                        placeholder="Nhập mô tả chi tiết về bất động sản..."
                        {...methods.register("description")}
                        className={
                          methods.formState.errors.description
                            ? "border-destructive focus:border-destructive"
                            : ""
                        }
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
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-1.5 w-10 bg-gradient-to-r from-primary to-primary/60 rounded-full"></div>
                      <h3 className="font-semibold text-base text-foreground">
                        Hình ảnh đính kèm
                      </h3>
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
                          className="aspect-video flex items-center justify-center bg-muted/30"
                        >
                          <ImageIcon className="h-5 w-5 text-muted-foreground" />
                        </DottedBox>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Divider */}
                <hr className="border-border" />

                {/* Thông tin chi tiết + Diện tích & Giá */}
                {kind === "apartment" ? (
                  <div className="grid gap-6 lg:grid-cols-2">
                    {/* Thông tin chi tiết */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="h-1.5 w-10 bg-gradient-to-r from-primary to-primary/60 rounded-full"></div>
                        <h3 className="font-semibold text-base text-foreground">
                          Thông tin chi tiết
                        </h3>
                      </div>
                      <div className="grid gap-3 md:grid-cols-2">
                        <Field
                          label="Số phòng ngủ (*)"
                          name="bedrooms"
                          type="number"
                          placeholder="0"
                        />
                        <Field
                          label="Số phòng vệ sinh (*)"
                          name="bathrooms"
                          type="number"
                          placeholder="0"
                        />
                        <SelectField
                          label="Tình trạng nội thất (*)"
                          name="furnishing"
                          options={["Đầy đủ", "Cơ bản", "Trống"]}
                          placeholder="Chọn tình trạng nội thất"
                        />
                        <SelectField
                          label="Giấy tờ pháp lý (*)"
                          name="legalDoc"
                          options={["Sổ hồng", "HĐMB", "Khác"]}
                          placeholder="Chọn loại giấy tờ"
                        />
                      </div>
                    </div>

                    {/* Diện tích & Giá */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="h-1.5 w-10 bg-gradient-to-r from-primary to-primary/60 rounded-full"></div>
                        <h3 className="font-semibold text-base text-foreground">
                          Diện tích & Giá
                        </h3>
                      </div>
                      <div className="space-y-3">
                        <Field
                          label="Diện tích (*)"
                          name="area"
                          type="number"
                          rightIcon={<Ruler className="h-4 w-4" />}
                          placeholder="m²"
                        />
                        <Field
                          label="Giá thuê (*)"
                          name="price"
                          type="number"
                          placeholder="VND"
                        />
                        <Field
                          label="Số tiền cọc"
                          name="deposit"
                          type="number"
                          placeholder="VND"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Phòng trọ - chỉ hiển thị form phòng trọ */
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-1.5 w-10 bg-gradient-to-r from-primary to-primary/60 rounded-full"></div>
                      <h3 className="font-semibold text-base text-foreground">
                        Thông tin chi tiết phòng trọ
                      </h3>
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
                <div className="flex items-center justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isSubmitting}
                  >
                    Hủy
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
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
