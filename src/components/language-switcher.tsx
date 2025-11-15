"use client";

import { useState } from "react";
import { useI18n } from "@/hooks/use-i18n";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Languages } from "lucide-react";

const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "vi", name: "Tiếng Việt", flag: "🇻🇳" },
];

export function LanguageSwitcher() {
  const { locale, changeLanguage } = useI18n();
  const [isChanging, setIsChanging] = useState(false);

  const currentLanguage = languages.find((lang) => lang.code === locale);

  const handleLanguageChange = async (newLocale: string) => {
    setIsChanging(true);
    try {
      changeLanguage(newLocale);
    } catch (error) {
      console.error("Failed to change language:", error);
    } finally {
      setTimeout(() => setIsChanging(false), 500);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={isChanging}
          className="text-accent border-accent"
        >
          <Languages className="mr-2 h-4 w-4" />
          {currentLanguage?.flag} {currentLanguage?.name}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-primary-foreground">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            disabled={locale === lang.code || isChanging}
            className="cursor-pointer"
          >
            <span className="mr-2">{lang.flag}</span>
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
