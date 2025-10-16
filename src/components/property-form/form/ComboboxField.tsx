"use client";

import React, { useState } from "react";
import { Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, CircleAlert, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/utils";
import { NewPropertyForm } from "@/schema/schema";
import { useFormContextStrict } from "./useFormContextStrict";

interface ComboboxFieldProps {
  label?: string;
  name: keyof NewPropertyForm;
  options: Array<{ value: string; label: string }>;
  loading?: boolean;
  disabled?: boolean;
  placeholder?: string;
  required?: boolean;
  searchPlaceholder?: string;
  emptyText?: string;
}

export function ComboboxField({
  label,
  name,
  options,
  loading = false,
  disabled = false,
  placeholder = "Chọn...",
  required = false,
  searchPlaceholder = "Tìm kiếm...",
  emptyText = "Không tìm thấy kết quả",
}: ComboboxFieldProps) {
  const {
    control,
    formState: { errors },
  } = useFormContextStrict<NewPropertyForm>();

  const [open, setOpen] = useState(false);

  const error = errors[name];

  return (
    <div className="grid w-full items-center gap-1.5">
      {label && (
        <Label
          htmlFor={name}
          className={cn("text-sm font-medium", {
            "text-destructive": error,
          })}
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className={cn(
                  "w-full justify-between border-accent text-foreground font-normal rounded-[30px]",
                  !field.value && "text-muted-foreground",
                  error && "border-destructive focus-visible:ring-destructive",
                  disabled && "opacity-50 cursor-not-allowed"
                )}
                disabled={disabled || loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Đang tải...</span>
                  </div>
                ) : (
                  <>
                    {field.value
                      ? options.find((option) => option.value === field.value)
                          ?.label || field.value
                      : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput placeholder={searchPlaceholder} className="h-9" />
                <CommandList>
                  <CommandEmpty>{emptyText}</CommandEmpty>
                  <CommandGroup>
                    {options.map((option) => (
                      <CommandItem
                        key={option.value}
                        value={option.value}
                        onSelect={(currentValue) => {
                          field.onChange(
                            currentValue === field.value ? "" : currentValue
                          );
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            field.value === option.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {option.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        )}
      />
      {error && (
        <div className="items-center gap-1 text-sm text-destructive hidden">
          <CircleAlert className="h-4 w-4" />
          <span>{error.message}</span>
        </div>
      )}
    </div>
  );
}
