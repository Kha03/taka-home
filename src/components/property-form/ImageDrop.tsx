"use client";

import React from "react";
import { Upload } from "lucide-react";
import { DottedBox } from "./DottedBox";

export function ImageDrop({
  label,
  onPick,
  onError,
}: {
  label: string;
  onPick: (src: string) => void;
  onError?: (error: string) => void;
}) {
  const [isUploading, setIsUploading] = React.useState(false);
  const inputId = React.useId();

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();

      if (result.success) onPick(result.data.url);
      else onError?.(result.message || "Có lỗi xảy ra khi upload ảnh");
    } catch (error) {
      console.error("Upload error:", error);
      onError?.("Có lỗi xảy ra khi upload ảnh");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <DottedBox className="flex h-40 w-full items-center justify-center bg-muted/30 border-accent">
      <input
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
        id={inputId}
        disabled={isUploading}
      />
      <label
        htmlFor={inputId}
        className="flex cursor-pointer items-center gap-2 text-muted-foreground hover:text-foreground"
      >
        <Upload className="h-5 w-5" />
        <span>{isUploading ? "Đang tải..." : label}</span>
      </label>
    </DottedBox>
  );
}
