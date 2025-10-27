"use client";

import { useState, useEffect } from "react";
import { contractService } from "@/lib/api/services";
import {
  BlockchainContractHistoryResponse,
  BlockchainPaymentHistoryResponse,
  PaymentStatus,
} from "@/types/contracts";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Loader2, Receipt, FileText } from "lucide-react";
import {
  BlockchainHistoryTimeline,
  BlockchainPaymentTimeline,
} from "@/components/contracts";
import { useAuth } from "@/contexts/auth-context";

type OrgName = "OrgTenant" | "OrgLandlord";

export default function BlockchainHistoryPage() {
  const { user } = useAuth();

  // State management
  const [contractId, setContractId] = useState("");
  const [paymentStatus, setPaymentStatus] =
    useState<PaymentStatus>("SCHEDULED");
  const [orgName, setOrgName] = useState<OrgName>("OrgTenant");
  const [contractHistory, setContractHistory] =
    useState<BlockchainContractHistoryResponse | null>(null);
  const [paymentHistory, setPaymentHistory] =
    useState<BlockchainPaymentHistoryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-detect organization based on user role
  useEffect(() => {
    if (!user?.roles) return;

    if (user.roles.includes("LANDLORD")) {
      setOrgName("OrgLandlord");
    } else if (user.roles.includes("TENANT")) {
      setOrgName("OrgTenant");
    }
  }, [user]);

  // Contract history search handler
  const handleSearchContract = async () => {
    const trimmedId = contractId.trim();

    if (!trimmedId) {
      setError("Vui lòng nhập ID hợp đồng");
      return;
    }

    setLoading(true);
    setError(null);
    setContractHistory(null);

    try {
      const response = await contractService.getContractBlockchainHistory(
        trimmedId,
        orgName
      );

      if (response.code === 200 && response.data) {
        setContractHistory(response.data);
      } else {
        setError(response.message || "Không thể tải lịch sử hợp đồng");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Đã xảy ra lỗi khi tra cứu"
      );
    } finally {
      setLoading(false);
    }
  };

  // Payment history search handler
  const handleSearchPayment = async () => {
    if (!contractId.trim()) {
      setError("Vui lòng tra cứu hợp đồng trước khi xem lịch thanh toán");
      return;
    }

    setLoading(true);
    setError(null);
    setPaymentHistory(null);

    try {
      const response = await contractService.getPaymentBlockchainHistory(
        orgName,
        paymentStatus
      );

      if (response.code === 200 && response.data) {
        setPaymentHistory(response.data);
      } else {
        setError(response.message || "Không thể tải lịch thanh toán");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Đã xảy ra lỗi khi tra cứu"
      );
    } finally {
      setLoading(false);
    }
  };

  const hasContractResults =
    contractHistory?.data && contractHistory.data.length > 0;
  const hasPaymentResults =
    paymentHistory?.data && paymentHistory.data.length > 0;
  const isContractIdValid = contractId.trim().length > 0;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <header className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-primary">
            Tra Cứu Lịch Sử Blockchain
          </h1>
          <p className="text-muted-foreground">
            Tra cứu lịch sử hợp đồng và thanh toán được lưu trữ trên blockchain
          </p>
        </header>

        {/* Main Content */}
        <Tabs defaultValue="contract" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="contract">
              <FileText className="mr-2 h-4 w-4" />
              Lịch Sử Hợp Đồng
            </TabsTrigger>
            <TabsTrigger value="payment">
              <Receipt className="mr-2 h-4 w-4" />
              Lịch Thanh Toán
            </TabsTrigger>
          </TabsList>

          {/* Contract History Tab */}
          <TabsContent value="contract" className="space-y-4">
            <Card className="bg-primary-foreground">
              <CardHeader>
                <CardTitle>Tra Cứu Hợp Đồng</CardTitle>
                <CardDescription>
                  Nhập mã hợp đồng để tra cứu lịch sử trên blockchain
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contractId">Mã Hợp Đồng</Label>
                  <Input
                    id="contractId"
                    placeholder="VD: CT-20251025-LJU6IZ"
                    value={contractId}
                    onChange={(e) => setContractId(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleSearchContract()
                    }
                  />
                </div>

                <Button
                  onClick={handleSearchContract}
                  disabled={loading || !isContractIdValid}
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

            {/* Contract Results */}
            {hasContractResults && (
              <Card className="bg-primary-foreground">
                <CardHeader>
                  <CardTitle>Lịch Sử Hợp Đồng</CardTitle>
                  <CardDescription>
                    Tìm thấy {contractHistory.data.length} giao dịch trên
                    blockchain
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <BlockchainHistoryTimeline history={contractHistory.data} />
                </CardContent>
              </Card>
            )}

            {contractHistory?.data && contractHistory.data.length === 0 && (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  Không tìm thấy lịch sử cho hợp đồng này
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Payment History Tab */}
          <TabsContent value="payment" className="space-y-4">
            <Card className="bg-primary-foreground">
              <CardHeader>
                <CardTitle>Tra Cứu Thanh Toán</CardTitle>
                <CardDescription>
                  Lọc lịch thanh toán theo trạng thái (Yêu cầu tra cứu hợp đồng
                  trước)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="paymentStatus">Trạng Thái</Label>
                  <Select
                    value={paymentStatus}
                    onValueChange={(value) =>
                      setPaymentStatus(value as PaymentStatus)
                    }
                  >
                    <SelectTrigger id="paymentStatus">
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent className="bg-primary-foreground">
                      <SelectItem value="PAID">Đã thanh toán</SelectItem>
                      <SelectItem value="SCHEDULED">Đã lên lịch</SelectItem>
                      <SelectItem value="OVERDUE">Quá hạn</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleSearchPayment}
                  disabled={loading || !isContractIdValid}
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

            {/* Payment Results */}
            {hasPaymentResults && (
              <Card className="bg-primary-foreground">
                <CardHeader>
                  <CardTitle>Lịch Thanh Toán</CardTitle>
                  <CardDescription>
                    Lịch thanh toán của hợp đồng {contractId}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <BlockchainPaymentTimeline
                    history={paymentHistory.data}
                    contractId={contractId}
                  />
                </CardContent>
              </Card>
            )}

            {paymentHistory?.data && paymentHistory.data.length === 0 && (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  Không tìm thấy lịch thanh toán
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
