"use client";

import { useState } from "react";

export interface UploadResponse {
  success: boolean;
  message: string;
  data?: {
    url: string;
    fileName: string;
    originalName: string;
    size: number;
    type: string;
  };
}

export function useImageUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (file: File): Promise<UploadResponse | null> => {
    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result: UploadResponse = await response.json();

      if (!result.success) {
        setError(result.message);
        return null;
      }

      return result;
    } catch (err) {
      const errorMessage = "Có lỗi xảy ra khi upload ảnh";
      setError(errorMessage);
      console.error("Upload error:", err);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const uploadMultiple = async (files: File[]): Promise<UploadResponse[]> => {
    const promises = files.map(uploadImage);
    const results = await Promise.all(promises);
    return results.filter(
      (result): result is UploadResponse => result !== null
    );
  };

  return {
    uploadImage,
    uploadMultiple,
    isUploading,
    error,
  };
}
