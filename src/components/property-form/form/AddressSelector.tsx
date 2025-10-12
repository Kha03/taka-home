"use client";

import React from "react";
import { useVietnameseAddress } from "@/hooks/use-vietnamese-address";
import { useFormContextStrict } from "./useFormContextStrict";
import { NewPropertyForm } from "@/schema/schema";
import { ComboboxField } from "./ComboboxField";

export function AddressSelector() {
  const { watch, setValue } = useFormContextStrict<NewPropertyForm>();
  const {
    provinces,
    wards,
    loadingProvinces,
    loadingWards,
    loadWardsByProvince,
  } = useVietnameseAddress();

  const selectedProvince = watch("province");

  React.useEffect(() => {
    if (selectedProvince) {
      const province = provinces.find((p) => p.name === selectedProvince);
      if (province) {
        loadWardsByProvince(province.code);
        setValue("ward", "");
      }
    } else {
      setValue("ward", "");
    }
  }, [selectedProvince, provinces, loadWardsByProvince, setValue]);

  return (
    <>
      <ComboboxField
        name="province"
        options={provinces.map((p) => ({ value: p.name, label: p.name }))}
        loading={loadingProvinces}
        placeholder="Chọn tỉnh, thành phố"
        searchPlaceholder="Tìm kiếm tỉnh/thành phố..."
        emptyText="Không tìm thấy tỉnh/thành phố"
      />
      <ComboboxField
        name="ward"
        options={wards.map((w) => ({ value: w.name, label: w.name }))}
        loading={loadingWards}
        disabled={!selectedProvince}
        placeholder="Chọn phường, xã, thị trấn"
        searchPlaceholder="Tìm kiếm phường/xã..."
        emptyText={
          selectedProvince
            ? "Không tìm thấy phường/xã"
            : "Vui lòng chọn tỉnh/thành phố trước"
        }
      />
    </>
  );
}
