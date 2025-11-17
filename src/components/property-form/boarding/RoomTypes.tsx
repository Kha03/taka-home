"use client";

import React from "react";
import { useFieldArray } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Info, Trash2, ImageIcon, Plus, X } from "lucide-react";
import Image from "next/image";
import { Field } from "../form/Field";
import { SelectField } from "../form/SelectField";
import { DepositField } from "../form/DepositField";
import { ImageDrop } from "../ImageDrop";
import { DottedBox } from "../DottedBox";
import { RoomSelector } from "./RoomSelector";
import { NewPropertyForm } from "@/schema/schema";
import { useFormContextStrict } from "../form/useFormContextStrict";

export function RoomTypes() {
  const t = useTranslations("myProperties");
  const tProperty = useTranslations("property");
  const { control, setValue, watch, getValues } =
    useFormContextStrict<NewPropertyForm>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "roomTypes",
  });

  const [uploadError, setUploadError] = React.useState<string | null>(null);

  return (
    <div className="space-y-3 mt-5">
      <div className="space-y-6">
        {fields.map((f, idx) => (
          <div key={f.id} className="relative mb-8">
            <Card className="bg-primary-foreground border-2 border-dashed shadow-none pt-8">
              <div className="absolute -top-3 left-4 bg-accent px-2 py-1 rounded-[30px]">
                <CardTitle className="text-sm text-primary-foreground font-semibold">{`${t(
                  "roomType"
                )} ${idx + 1}`}</CardTitle>
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
                {/* Thông tin chi tiết */}
                <div className="space-y-4 lg:col-span-2">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="h-6 w-6 bg-primary rounded-full flex items-center justify-center">
                      <Info className="w-3 h-3 text-white" />
                    </div>
                    <p className="font-bold text-primary">
                      {t("detailedInfo")}
                    </p>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <Field
                      label={t("numberOfBedrooms")}
                      name={`roomTypes.${idx}.bedrooms`}
                      type="number"
                      placeholder="0"
                      required
                    />
                    <Field
                      label={t("numberOfBathrooms")}
                      name={`roomTypes.${idx}.bathrooms`}
                      type="number"
                      placeholder="0"
                      required
                    />
                    <SelectField
                      label={t("furnitureStatus")}
                      name="furnishing"
                      options={[
                        t("furnitureFull"),
                        t("furnitureBasic"),
                        t("furnitureEmpty"),
                      ]}
                      placeholder={t("selectFurnitureStatus")}
                      required
                    />
                    <Field
                      label={tProperty("area")}
                      name={`roomTypes.${idx}.area`}
                      type="number"
                      placeholder="m²"
                      required
                    />
                    <Field
                      label={t("rentPrice")}
                      name={`roomTypes.${idx}.price`}
                      type="number"
                      placeholder="VND"
                      required
                    />
                    <DepositField roomIndex={idx} />
                  </div>

                  <div>
                    <Label className="mb-2 block">
                      {t("roomTypePosition")} {idx + 1}
                    </Label>
                    <div className="rounded-xl border-2 border-dotted p-4 bg-muted/30 border-accent">
                      <RoomSelector roomTypeIndex={idx} />
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
                      {t("attachedImages")} ({t("maxImages")})
                    </p>
                  </div>

                  {/* Hero Image Upload */}
                  {!watch(`roomTypes.${idx}.images`)?.[0] && (
                    <ImageDrop
                      label={t("uploadRoomImage")}
                      onPick={(src) => {
                        const currentImages =
                          getValues(`roomTypes.${idx}.images`) || [];
                        setValue(`roomTypes.${idx}.images`, [
                          src,
                          ...currentImages,
                        ]);
                      }}
                      onError={setUploadError}
                    />
                  )}

                  {/* Gallery Display */}
                  <div className="grid grid-cols-3 gap-3">
                    {/* Display selected images */}
                    {watch(`roomTypes.${idx}.images`)?.map((imgSrc, i) => (
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
                            const currentImages =
                              getValues(`roomTypes.${idx}.images`) || [];
                            setValue(
                              `roomTypes.${idx}.images`,
                              currentImages.filter((_, index) => index !== i)
                            );
                          }}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        {i === 0 && (
                          <div className="absolute bottom-1 left-1 bg-primary text-white text-xs px-2 py-0.5 rounded">
                            {t("mainImage")}
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Empty slots for additional images */}
                    {Array.from({
                      length: Math.max(
                        0,
                        6 - (watch(`roomTypes.${idx}.images`)?.length || 0)
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
                              setUploadError(t("onlyImageFormat"));
                              return;
                            }
                            if (file.size > 5 * 1024 * 1024) {
                              setUploadError(t("imageSizeLimit"));
                              return;
                            }

                            // Convert to base64
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              const currentImages =
                                getValues(`roomTypes.${idx}.images`) || [];
                              setValue(`roomTypes.${idx}.images`, [
                                ...currentImages,
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
                            {t("addImage")}
                          </span>
                        </div>
                      </DottedBox>
                    ))}
                  </div>

                  {uploadError && (
                    <p className="text-xs text-red-500 mt-2">{uploadError}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      <div
        onClick={() =>
          append({
            name: `${t("roomType")} ${fields.length + 1}`,
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
          {t("addRoomType")}
        </span>
      </div>
    </div>
  );
}
