"use client";

import React from "react";
import { useVietnameseAddress } from "@/hooks/use-vietnamese-address";
import { useFormContextStrict } from "./useFormContextStrict";
import { NewPropertyForm } from "@/schema/schema";
import { SelectField } from "./SelectField";

export function AddressSelector() {
  const { watch, setValue } = useFormContextStrict<NewPropertyForm>();
  const {
    provinces,
    districts,
    wards,
    loadingProvinces,
    loadingDistricts,
    loadingWards,
    loadDistricts,
    loadWards,
  } = useVietnameseAddress();

  const selectedProvince = watch("province");
  const selectedDistrict = watch("district");

  React.useEffect(() => {
    if (selectedProvince) {
      const province = provinces.find((p) => p.name === selectedProvince);
      if (province) {
        loadDistricts(province.code);
        setValue("district", "");
        setValue("ward", "");
      }
    }
  }, [selectedProvince, provinces, loadDistricts, setValue]);

  React.useEffect(() => {
    if (selectedDistrict) {
      const district = districts.find((d) => d.name === selectedDistrict);
      if (district) {
        loadWards(district.code);
        setValue("ward", "");
      }
    }
  }, [selectedDistrict, districts, loadWards, setValue]);

  return (
    <>
      <SelectField
        name="province"
        options={provinces.map((p) => p.name)}
        loading={loadingProvinces}
        placeholder="Chọn tỉnh, thành phố"
      />
      <SelectField
        name="district"
        options={districts.map((d) => d.name)}
        loading={loadingDistricts}
        disabled={!selectedProvince}
        placeholder="Chọn quận, huyện, thị xã"
      />
      <SelectField
        name="ward"
        options={wards.map((w) => w.name)}
        loading={loadingWards}
        disabled={!selectedDistrict}
        placeholder="Chọn phường, xã, thị trấn"
      />
    </>
  );
}
