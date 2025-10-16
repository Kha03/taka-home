/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CircleAlert } from "lucide-react";
import { cn } from "@/lib/utils/utils";
import { useFormContextStrict } from "./useFormContextStrict";
import { NewPropertyForm } from "@/schema/schema";

export function Field({
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
          {...register(name as any)}
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
