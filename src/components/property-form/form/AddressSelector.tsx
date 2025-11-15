"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useVietnameseAddress } from "@/hooks/use-vietnamese-address";
import { useFormContextStrict } from "./useFormContextStrict";
import { NewPropertyForm } from "@/schema/schema";
import { ComboboxField } from "./ComboboxField";

export function AddressSelector() {
  const t = useTranslations("form");
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
        placeholder={t("selectProvince")}
        searchPlaceholder={t("searchProvince")}
        emptyText={t("noResults")}
      />
      <ComboboxField
        name="ward"
        options={wards.map((w) => ({ value: w.name, label: w.name }))}
        loading={loadingWards}
        disabled={!selectedProvince}
        placeholder={t("selectWard")}
        searchPlaceholder={t("searchWard")}
        emptyText={selectedProvince ? t("noResults") : t("selectFirst")}
      />
    </>
  );
}
