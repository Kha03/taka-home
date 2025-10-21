"use client";

import { WalletBalance } from "@/components/wallet";

export default function WalletPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-primary mt-2 font-bold text-3xl">
          Ví và lịch sử giao dịch
        </h2>
      </div>

      {/* Wallet Component */}
      <WalletBalance className="bg-primary-foreground gap-1" showRefresh />
    </div>
  );
}
