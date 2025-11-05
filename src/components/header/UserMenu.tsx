"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRole } from "@/hooks/use-role";
import { Button } from "@/components/ui/button";
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
import { LogOut, User, Plus, History, ShieldCheck } from "lucide-react";
import Link from "next/link";

export function UserMenu() {
  const { user, logout, isAuthenticated } = useAuth();
  const { isLandlord, isAdmin } = useRole();

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center gap-2">
        <Button size="sm" asChild className="bg-accent hover:bg-accent/90">
          <Link href="/signin">Đăng nhập</Link>
        </Button>
        <Button size="sm" asChild>
          <Link href="/signup">Đăng ký</Link>
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
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.avatarUrl} alt={user.fullName} />
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
                  <span>Đăng tin mới</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/my-properties" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Bất động sản của tôi</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/rental-requests" className="cursor-pointer">
                  <History className="mr-2 h-4 w-4" />
                  <span>Yêu cầu thuê</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}

          {/* Menu items cho Admin */}
          {isAdmin && (
            <>
              <DropdownMenuItem asChild>
                <Link href="/property-approval" className="cursor-pointer">
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  <span>Duyệt bất động sản</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}

          {/* Menu items chung */}
          <DropdownMenuItem asChild>
            <Link href="/profile" className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Hồ sơ</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/blockchain-history" className="cursor-pointer">
              <History className="mr-2 h-4 w-4" />
              <span>Lịch sử hợp đồng</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={logout}
            className="cursor-pointer text-red-600"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Đăng xuất</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
