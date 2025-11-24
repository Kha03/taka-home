/**
 * Component bảo vệ route dựa trên role
 */

"use client";

import { useRouter } from "@/lib/i18n/navigation";
import { useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import type { UserRole } from "@/lib/auth/roles";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  redirectTo?: string;
  fallback?: React.ReactNode;
}

export function RoleGuard({
  children,
  allowedRoles,
  redirectTo = "/",
  fallback = null,
}: RoleGuardProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const userRoles = user?.roles;

    if (!userRoles || userRoles.length === 0) {
      router.push("/signin");
      return;
    }

    const hasPermission = userRoles.some((role) => allowedRoles.includes(role));

    if (!hasPermission) {
      router.push(redirectTo);
    }
  }, [user, isLoading, allowedRoles, redirectTo, router]);

  if (isLoading) {
    return fallback;
  }

  const userRoles = user?.roles;
  const hasPermission =
    userRoles && userRoles.some((role) => allowedRoles.includes(role));

  if (!hasPermission) {
    return fallback;
  }

  return <>{children}</>;
}

/**
 * Component để ẩn/hiện UI elements dựa trên role
 */
interface RoleBasedProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallback?: React.ReactNode;
}

export function RoleBased({
  children,
  allowedRoles,
  fallback = null,
}: RoleBasedProps) {
  const { user } = useAuth();

  const userRoles = user?.roles;
  const hasPermission =
    userRoles && userRoles.some((role) => allowedRoles.includes(role));

  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
