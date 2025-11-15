"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Wallet } from "lucide-react";
import {
  contractService,
  type EscrowBalanceResponse,
} from "@/lib/api/services/contract";

interface EscrowBalanceCardProps {
  contractId: string;
}

export function EscrowBalanceCard({ contractId }: EscrowBalanceCardProps) {
  const t = useTranslations("contract");
  const [balance, setBalance] = useState<EscrowBalanceResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await contractService.getEscrowByContractId(
          contractId
        );
        if (response.code === 200 && response.data) {
          setBalance(response.data);
        }
      } catch (err) {
        console.error("Error fetching escrow balance:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [contractId]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Wallet className="w-4 h-4 animate-pulse" />
        <span>{t("loadingBalance")}</span>
      </div>
    );
  }

  if (!balance) return null;

  const formatCurrency = (amount: string) => {
    const num = parseFloat(amount);
    return new Intl.NumberFormat("vi-VN").format(num) + " đ";
  };

  return (
    <div className="flex items-center gap-4 text-sm bg-accent/20 rounded-lg px-3 py-2 border border-accent">
      <div className="flex items-center gap-2">
        <Wallet className="w-4 h-4 text-primary" />
        <span className="text-muted-foreground">{t("depositBalance")}</span>
      </div>
      <div className="flex items-center gap-3">
        <div>
          <span className="text-xs text-muted-foreground">{t("tenant")}: </span>
          <span className="font-semibold text-primary">
            {formatCurrency(balance.balanceTenant)}
          </span>
        </div>
        <span className="text-muted-foreground">•</span>
        <div>
          <span className="text-xs text-muted-foreground">
            {t("landlord")}:{" "}
          </span>
          <span className="font-semibold text-primary">
            {formatCurrency(balance.balanceLandlord)}
          </span>
        </div>
      </div>
    </div>
  );
}
