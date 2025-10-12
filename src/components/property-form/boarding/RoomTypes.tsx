"use client";

import React from "react";
import { useFieldArray } from "react-hook-form";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Info, Trash2, ImageIcon, Plus } from "lucide-react";
import { Field } from "../form/Field";
import { SelectField } from "../form/SelectField";
import { DepositField } from "../form/DepositField";
import { ImageDrop } from "../ImageDrop";
import { DottedBox } from "../DottedBox";
import { RoomSelector } from "./RoomSelector";
import { NewPropertyForm } from "@/schema/schema";
import { useFormContextStrict } from "../form/useFormContextStrict";

export function RoomTypes() {
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
                {/* Thông tin chi tiết */}
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

                {/* Hình ảnh đính kèm */}
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
