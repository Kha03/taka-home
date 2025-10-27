"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, Download, Calendar } from "lucide-react";
import { contractService, ExtensionFileUrl } from "@/lib/api/services/contract";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";

interface ContractFileSelectorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contractId: string;
}

export function ContractFileSelectorDialog({
  open,
  onOpenChange,
  contractId,
}: ContractFileSelectorDialogProps) {
  const [loading, setLoading] = useState(false);
  const [mainFileUrl, setMainFileUrl] = useState<string | null>(null);
  const [extensionFiles, setExtensionFiles] = useState<ExtensionFileUrl[]>([]);

  useEffect(() => {
    if (open && contractId) {
      const fetchFiles = async () => {
        setLoading(true);
        try {
          const response = await contractService.getFileUrl(contractId);

          if (response.data) {
            setMainFileUrl(response.data.fileUrl);
            setExtensionFiles(response.data.extensionFileUrls || []);
          }
        } catch (error) {
          console.error("Error fetching contract files:", error);
          toast.error("Không thể tải danh sách hợp đồng");
        } finally {
          setLoading(false);
        }
      };

      void fetchFiles();
    }
  }, [open, contractId]);

  const handleDownload = (url: string, fileName: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Chọn hợp đồng để xem</DialogTitle>
          <DialogDescription>
            Chọn hợp đồng gốc hoặc hợp đồng gia hạn để tải về
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              {/* Main Contract */}
              {mainFileUrl && (
                <Card className="border-2 border-primary/20 hover:border-primary/40 transition-colors bg-primary-foreground">
                  <CardContent>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <FileText className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-semibold text-base">
                            Hợp đồng gốc
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Hợp đồng thuê ban đầu
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 text-primary"
                        onClick={() =>
                          handleDownload(
                            mainFileUrl,
                            `hop-dong-goc-${contractId.slice(0, 8)}.pdf`
                          )
                        }
                      >
                        <Download className="h-4 w-4" />
                        Tải xuống
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Extension Contracts */}
              {extensionFiles.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Hợp đồng gia hạn ({extensionFiles.length})
                  </h3>
                  {extensionFiles.map((file, index) => (
                    <Card
                      key={file.extensionId}
                      className="border-2 border-blue-200/50 hover:border-blue-300 transition-colors bg-primary-foreground"
                    >
                      <CardContent>
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                            <div>
                              <p className="font-semibold text-base">
                                Hợp đồng gia hạn #
                                {extensionFiles.length - index}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Ngày ký: {formatDate(file.createdAt)}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 text-primary"
                            onClick={() =>
                              handleDownload(
                                file.fileUrl,
                                `hop-dong-gia-han-${file.extensionId.slice(
                                  0,
                                  8
                                )}.pdf`
                              )
                            }
                          >
                            <Download className="h-4 w-4" />
                            Tải xuống
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {!mainFileUrl && extensionFiles.length === 0 && !loading && (
                <div className="text-center py-8 text-muted-foreground">
                  Không tìm thấy file hợp đồng
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
