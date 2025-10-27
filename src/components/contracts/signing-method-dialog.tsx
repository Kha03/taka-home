"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, FileSignature, Shield, Smartphone } from "lucide-react";
import { signingOption } from "@/lib/api/services/booking";

interface SigningMethodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (method: signingOption) => void;
  loading?: boolean;
}

export function SigningMethodDialog({
  open,
  onOpenChange,
  onConfirm,
  loading = false,
}: SigningMethodDialogProps) {
  const [selectedMethod, setSelectedMethod] = useState<signingOption>(
    signingOption.VNPT
  );

  const handleConfirm = () => {
    if (loading) return; // Prevent double-click
    onConfirm(selectedMethod);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (loading) return; // Prevent closing while loading
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSignature className="w-5 h-5" />
            Chọn phương thức ký hợp đồng
          </DialogTitle>
          <DialogDescription>
            Vui lòng chọn phương thức ký số phù hợp với bạn
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <RadioGroup
            value={selectedMethod}
            onValueChange={(value) => setSelectedMethod(value as signingOption)}
            className="space-y-3"
          >
            {/* VNPT SmartCA Option */}
            <Card
              className={`cursor-pointer transition-all bg-primary-foreground ${
                selectedMethod === signingOption.VNPT
                  ? "border-primary border-2 bg-primary/5"
                  : "border-gray-200 hover:border-primary/50"
              }`}
              onClick={() => setSelectedMethod(signingOption.VNPT)}
            >
              <CardContent>
                <div className="flex items-start gap-3">
                  <RadioGroupItem
                    value={signingOption.VNPT}
                    id="vnpt"
                    className="mt-1"
                  />
                  <div className="flex-1 space-y-2">
                    <Label
                      htmlFor="vnpt"
                      className="flex items-center gap-2 cursor-pointer font-semibold text-base"
                    >
                      <Smartphone className="w-5 h-5 text-primary" />
                      VNPT SmartCA
                      <span className="ml-auto">
                        <CheckCircle2
                          className={`w-5 h-5 ${
                            selectedMethod === signingOption.VNPT
                              ? "text-primary"
                              : "text-gray-300"
                          }`}
                        />
                      </span>
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Ký số điện tử qua ứng dụng VNPT SmartCA trên điện thoại.
                      Yêu cầu đã có chứng thư số từ VNPT.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Self CA Option */}
            <Card
              className={`cursor-pointer transition-all bg-primary-foreground ${
                selectedMethod === signingOption.SELF_CA
                  ? "border-primary border-2 bg-primary/5"
                  : "border-gray-200 hover:border-primary/50"
              }`}
              onClick={() => setSelectedMethod(signingOption.SELF_CA)}
            >
              <CardContent>
                <div className="flex items-start gap-3">
                  <RadioGroupItem
                    value={signingOption.SELF_CA}
                    id="self-ca"
                    className="mt-1"
                  />
                  <div className="flex-1 space-y-2">
                    <Label
                      htmlFor="self-ca"
                      className="flex items-center gap-2 cursor-pointer font-semibold text-base"
                    >
                      <Shield className="w-5 h-5 text-primary" />
                      Ký tự động (Self CA)
                      <span className="ml-auto">
                        <CheckCircle2
                          className={`w-5 h-5 ${
                            selectedMethod === signingOption.SELF_CA
                              ? "text-primary"
                              : "text-gray-300"
                          }`}
                        />
                      </span>
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Thực hiện xác nhận kí số của hợp đồng một cách tự động qua
                      hệ thống của chúng tôi.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </RadioGroup>

          {/* Warning Notice */}
          <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
            <p className="text-xs text-amber-800 dark:text-amber-200">
              <span className="font-medium">Lưu ý:</span> Bằng việc ký hợp đồng,
              bạn xác nhận đã đọc và đồng ý với tất cả các điều khoản. Hãy chọn
              phương thức ký phù hợp với nhu cầu của bạn.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={loading}
            className="text-red-500 border-red-500"
          >
            Hủy
          </Button>
          <Button onClick={handleConfirm} disabled={loading}>
            {loading ? (
              <>
                <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Đang xử lý...
              </>
            ) : (
              <>
                <FileSignature className="w-4 h-4 mr-2" />
                Xác nhận và ký
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
