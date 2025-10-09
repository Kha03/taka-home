"use client";

import { useState, useEffect, useCallback } from "react";

export interface AddressItem {
  code: string;
  name: string;
  type: string;
}

export interface AddressResponse {
  success: boolean;
  message?: string;
  data: AddressItem[];
}

export function useVietnameseAddress() {
  const [provinces, setProvinces] = useState<AddressItem[]>([]);
  const [districts, setDistricts] = useState<AddressItem[]>([]);
  const [wards, setWards] = useState<AddressItem[]>([]);

  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);

  const [error, setError] = useState<string | null>(null);

  // Load provinces on mount
  useEffect(() => {
    loadProvinces();
  }, []);

  const loadProvinces = async () => {
    setLoadingProvinces(true);
    setError(null);

    try {
      const response = await fetch("/api/address?level=province");
      const result: AddressResponse = await response.json();

      if (result.success) {
        setProvinces(result.data);
      } else {
        setError(result.message || "Không thể tải danh sách tỉnh/thành");
      }
    } catch (err) {
      setError("Có lỗi xảy ra khi tải danh sách tỉnh/thành");
      console.error("Load provinces error:", err);
    } finally {
      setLoadingProvinces(false);
    }
  };

  const loadDistricts = useCallback(async (provinceCode: string) => {
    if (!provinceCode) {
      setDistricts([]);
      setWards([]);
      return;
    }

    setLoadingDistricts(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/address?level=district&province=${provinceCode}`
      );
      const result: AddressResponse = await response.json();

      if (result.success) {
        setDistricts(result.data);
        setWards([]); // Reset wards when province changes
      } else {
        setError(result.message || "Không thể tải danh sách quận/huyện");
      }
    } catch (err) {
      setError("Có lỗi xảy ra khi tải danh sách quận/huyện");
      console.error("Load districts error:", err);
    } finally {
      setLoadingDistricts(false);
    }
  }, []);

  const loadWards = useCallback(async (districtCode: string) => {
    if (!districtCode) {
      setWards([]);
      return;
    }

    setLoadingWards(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/address?level=ward&district=${districtCode}`
      );
      const result: AddressResponse = await response.json();

      if (result.success) {
        setWards(result.data);
      } else {
        setError(result.message || "Không thể tải danh sách phường/xã");
      }
    } catch (err) {
      setError("Có lỗi xảy ra khi tải danh sách phường/xã");
      console.error("Load wards error:", err);
    } finally {
      setLoadingWards(false);
    }
  }, []);

  // Helper function to get province name by code
  const getProvinceName = (code: string) => {
    return provinces.find((p) => p.code === code)?.name || "";
  };

  // Helper function to get district name by code
  const getDistrictName = (code: string) => {
    return districts.find((d) => d.code === code)?.name || "";
  };

  // Helper function to get ward name by code
  const getWardName = (code: string) => {
    return wards.find((w) => w.code === code)?.name || "";
  };

  return {
    provinces,
    districts,
    wards,
    loadingProvinces,
    loadingDistricts,
    loadingWards,
    error,
    loadDistricts,
    loadWards,
    getProvinceName,
    getDistrictName,
    getWardName,
  };
}
