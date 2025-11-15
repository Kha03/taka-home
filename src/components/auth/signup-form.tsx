"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { PasswordInput } from "@/components/ui/passwordinput";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/contexts/auth-context";
import {
  handleGoogleAuth,
  isGoogleOAuthConfigured,
} from "@/lib/auth/google-oauth";

export function SignUpForm() {
  const t = useTranslations("auth");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "TENANT" as "TENANT" | "LANDLORD",
  });
  const [error, setError] = useState("");
  const { register, isLoading } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user types
    if (error) setError("");
  };

  const handleRoleChange = (value: string) => {
    setFormData({ ...formData, role: value as "TENANT" | "LANDLORD" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError(t("passwordMismatch"));
      return;
    }

    if (formData.password.length < 6) {
      setError(t("passwordTooShort"));
      return;
    }

    const result = await register(
      formData.fullName,
      formData.email,
      formData.password,
      formData.phone,
      formData.role
    );
    if (!result.success && result.error) {
      setError(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && (
        <div className="p-2.5 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
          {error}
        </div>
      )}

      {/* Basic info */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="fullName" className="text-sm">
            {t("fullName")}
          </Label>
          <Input
            id="fullName"
            name="fullName"
            placeholder="Nguyễn Văn A"
            value={formData.fullName}
            onChange={handleChange}
            required
            autoComplete="name"
            disabled={isLoading}
            className="h-9"
          />
        </div>

        {/* Role Selection */}
        <div className="space-y-2 sm:col-span-2">
          <Label className="text-sm">{t("role.selectRole")}</Label>
          <RadioGroup
            value={formData.role}
            onValueChange={handleRoleChange}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2 flex-1">
              <RadioGroupItem value="TENANT" id="tenant" />
              <Label
                htmlFor="tenant"
                className="font-normal cursor-pointer flex-1"
              >
                <div className="text-sm font-medium">{t("role.tenant")}</div>
              </Label>
            </div>
            <div className="flex items-center space-x-2 flex-1">
              <RadioGroupItem value="LANDLORD" id="landlord" />
              <Label
                htmlFor="landlord"
                className="font-normal cursor-pointer flex-1"
              >
                <div className="text-sm font-medium">{t("role.landlord")}</div>
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="email"
            disabled={isLoading}
            className="h-9"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone" className="text-sm">
            {t("phone")}
          </Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="09xx xxx xxx"
            value={formData.phone}
            onChange={handleChange}
            required
            autoComplete="tel"
            className="h-9"
          />
        </div>
      </div>

      {/* Passwords */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-sm">
            {t("password")}
          </Label>
          <PasswordInput
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword" className="text-sm">
            {t("confirmPassword")}
          </Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Nhập lại mật khẩu"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            autoComplete="new-password"
            className="h-9"
          />
          {formData.confirmPassword &&
          formData.confirmPassword !== formData.password ? (
            <p className="text-xs text-destructive h-2">
              {t("passwordMismatch")}
            </p>
          ) : (
            <p className="h-2"></p>
          )}
        </div>
      </div>

      <Button type="submit" className="w-full h-9" disabled={isLoading}>
        {isLoading ? t("creatingAccount") : t("createAccount")}
      </Button>

      <Separator className="my-3" />

      {/* Socials & switch */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          type="button"
          className="w-full text-primary text-xs h-8"
          size="sm"
          onClick={() => handleGoogleAuth("signup")}
          disabled={!isGoogleOAuthConfigured()}
        >
          <svg className="mr-1.5 h-4 w-4" viewBox="0 0 24 24" aria-hidden>
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Google
        </Button>
        <Button
          variant="outline"
          type="button"
          className="w-full text-primary text-xs h-8"
          size="sm"
        >
          <svg
            className="mr-1.5 h-4 w-4"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden
          >
            <path d="M24 12.073c0-6.627-5.373-12-12-12S0 5.446 0 12.073C0 18.06 4.388 23.024 10.125 23.924v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          Facebook
        </Button>
      </div>

      <p className="mt-3 text-center text-sm text-muted-foreground">
        {t("alreadyHaveAccount")}{" "}
        <Link
          href="/signin"
          className="font-medium text-primary hover:underline"
        >
          {t("loginNow")}
        </Link>
      </p>
    </form>
  );
}
