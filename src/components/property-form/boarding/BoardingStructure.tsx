/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { useFieldArray } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CircleAlert, Trash2, X, Plus } from "lucide-react";
import { NewPropertyForm } from "@/schema/schema";
import { useFormContextStrict } from "../form/useFormContextStrict";
import { AddFloorCard } from "./AddFloorCard";

export function BoardingStructure() {
  const t = useTranslations("myProperties");
  const { control } = useFormContextStrict<NewPropertyForm>();
  const { fields, append, remove } = useFieldArray({ control, name: "floors" });

  const getNextFloorName = () => {
    if (fields.length === 0) return t("groundFloor");
    if (fields.length === 1) return `${t("floor")} 1`;
    return `${t("floor")} ${fields.length}`;
  };

  const addFloor = () => append({ name: getNextFloorName(), rooms: [] });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-[#4F4F4F] font-semibold text-sm">
          {t("propertyStructure")}
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
  const t = useTranslations("property");
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
      <div className="grid grid-cols-3 gap-2">
        {rooms.map((r, i) => (
          <span
            key={i}
            className="rounded-full bg-muted px-2 py-1 text-xs flex items-center justify-center"
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
          <Plus className="mr-1 h-4 w-4" /> {t("addRoom")}
        </Button>
      </div>

      <input type="hidden" {...register(roomsPath as any)} />
    </div>
  );
}
