/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { CircleAlert, ImageIcon, Info, Play, X } from "lucide-react";

// Import Property Service
import { propertyService } from "@/lib/api";
import type { PropertyCreateRequest, PropertyRoom } from "@/lib/api/types";
import { PropertyTypeEnum } from "@/lib/api/types";

import { DottedBox } from "@/components/property-form/DottedBox";
import { ImageDrop } from "@/components/property-form/ImageDrop";
import { Stepper } from "@/components/property-form/Stepper";
import { BoardingStructure } from "@/components/property-form/boarding/BoardingStructure";
import { RoomTypes } from "@/components/property-form/boarding/RoomTypes";
import { AddressSelector } from "@/components/property-form/form/AddressSelector";
import { DepositField } from "@/components/property-form/form/DepositField";
import { Field } from "@/components/property-form/form/Field";
import { SelectField } from "@/components/property-form/form/SelectField";
import { FormSchema, NewPropertyForm } from "@/schema/schema";
import { toast } from "@/hooks/use-toast";

export default function NewPropertyPage() {
  const router = useRouter();
  const methods = useForm<NewPropertyForm>({
    resolver: zodResolver(FormSchema) as any,
    defaultValues: {
      kind: "APARTMENT",
      gallery: [],
      floors: [],
      electricityPrice: 0,
      waterPrice: 0,
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

  // Helper function to convert base64/URL string to File object
  const dataURLtoFile = async (
    dataurl: string,
    filename: string
  ): Promise<File | null> => {
    try {
      // If it's already a blob URL or http URL, fetch it
      if (dataurl.startsWith("blob:") || dataurl.startsWith("http")) {
        const res = await fetch(dataurl);
        const blob = await res.blob();
        return new File([blob], filename, { type: blob.type || "image/jpeg" });
      }

      // If it's base64
      if (dataurl.startsWith("data:")) {
        const arr = dataurl.split(",");
        const mimeMatch = arr[0].match(/:(.*?);/);
        const mime = mimeMatch ? mimeMatch[1] : "image/jpeg";
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
      }

      return null;
    } catch (error) {
      console.error("Error converting data URL to File:", error);
      return null;
    }
  };

  // Helper function to safely convert to number
  const toSafeNumber = (value: any): number => {
    if (value === null || value === undefined || value === "") {
      return 0;
    }
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  };

  // Convert form data to API format
  const convertFormToApiData = (
    formData: NewPropertyForm
  ): PropertyCreateRequest => {
    // Base data common for both types (including legalDoc from common section)
    const baseData: PropertyCreateRequest = {
      title: formData.title.trim(),
      description: formData.description?.trim() || undefined,
      type:
        formData.kind === "APARTMENT"
          ? PropertyTypeEnum.APARTMENT
          : PropertyTypeEnum.BOARDING,
      province: formData.province,
      ward: formData.ward,
      address: formData.street.trim(),
      legalDoc: formData.legalDoc || undefined,
      isVisible: true,
    };

    // For apartment - add apartment-specific fields
    if (formData.kind === "APARTMENT") {
      return {
        ...baseData,
        unit: formData.unit?.trim() || undefined,
        block: formData.block?.trim() || undefined,
        floor: formData.floor ? Number(formData.floor) : undefined,
        bedrooms: toSafeNumber(formData.bedrooms),
        bathrooms: toSafeNumber(formData.bathrooms),
        area: toSafeNumber(formData.area),
        price: toSafeNumber(formData.price),
        deposit: toSafeNumber(formData.deposit),
        furnishing: formData.furnishing || "Cơ bản",
      } as PropertyCreateRequest;
    }

    // For boarding house - add boarding-specific fields
    if (formData.kind === "BOARDING") {
      // Convert floors structure to rooms array
      const allRooms =
        formData.floors?.flatMap((floor, floorIndex) =>
          floor.rooms.map((roomName) => ({
            name: roomName.trim(),
            floor: floorIndex + 1, // Use array index as floor number
          }))
        ) || [];

      // Convert roomTypes to API format with rooms nested inside
      const roomTypes =
        formData.roomTypes
          ?.filter((roomType) => roomType.name.trim()) // Only include non-empty room types
          .map((roomType, index) => {
            // Distribute rooms among room types based on their locations
            const roomsForThisType =
              roomType.locations
                ?.map((locationName) =>
                  allRooms.find((room) => room.name === locationName)
                )
                .filter((room): room is PropertyRoom => Boolean(room)) || [];

            // If no specific locations, assign some rooms to this room type
            const assignedRooms =
              roomsForThisType.length > 0
                ? roomsForThisType
                : allRooms.slice(
                    index *
                      Math.ceil(allRooms.length / formData.roomTypes!.length),
                    (index + 1) *
                      Math.ceil(allRooms.length / formData.roomTypes!.length)
                  );

            return {
              name: roomType.name.trim(),
              description: `Phòng ${roomType.name} - Diện tích ${roomType.area}m² - ${roomType.bedrooms} phòng ngủ, ${roomType.bathrooms} phòng tắm`,
              bedrooms: toSafeNumber(roomType.bedrooms),
              bathrooms: toSafeNumber(roomType.bathrooms),
              area: toSafeNumber(roomType.area),
              price: toSafeNumber(roomType.price),
              deposit: toSafeNumber(roomType.deposit),
              furnishing: "Cơ bản", // Default furnishing
              heroImage: undefined,
              images: [],
              rooms: assignedRooms, // Rooms nested inside roomType
            };
          }) || [];

      return {
        ...baseData,
        electricityPricePerKwh: toSafeNumber(formData.electricityPrice),
        waterPricePerM3: toSafeNumber(formData.waterPrice),
        unit: formData.unit?.trim() || undefined, // Add unit for boarding
        roomTypes: roomTypes.length > 0 ? roomTypes : undefined,
      };
    }

    return baseData;
  };

  const onSubmit = async (values: NewPropertyForm) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Convert form data to API format
      const apiData = convertFormToApiData(values);

      // Call Property Service API
      const response = await propertyService.createProperty(apiData);

      // Check if response is successful
      if (response && (response.code === 200 || response.code === 201)) {
        const createdProperty = response.data;

        // Upload images after property creation
        try {
          if (values.kind === "APARTMENT" && createdProperty?.id) {
            // For APARTMENT: upload to property.id
            const heroImageUrl = values.gallery?.[0];
            const imageUrls = values.gallery?.slice(1) || [];

            if (heroImageUrl || imageUrls.length > 0) {
              // Convert URLs/base64 to File objects
              const heroImageFile = heroImageUrl
                ? await dataURLtoFile(heroImageUrl, `hero-${Date.now()}.jpg`)
                : undefined;
              const imageFiles = await Promise.all(
                imageUrls.map((url, index) =>
                  dataURLtoFile(url, `image-${index}-${Date.now()}.jpg`)
                )
              );
              const validImageFiles = imageFiles.filter(
                (f): f is File => f !== null
              );

              await propertyService.uploadPropertyImages(
                createdProperty.id,
                "APARTMENT",
                heroImageFile || undefined,
                validImageFiles
              );
            }
          } else if (values.kind === "BOARDING" && createdProperty?.rooms) {
            // For BOARDING: backend returns rooms array with nested roomType
            // Extract unique roomTypes from rooms
            const uniqueRoomTypes = new Map<
              string,
              { id: string; name: string }
            >();
            createdProperty.rooms.forEach((room: any) => {
              if (room.roomType?.id && !uniqueRoomTypes.has(room.roomType.id)) {
                uniqueRoomTypes.set(room.roomType.id, {
                  id: room.roomType.id,
                  name: room.roomType.name,
                });
              }
            });

            // Upload images for each unique roomType
            let roomTypeIndex = 0;
            for (const [roomTypeId] of uniqueRoomTypes) {
              const formRoomType = values.roomTypes?.[roomTypeIndex];

              if (formRoomType?.images && formRoomType.images.length > 0) {
                const heroImageUrl = formRoomType.images[0];
                const imageUrls = formRoomType.images.slice(1);

                // Convert URLs/base64 to File objects
                const heroImageFile = heroImageUrl
                  ? await dataURLtoFile(
                      heroImageUrl,
                      `room-${roomTypeIndex}-hero-${Date.now()}.jpg`
                    )
                  : undefined;
                const imageFiles = await Promise.all(
                  imageUrls.map((url, index) =>
                    dataURLtoFile(
                      url,
                      `room-${roomTypeIndex}-image-${index}-${Date.now()}.jpg`
                    )
                  )
                );
                const validImageFiles = imageFiles.filter(
                  (f): f is File => f !== null
                );

                await propertyService.uploadPropertyImages(
                  roomTypeId,
                  "BOARDING",
                  heroImageFile || undefined,
                  validImageFiles
                );
              }
              roomTypeIndex++;
            }
          }
        } catch {
          // Don't fail the whole process if image upload fails
          // Just show a warning
          toast.warning(
            "Lỗi tải ảnh",
            "Bất động sản đã được tạo thành công, nhưng có lỗi khi tải ảnh lên. Bạn có thể tải ảnh lên sau."
          );
        }

        const successMessage = response.message || "Đăng tin thành công!";

        // Show success confirmation with toast
        toast.confirm(
          successMessage,
          "Bạn có muốn xem danh sách bất động sản của mình không?",
          () => {
            router.push("/my-properties");
          },
          () => {
            // Reset form for creating another property
            methods.reset();
          }
        );
      } else {
        const errorMessage = response?.message || "Có lỗi xảy ra khi đăng tin";
        setSubmitError(errorMessage);
      }
    } catch (error: any) {
      let errorMessage = "Có lỗi xảy ra khi đăng tin. Vui lòng thử lại.";
      if (error?.response) {
        const status = error.response.status;
        const data = error.response.data;
        if (status === 400) {
          errorMessage = data?.message || "Dữ liệu gửi lên không hợp lệ";
        } else if (status === 401) {
          errorMessage = "Bạn cần đăng nhập để thực hiện chức năng này";
        } else if (status === 403) {
          errorMessage = "Bạn không có quyền thực hiện chức năng này";
        } else if (status === 422) {
          errorMessage = data?.message || "Dữ liệu không đúng định dạng";
        } else if (status === 500) {
          errorMessage = "Lỗi server. Vui lòng thử lại sau";
        } else {
          errorMessage = data?.message || `Lỗi HTTP ${status}`;
        }
      } else if (error?.request) {
        errorMessage =
          "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng";
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      setSubmitError(errorMessage);
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

          <form
            onSubmit={methods.handleSubmit(onSubmit as any, (errors) => {
              console.log("=== VALIDATION ERRORS ===");
              console.log("Validation failed with errors:", errors);
              console.log("Form values at error:", methods.getValues());
            })}
            className="space-y-6"
          >
            <div className="bg-primary-foreground rounded-xl shadow-lg border border-border/50 overflow-hidden backdrop-blur-sm">
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
                        required
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
                          <RadioGroupItem value="APARTMENT" id="kind-apart" />
                          <Label
                            htmlFor="kind-apart"
                            className="text-[#4F4F4F]"
                          >
                            Nhà ở/Chung cư
                          </Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="BOARDING" id="kind-board" />
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
                      <SelectField
                        name="legalDoc"
                        options={["Sổ hồng", "HĐMB", "Khác"]}
                        placeholder="Giấy tờ pháp lý"
                      />
                    </div>
                    {kind === "APARTMENT" ? (
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
                      <>
                        <BoardingStructure />
                        <div className="grid gap-3 md:grid-cols-2">
                          <Field
                            label="Giá điện"
                            name="electricityPrice"
                            type="number"
                            placeholder="VND/kWh"
                            required
                          />
                          <Field
                            label="Giá nước"
                            name="waterPrice"
                            type="number"
                            placeholder="VND/m³"
                            required
                          />
                        </div>
                      </>
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
                              {
                                methods.formState.errors.description
                                  .message as any
                              }
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
                        Hình ảnh đính kèm (Tối đa 6 ảnh)
                      </p>
                    </div>

                    {/* Hero Image Upload */}
                    {!methods.watch("gallery")?.[0] && (
                      <ImageDrop
                        label="Tải lên ảnh Bất động sản (850 × 450)"
                        onPick={(src) => {
                          const currentGallery =
                            methods.getValues("gallery") || [];
                          methods.setValue("gallery", [src, ...currentGallery]);
                        }}
                        onError={setUploadError}
                      />
                    )}

                    {/* Gallery Display */}
                    <div className="grid grid-cols-3 gap-3">
                      {/* Display selected images */}
                      {methods.watch("gallery")?.map((imgSrc, i) => (
                        <div key={i} className="relative aspect-video group">
                          <Image
                            src={imgSrc}
                            alt={`Ảnh ${i + 1}`}
                            fill
                            className="object-cover rounded-lg border-2 border-accent"
                            unoptimized
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const currentGallery =
                                methods.getValues("gallery") || [];
                              methods.setValue(
                                "gallery",
                                currentGallery.filter((_, index) => index !== i)
                              );
                            }}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4" />
                          </button>
                          {i === 0 && (
                            <div className="absolute bottom-1 left-1 bg-primary text-white text-xs px-2 py-0.5 rounded">
                              Ảnh chính
                            </div>
                          )}
                        </div>
                      ))}

                      {/* Empty slots for additional images */}
                      {Array.from({
                        length: Math.max(
                          0,
                          6 - (methods.watch("gallery")?.length || 0)
                        ),
                      }).map((_, i) => (
                        <DottedBox
                          key={`empty-${i}`}
                          className="aspect-video flex items-center justify-center bg-muted/30 border-accent cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => {
                            const input = document.createElement("input");
                            input.type = "file";
                            input.accept =
                              "image/jpeg,image/jpg,image/png,image/webp";
                            input.onchange = async (e) => {
                              const file = (e.target as HTMLInputElement)
                                .files?.[0];
                              if (!file) return;

                              // Validate
                              if (
                                ![
                                  "image/jpeg",
                                  "image/jpg",
                                  "image/png",
                                  "image/webp",
                                ].includes(file.type)
                              ) {
                                setUploadError(
                                  "Chỉ chấp nhận file ảnh định dạng JPEG, PNG, WEBP"
                                );
                                return;
                              }
                              if (file.size > 5 * 1024 * 1024) {
                                setUploadError(
                                  "Kích thước ảnh không được vượt quá 5MB"
                                );
                                return;
                              }

                              // Convert to base64
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                const currentGallery =
                                  methods.getValues("gallery") || [];
                                methods.setValue("gallery", [
                                  ...currentGallery,
                                  reader.result as string,
                                ]);
                              };
                              reader.readAsDataURL(file);
                            };
                            input.click();
                          }}
                        >
                          <div className="flex flex-col items-center gap-1">
                            <ImageIcon className="h-5 w-5 text-accent" />
                            <span className="text-xs text-muted-foreground">
                              Thêm ảnh
                            </span>
                          </div>
                        </DottedBox>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <hr className="border-border" />

                {/* Thông tin chi tiết + Diện tích & Giá */}
                {kind === "APARTMENT" ? (
                  <div className="grid gap-6 lg:grid-cols-3">
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
                          required
                        />
                        <Field
                          label="Số phòng vệ sinh"
                          name="bathrooms"
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
                      </div>
                    </div>

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
                          required
                        />
                        <Field
                          label="Giá thuê"
                          name="price"
                          type="number"
                          placeholder="VND"
                          required
                        />
                        <DepositField />
                      </div>
                    </div>
                  </div>
                ) : (
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

              {/* Footer */}
              <div className="px-6 py-4 border-t border-border bg-muted/10 space-y-4">
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

                <div className="flex items-center justify-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isSubmitting}
                    onClick={() => router.back()}
                    className="rounded-[8px] bg-[#e5e5e5] border-0 hover:bg-[#b1b1b1] text-[#4f4f4f]"
                  >
                    <X className="h-4 w-4" />
                    Hủy
                  </Button>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-[8px] bg-accent border-0 hover:bg-[#e59400] text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Play className="h-4 w-4" />
                    {isSubmitting
                      ? "Đang tạo bất động sản..."
                      : "Tạo bất động sản"}
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
