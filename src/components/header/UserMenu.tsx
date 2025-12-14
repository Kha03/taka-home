"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRole } from "@/hooks/use-role";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { WalletBalance } from "@/components/wallet/wallet-balance";
import {
  LogOut,
  User,
  Plus,
  History,
  ShieldCheck,
  FileCheck,
} from "lucide-react";
import { Link } from "@/lib/i18n/navigation";

export function UserMenu() {
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const { isLandlord, isAdmin } = useRole();
  const tAuth = useTranslations("auth");
  const t = useTranslations("nav");

  // Show loading skeleton while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-9 w-20 bg-gray-200 animate-pulse rounded" />
        <div className="h-9 w-20 bg-gray-200 animate-pulse rounded" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center gap-2">
        <Button size="sm" asChild className="bg-accent hover:bg-accent/90">
          <Link href="/signin">{tAuth("signin")}</Link>
        </Button>
        <Button size="sm" asChild>
          <Link href="/signup">{tAuth("signup")}</Link>
        </Button>
      </div>
    );
  }

  const initials = user.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-12 w-12 rounded-full">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={user.avatarUrl}
                alt={user.fullName}
                className="object-cover"
              />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56 bg-primary-foreground"
          align="end"
          forceMount
        >
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {user.fullName}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>

              <WalletBalance variant="compact" className="mt-2" />
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* Menu items cho Landlord */}
          {isLandlord && (
            <>
              <DropdownMenuItem asChild>
                <Link href="/my-properties/new" className="cursor-pointer">
                  <Plus className="mr-2 h-4 w-4" />
                  <span>{t("createProperty")}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/my-properties" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>{t("myProperties")}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/rental-requests" className="cursor-pointer">
                  <History className="mr-2 h-4 w-4" />
                  <span>{t("rentalRequests")}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}

          {/* Menu items cho Admin */}
          {isAdmin && (
            <>
              <DropdownMenuItem asChild>
                <Link
                  href="/admin/property-approval"
                  className="cursor-pointer"
                >
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  <span>{t("propertyApproval")}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}

          {/* Menu items chung */}
          <DropdownMenuItem asChild>
            <Link href="/profile" className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>{t("profile")}</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/verify-signature" className="cursor-pointer">
              <FileCheck className="mr-2 h-4 w-4" />
              <span>{t("verifySignature")}</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/blockchain-history" className="cursor-pointer">
              <History className="mr-2 h-4 w-4" />
              <span>{t("blockchainHistory")}</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={logout}
            className="cursor-pointer text-red-600"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>{tAuth("signout")}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
