"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, FileCheck2, FileX2, Upload, Shield } from "lucide-react";
import { calculatePDFHash } from "@/lib/utils/pdf-hash";

interface PDFHashComparatorProps {
  contractId: string;
  blockchainHash: string;
  fileUrl?: string;
  label?: string;
}

export function PDFHashComparator({
  contractId,
  blockchainHash,
  fileUrl,
  label,
}: PDFHashComparatorProps) {
  const t = useTranslations("contract");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculatedHash, setCalculatedHash] = useState<string | null>(null);
  const [isMatch, setIsMatch] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      setError(null);
      setCalculatedHash(null);
      setIsMatch(null);
    } else {
      setError(t("invalidPdfFile"));
      setSelectedFile(null);
    }
  };

  const handleCompareHash = async () => {
    if (!selectedFile) {
      setError(t("pleaseSelectFile"));
      return;
    }

    setIsCalculating(true);
    setError(null);

    try {
      const hash = await calculatePDFHash(selectedFile);
      setCalculatedHash(hash);

      // Compare hashes (case-insensitive)
      const match = hash.toLowerCase() === blockchainHash.toLowerCase();
      setIsMatch(match);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errorCalculatingHash"));
      setCalculatedHash(null);
      setIsMatch(null);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleDownloadFromUrl = async () => {
    if (!fileUrl) return;

    setIsCalculating(true);
    setError(null);

    try {
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error(t("errorDownloadingFile"));

      const blob = await response.blob();
      const file = new File([blob], `contract-${contractId}.pdf`, {
        type: "application/pdf",
      });

      const hash = await calculatePDFHash(file);
      setCalculatedHash(hash);

      const match = hash.toLowerCase() === blockchainHash.toLowerCase();
      setIsMatch(match);
      setSelectedFile(file);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errorProcessingFile"));
      setCalculatedHash(null);
      setIsMatch(null);
    } finally {
      setIsCalculating(false);
    }
  };

  const resetComparison = () => {
    setSelectedFile(null);
    setCalculatedHash(null);
    setIsMatch(null);
    setError(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 text-primary">
          <Shield className="h-4 w-4" />
          {label || t("verifyPdfHash")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("pdfHashComparison")}</DialogTitle>
          <DialogDescription>{t("pdfHashDescription")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Blockchain Hash Display */}
          <div className="space-y-2">
            <Label>{t("blockchainHash")}</Label>
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-xs font-mono break-all">{blockchainHash}</p>
            </div>
          </div>

          {/* File Upload Section */}
          <div className="space-y-2">
            <Label htmlFor="pdf-file">{t("selectPdfFile")}</Label>
            <div className="flex gap-2">
              <Input
                id="pdf-file"
                type="file"
                accept="application/pdf"
                onChange={handleFileSelect}
                disabled={isCalculating}
              />
              {fileUrl && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleDownloadFromUrl}
                  disabled={isCalculating}
                  className="whitespace-nowrap"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {t("useStoredFile")}
                </Button>
              )}
            </div>
            {selectedFile && (
              <p className="text-sm text-muted-foreground">
                {t("selectedFile")}: {selectedFile.name} (
                {(selectedFile.size / 1024).toFixed(2)} KB)
              </p>
            )}
          </div>

          {/* Compare Button */}
          <Button
            onClick={handleCompareHash}
            disabled={!selectedFile || isCalculating}
            className="w-full"
          >
            {isCalculating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("calculating")}
              </>
            ) : (
              t("compareHash")
            )}
          </Button>

          {/* Calculated Hash Display */}
          {calculatedHash && (
            <div className="space-y-2">
              <Label>{t("calculatedHash")}</Label>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-xs font-mono break-all">{calculatedHash}</p>
              </div>
            </div>
          )}

          {/* Comparison Result */}
          {isMatch !== null && (
            <Alert
              variant={isMatch ? "default" : "destructive"}
              className={
                isMatch
                  ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                  : ""
              }
            >
              {isMatch ? (
                <FileCheck2 className="h-4 w-4 text-green-600" />
              ) : (
                <FileX2 className="h-4 w-4" />
              )}
              <AlertTitle>
                {isMatch ? t("hashMatched") : t("hashMismatch")}
              </AlertTitle>
              <AlertDescription>
                {isMatch
                  ? t("hashMatchedDescription")
                  : t("hashMismatchDescription")}
              </AlertDescription>
            </Alert>
          )}

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <FileX2 className="h-4 w-4" />
              <AlertTitle>{t("error")}</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={resetComparison}
              className="text-primary"
            >
              {t("reset")}
            </Button>
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              {t("close")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
