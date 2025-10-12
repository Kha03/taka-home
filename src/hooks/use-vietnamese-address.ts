"use client";

import { useState, useEffect, useCallback } from "react";
import { vietnamAddressService } from "@/lib/api/services/vietnam-address";
import type { Province, Ward } from "@/lib/api/types";

export function useVietnameseAddress() {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const loadProvinces = useCallback(async () => {
    setLoadingProvinces(true);
    setError(null);

    try {
      const provincesList = await vietnamAddressService.getProvinces();
      setProvinces(provincesList);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Không thể tải danh sách tỉnh thành"
      );
    } finally {
      setLoadingProvinces(false);
    }
  }, []);

  // Load provinces on mount
  useEffect(() => {
    loadProvinces();
  }, [loadProvinces]);

  const loadWardsByProvince = useCallback(async (provinceCode: number) => {
    // Reset wards khi thay đổi tỉnh
    setWards([]);
    setError(null);

    setLoadingWards(true);

    try {
      const wardsList = await vietnamAddressService.getWardsByProvinceCode(
        provinceCode
      );
      setWards(wardsList);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Không thể tải danh sách phường xã"
      );
    } finally {
      setLoadingWards(false);
    }
  }, []);

  // Helper functions to get names by code
  const getProvinceName = useCallback(
    (code: number) => {
      return provinces.find((p) => p.code === code)?.name || "";
    },
    [provinces]
  );

  const getWardName = useCallback(
    (code: number) => {
      return wards.find((w) => w.code === code)?.name || "";
    },
    [wards]
  );

  // Get province by code
  const getProvinceByCode = useCallback(
    (code: number) => {
      return provinces.find((p) => p.code === code) || null;
    },
    [provinces]
  );

  // Get ward by code
  const getWardByCode = useCallback(
    (code: number) => {
      return wards.find((w) => w.code === code) || null;
    },
    [wards]
  );

  return {
    provinces,
    wards,
    loadingProvinces,
    loadingWards,
    error,
    loadProvinces,
    loadWardsByProvince,
    getProvinceName,
    getWardName,
    getProvinceByCode,
    getWardByCode,
  };
}
