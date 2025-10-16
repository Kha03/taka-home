/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { CircleAlert } from "lucide-react";
import { cn } from "@/lib/utils/utils";
import { NewPropertyForm } from "@/schema/schema";
import { useFormContextStrict } from "./useFormContextStrict";

export function SelectField({
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

  const getError = (path: string) => {
    const keys = path.split(".");
    let error: any = errors;
    for (const key of keys) {
      if (error && typeof error === "object" && key in error) {
        error = error[key];
      } else {
        return null;
      }
    }
    return error && typeof error === "object" && "message" in error
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
        name={name as any}
        render={({ field, fieldState }) => (
          <Select
            onValueChange={field.onChange}
            defaultValue={String(field.value ?? "")}
          >
            <SelectTrigger
              className={cn(
                "w-full rounded-[30px] text-sm bg-[#F4F4F4]",
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
