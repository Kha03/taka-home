"use client";

import { useTranslations } from "next-intl";
import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AdminHeaderProps {
  title: string;
  description?: string;
}

export function AdminHeader({ title, description }: AdminHeaderProps) {
  const t = useTranslations("admin");
  return (
    <div className="border-b  backdrop-blur">
      <div className="flex items-center justify-between p-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-primary">
            {title}
          </h1>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder={t("search")} className="pl-9 w-[300px]" />
        </div>
      </div>
    </div>
  );
}
