/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { useFormContextStrict } from "../form/useFormContextStrict";
import { NewPropertyForm } from "@/schema/schema";

export function RoomSelector({ roomTypeIndex }: { roomTypeIndex: number }) {
  const { watch, setValue } = useFormContextStrict<NewPropertyForm>();
  const floors = watch("floors");
  const roomTypes = watch("roomTypes");
  const currentRoomTypeLocations =
    (watch(`roomTypes.${roomTypeIndex}.locations`) as string[]) || [];

  const selectedRoomsByOthers = React.useMemo(() => {
    const selected = new Set<string>();
    roomTypes.forEach((roomType: any, index: number) => {
      if (index !== roomTypeIndex)
        roomType.locations?.forEach((room: string) => selected.add(room));
    });
    return selected;
  }, [roomTypes, roomTypeIndex]);

  const toggleRoomSelection = (floorIndex: number, roomName: string) => {
    const roomId = `${floorIndex}-${roomName}`;
    const updated = currentRoomTypeLocations.includes(roomId)
      ? currentRoomTypeLocations.filter((loc) => loc !== roomId)
      : [...currentRoomTypeLocations, roomId];
    setValue(`roomTypes.${roomTypeIndex}.locations` as any, updated);
  };

  const isRoomSelected = (floorIndex: number, roomName: string) =>
    currentRoomTypeLocations.includes(`${floorIndex}-${roomName}`);

  const isRoomDisabled = (floorIndex: number, roomName: string) =>
    selectedRoomsByOthers.has(`${floorIndex}-${roomName}`);

  return (
    <div className="space-y-3">
      {floors.map((floor: any, floorIndex: number) => (
        <div key={floorIndex} className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="text-xs px-2.5 py-1 bg-accent text-primary-foreground rounded-[30px] font-bold">
              {floor.name}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {floor.rooms.map((room: string, roomIndex: number) => {
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
