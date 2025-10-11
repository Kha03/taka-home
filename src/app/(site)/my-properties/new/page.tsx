/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { CircleAlert, ImageIcon, Info, Play, X } from "lucide-react";

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

export default function NewPropertyPage() {
  const methods = useForm<NewPropertyForm>({
    resolver: zodResolver(FormSchema) as any,
    defaultValues: {
      kind: "apartment",
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

  const onSubmit = async (values: NewPropertyForm) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const response = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result = await response.json();
      if (result.success) {
        alert(result.message || "Đăng tin thành công!");
        // TODO: router.push("/my-properties");
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

          <form
            onSubmit={methods.handleSubmit(onSubmit as any)}
            className="space-y-6"
          >
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
                        <SelectField
                          label="Giấy tờ pháp lý"
                          name="legalDoc"
                          options={["Sổ hồng", "HĐMB", "Khác"]}
                          placeholder="Chọn loại giấy tờ"
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
