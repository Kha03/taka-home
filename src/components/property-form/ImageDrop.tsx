"use client";

import React from "react";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("form");
  const [isUploading, setIsUploading] = React.useState(false);
  const inputId = React.useId();

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      onError?.("Chỉ chấp nhận file ảnh định dạng JPEG, PNG, WEBP");
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      onError?.("Kích thước ảnh không được vượt quá 5MB");
      return;
    }

    setIsUploading(true);
    try {
      // Convert file to base64 for temporary storage
      // Images will be uploaded later after property creation
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        onPick(base64String);
        setIsUploading(false);
      };
      reader.onerror = () => {
        onError?.("Có lỗi xảy ra khi đọc file ảnh");
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("File reading error:", error);
      onError?.("Có lỗi xảy ra khi xử lý ảnh");
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
        <span>{isUploading ? t("uploading") : label}</span>
      </label>
    </DottedBox>
  );
}
