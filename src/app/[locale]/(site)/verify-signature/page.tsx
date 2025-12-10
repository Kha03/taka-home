"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  FileText,
  Upload,
  CheckCircle2,
  FileCheck,
  AlertCircle,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils/utils";
import { smartcaService, type VerifySignatureResult } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

export default function VerifySignaturePage() {
  const t = useTranslations("verifySignature");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [signatureIndex, setSignatureIndex] = useState<string>("0");
  const [isDragging, setIsDragging] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] =
    useState<VerifySignatureResult | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        alert(t("maxSize"));
        return;
      }
      setPdfFile(file);
    } else {
      alert(t("onlyPdf"));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type === "application/pdf") {
      if (file.size > 10 * 1024 * 1024) {
        alert(t("maxSize"));
        return;
      }
      setPdfFile(file);
    } else {
      alert(t("onlyPdf"));
    }
  };

  const handleVerify = async () => {
    if (!pdfFile) {
      toast.error(t("uploadPdfDesc"));
      return;
    }

    setIsVerifying(true);
    setVerificationResult(null);

    try {
      const response = await smartcaService.verifySelfCASignature(
        pdfFile,
        parseInt(signatureIndex)
      );

      console.log("=== VERIFY RESPONSE ===");
      console.log("Full response:", response);
      console.log("Response.data:", response.data);

      // ApiResponse structure: { code, message, data: VerifySignatureResult }
      if (response && response.data) {
        const verificationData = response.data;
        setVerificationResult(verificationData);

        // Check isValid from response.data
        const isValid = verificationData.isValid;
        console.log("Final isValid value:", isValid);

        if (isValid === true) {
          toast.success("Xác thực thành công", "Chữ ký số hợp lệ");
        } else {
          toast.warning(
            "Xác thực thất bại",
            "Chữ ký số không hợp lệ hoặc đã bị thay đổi"
          );
        }
      } else {
        toast.error("Không thể xác thực chữ ký. Vui lòng thử lại.");
      }
    } catch (error: unknown) {
      console.error("Verification error:", error);
      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      toast.error(
        "Lỗi xác thực",
        err?.response?.data?.message ||
          err?.message ||
          "Không thể xác thực chữ ký"
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const handleRemoveFile = () => {
    setPdfFile(null);
  };

  return (
    <div className="min-h-screen bg-[#FFF7E9] py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 bg-primary rounded-full flex items-center justify-center">
                <FileCheck className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-primary mb-2">
              {t("title")}
            </h1>
            <p className="text-[#4F4F4F] text-sm max-w-2xl mx-auto">
              {t("description")}
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-xl shadow-lg border border-border/50 p-8">
            <div className="space-y-6">
              {/* Upload PDF Section */}
              <div>
                <Label className="text-[#4F4F4F] font-semibold text-base mb-3 block">
                  {t("uploadPdf")}
                </Label>
                <p className="text-sm text-muted-foreground mb-4">
                  {t("uploadPdfDesc")}
                </p>

                {!pdfFile ? (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={cn(
                      "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer hover:border-primary/50 hover:bg-primary/5",
                      isDragging
                        ? "border-primary bg-primary/10"
                        : "border-border"
                    )}
                    onClick={() =>
                      document.getElementById("pdf-upload")?.click()
                    }
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Upload className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-[#4F4F4F] mb-1">
                          {t("dragDropHere")}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {t("or")}{" "}
                          <span className="text-primary font-medium">
                            {t("clickToUpload")}
                          </span>
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {t("onlyPdf")} • {t("maxSize")}
                      </p>
                    </div>
                    <input
                      type="file"
                      id="pdf-upload"
                      accept=".pdf,application/pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="border border-border rounded-lg p-4 bg-green-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-[#4F4F4F]">
                            {pdfFile.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {(pdfFile.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleRemoveFile}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          Xóa
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Signature Selection */}
              <div>
                <Label className="text-[#4F4F4F] font-semibold text-base mb-3 block">
                  {t("selectSignature")}
                </Label>
                <Select
                  value={signatureIndex}
                  onValueChange={setSignatureIndex}
                >
                  <SelectTrigger className="w-full h-12 bg-[#F4F4F4] border-border/50">
                    <SelectValue placeholder={t("selectSignature")} />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="0">{t("signatureFirst")}</SelectItem>
                    <SelectItem value="1">{t("signatureSecond")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Verify Button */}
              <div className="pt-4">
                <Button
                  onClick={handleVerify}
                  disabled={!pdfFile || isVerifying}
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-semibold text-base disabled:opacity-50"
                >
                  <FileCheck className="h-5 w-5 mr-2" />
                  {isVerifying ? "Đang xác thực..." : t("verifyButton")}
                </Button>
              </div>
            </div>
          </div>

          {/* Verification Result */}
          {verificationResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={cn(
                "mt-6 rounded-xl shadow-lg border p-6",
                verificationResult.isValid
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-200"
              )}
            >
              {/* Status Header */}
              <div className="flex items-center gap-3 mb-4">
                {verificationResult.isValid ? (
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  </div>
                ) : (
                  <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>
                )}
                <div>
                  <h3
                    className={cn(
                      "text-lg font-bold",
                      verificationResult.isValid
                        ? "text-green-900"
                        : "text-red-900"
                    )}
                  >
                    {verificationResult.isValid
                      ? "Chữ ký hợp lệ ✓"
                      : "Chữ ký không hợp lệ ✗"}
                  </h3>
                  <p
                    className={cn(
                      "text-sm",
                      verificationResult.isValid
                        ? "text-green-700"
                        : "text-red-700"
                    )}
                  >
                    {verificationResult.isValid
                      ? "Chữ ký số được xác thực thành công"
                      : "Chữ ký số không hợp lệ hoặc đã bị thay đổi"}
                  </p>
                </div>
              </div>

              {/* Signer Information */}
              {verificationResult.signerInfo && (
                <div className="bg-white rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-[#4F4F4F] mb-3 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Thông tin người ký
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tên:</span>
                      <span className="font-medium">
                        {verificationResult.signerInfo.commonName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Số serial:</span>
                      <span className="font-mono text-xs">
                        {verificationResult.signerInfo.serialNumber}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cấp bởi:</span>
                      <span className="font-medium">
                        {verificationResult.signerInfo.issuedBy}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Hiệu lực từ:
                      </span>
                      <span>
                        {new Date(
                          verificationResult.signerInfo.validFrom
                        ).toLocaleString("vi-VN")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Hiệu lực đến:
                      </span>
                      <span>
                        {new Date(
                          verificationResult.signerInfo.validTo
                        ).toLocaleString("vi-VN")}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Signature Information */}
              {verificationResult.signatureInfo && (
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold text-[#4F4F4F] mb-3 flex items-center gap-2">
                    <FileCheck className="h-4 w-4" />
                    Thông tin chữ ký
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-start">
                      <span className="text-muted-foreground">Byte Range:</span>
                      <span className="font-mono text-xs text-right">
                        [{verificationResult.signatureInfo.byteRange.join(", ")}
                        ]
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-muted-foreground">
                        Content Digest:
                      </span>
                      <span className="font-mono text-xs break-all bg-gray-50 p-2 rounded">
                        {verificationResult.signatureInfo.contentDigest}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Info Section */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 text-sm font-bold">i</span>
                </div>
              </div>
              <div className="text-sm text-blue-900">
                <p className="font-semibold mb-1">Lưu ý:</p>
                <ul className="list-disc list-inside space-y-1 text-blue-800">
                  <li>Chỉ hỗ trợ kiểm tra chữ ký số SELF_CA</li>
                  <li>File PDF phải có chữ ký số hợp lệ</li>
                  <li>
                    Chọn đúng vị trí chữ ký cần kiểm tra (thứ nhất hoặc thứ hai)
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
