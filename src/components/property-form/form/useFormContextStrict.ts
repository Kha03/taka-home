"use client";

import { useFormContext, FieldValues } from "react-hook-form";

export function useFormContextStrict<T extends FieldValues>() {
  const ctx = useFormContext<T>();
  if (!ctx) throw new Error("Must be used within <FormProvider>");
  return ctx;
}
