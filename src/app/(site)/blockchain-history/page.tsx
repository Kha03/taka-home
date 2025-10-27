"use client";

import { useState, useEffect } from "react";
import { contractService } from "@/lib/api/services";
import { BlockchainContractHistoryResponse } from "@/types/contracts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Search, Loader2, User as UserIcon } from "lucide-react";
import { BlockchainHistoryTimeline } from "@/components/contracts";
import { useAuth } from "@/contexts/auth-context";
import { Badge } from "@/components/ui/badge";

export default function BlockchainHistoryPage() {
  const { user } = useAuth();
  const [contractId, setContractId] = useState("");
  const [orgName, setOrgName] = useState<"OrgTenant" | "OrgLandlord">(
    "OrgTenant"
  );
  const [history, setHistory] =
    useState<BlockchainContractHistoryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-detect orgName based on user role
  useEffect(() => {
    if (user?.roles) {
      // Ưu tiên LANDLORD nếu có cả 2 roles
      if (user.roles.includes("LANDLORD")) {
        setOrgName("OrgLandlord");
      } else if (user.roles.includes("TENANT")) {
        setOrgName("OrgTenant");
      }
    }
  }, [user]);

  const handleSearch = async () => {
    if (!contractId.trim()) {
      setError("Vui lòng nhập ID hợp đồng");
      return;
    }

    setLoading(true);
    setError(null);
    setHistory(null);

    try {
      const response = await contractService.getContractBlockchainHistory(
        contractId.trim(),
        orgName
      );

      if (response.code === 200 && response.data) {
        setHistory(response.data);
      } else {
        setError(response.message || "Không thể tải lịch sử hợp đồng");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Đã xảy ra lỗi khi tra cứu";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-primary text-center">
            Tra Cứu Lịch Sử Hợp Đồng Blockchain
          </h1>
        </div>

        {/* Search Form */}
        <Card className="bg-primary-foreground">
          <CardHeader>
            <CardTitle>Thông Tin Tra Cứu</CardTitle>
            <CardDescription>
              Nhập mã hợp đồng để tra cứu lịch sử trên blockchain
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contractId">Mã Hợp Đồng</Label>
                <Input
                  id="contractId"
                  placeholder="VD: CT-20251025-LJU6IZ"
                  value={contractId}
                  onChange={(e) => setContractId(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Vai Trò Của Bạn</Label>
                <div className="flex items-center h-10 px-3 py-2 rounded-md border border-input bg-background">
                  <UserIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {orgName === "OrgLandlord" ? "Chủ Nhà" : "Người Thuê"}
                  </span>
                </div>
              </div>
            </div>

            <Button
              onClick={handleSearch}
              disabled={loading || !contractId.trim()}
              className="w-full md:w-auto"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang tra cứu...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Tra Cứu
                </>
              )}
            </Button>

            {error && (
              <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
                {error}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        {history && history.data && history.data.length > 0 && (
          <Card className="bg-primary-foreground">
            <CardHeader>
              <CardTitle>Lịch Sử Hợp Đồng</CardTitle>
              <CardDescription>
                Tìm thấy {history.data.length} giao dịch trên blockchain
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BlockchainHistoryTimeline history={history.data} />
            </CardContent>
          </Card>
        )}

        {history && history.data && history.data.length === 0 && (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Không tìm thấy lịch sử cho hợp đồng này
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
