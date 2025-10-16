/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils/utils";
import { useFormContextStrict } from "./useFormContextStrict";
import { NewPropertyForm } from "@/schema/schema";

export function DepositField({ roomIndex }: { roomIndex?: number }) {
  const {
    watch,
    setValue,
    register,
    formState: { errors },
  } = useFormContextStrict<NewPropertyForm>();
  const [isDepositEqualPrice, setIsDepositEqualPrice] = React.useState(false);

  const priceFieldName =
    roomIndex !== undefined
      ? (`roomTypes.${roomIndex}.price` as keyof NewPropertyForm)
      : "price";
  const depositFieldName =
    roomIndex !== undefined
      ? (`roomTypes.${roomIndex}.deposit` as keyof NewPropertyForm)
      : "deposit";

  const price = watch(priceFieldName);

  const handleCheckboxChange = (checked: boolean) => {
    setIsDepositEqualPrice(checked);
    if (checked) setValue(depositFieldName, (price as any) || 0);
  };

  React.useEffect(() => {
    if (isDepositEqualPrice && price) setValue(depositFieldName, price as any);
  }, [price, isDepositEqualPrice, setValue, depositFieldName]);

  const fieldError =
    roomIndex !== undefined
      ? (errors.roomTypes?.[roomIndex] as any)?.deposit
      : errors.deposit;
  const hasError = !!fieldError;

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
            {...register(depositFieldName as any)}
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
        <p className="mt-1 text-xs text-destructive">
          {(fieldError as any)?.message}
        </p>
      )}
    </div>
  );
}
