"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { PasswordInput } from "@/components/ui/passwordinput";
import { useAuth } from "@/contexts/auth-context";
import {
  handleGoogleAuth,
  isGoogleOAuthConfigured,
} from "@/lib/auth/google-oauth";

type SignInFormProps = {
  errorFromUrl?: string;
};

export function SignInForm({ errorFromUrl }: SignInFormProps) {
  const t = useTranslations("auth");
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const { login, isLoading } = useAuth();

  // Handle error from URL params (from Google OAuth callback)
  useEffect(() => {
    if (errorFromUrl) {
      const errorMessages: Record<string, string> = {
        no_code: t("canceledGoogleLogin"),
        invalid_token: t("invalidSession"),
        default: t("loginError"),
      };
      const errorMessage = errorMessages[errorFromUrl] || errorMessages.default;
      setError(errorMessage);

      // Clear the error from URL after displaying it
      if (window.history.replaceState) {
        window.history.replaceState(null, "", "/signin");
      }
    }
  }, [errorFromUrl]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate password length
    if (formData.password.length < 6) {
      setError(t("validation.minLength", { min: 6 }));
      return;
    }

    const result = await login(formData.email, formData.password);
    if (!result.success && result.error) {
      setError(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-2.5 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
          {error}
        </div>
      )}

      <div className="grid gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
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
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">{t("password")}</Label>
          <PasswordInput
            id="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
            showStrength={false}
          />
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(v) => setRememberMe(!!v)}
            />
            <Label htmlFor="remember" className="text-sm">
              {t("rememberMe")}
            </Label>
          </div>
          <Link
            href="/forgot-password"
            className="text-sm text-primary hover:underline"
          >
            {t("forgotPassword")}
          </Link>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? t("loggingIn") : t("signin")}
        </Button>
      </div>

      <div>
        <Separator className="my-4" />
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant="outline"
            className="w-full text-primary text-xs"
            size="sm"
            onClick={() => handleGoogleAuth("signin")}
            disabled={!isGoogleOAuthConfigured()}
          >
            {/* Inline Google icon */}
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
            type="button"
            variant="outline"
            className="w-full text-primary text-xs"
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
        <p className="mt-4 text-center text-sm text-muted-foreground">
          {t("noAccount")}
          <Link
            href="/signup"
            className="font-medium text-primary hover:underline"
          >
            {t("registerNow")}
          </Link>
        </p>
      </div>
    </form>
  );
}
