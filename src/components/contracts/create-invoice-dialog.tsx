"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import {
  invoiceService,
  ServiceTypeEnum,
  type ServiceItem,
  type CreateInvoiceRequest,
  type CreateUtilityBillRequest,
} from "@/lib/api/services/invoice";
import { getApiErrorMessage } from "@/lib/utils/error-handler";
import { Upload, X, Plus, Trash2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/utils";
import { formatCurrency } from "@/lib/api";

interface CreateInvoiceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  contractId: string;
  propertyType: "APARTMENT" | "BOARDING";
  onSuccess?: () => void;
  isLiquidation?: boolean;
}

const SERVICE_TYPE_LABELS: Record<ServiceTypeEnum, string> = {
  [ServiceTypeEnum.ELECTRICITY]: "Tiền điện",
  [ServiceTypeEnum.WATER]: "Tiền nước",
  [ServiceTypeEnum.PARKING]: "Tiền giữ xe",
  [ServiceTypeEnum.INTERNET]: "Tiền internet",
  [ServiceTypeEnum.CLEANING]: "Tiền vệ sinh",
  [ServiceTypeEnum.SECURITY]: "Tiền bảo vệ",
  [ServiceTypeEnum.DAMAGE_COMPENSATION]: "Bồi thường thiệt hại",
  [ServiceTypeEnum.OTHER]: "Khác",
};

export function CreateInvoiceDialog({
  isOpen,
  onClose,
  contractId,
  propertyType,
  onSuccess,
  isLiquidation = false,
}: CreateInvoiceDialogProps) {
  // Common states
  const [dueDate, setDueDate] = useState("");
  const [billingPeriod, setBillingPeriod] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Apartment states (upload invoice)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedInvoiceData, setProcessedInvoiceData] = useState<{
    supplierName?: string;
    supplierPhone?: string;
    receiverName?: string;
    totalAmount?: number;
    netAmount?: number;
    invoiceType?: string;
  }>({});
  const [invoiceItems, setInvoiceItems] = useState<
    { description: string; amount: number; serviceType: ServiceTypeEnum }[]
  >([]);
  const [isInvoiceItemsEditable, setIsInvoiceItemsEditable] = useState(true);

  // Boarding states (manual service selection)
  const [services, setServices] = useState<ServiceItem[]>([
    {
      serviceType: isLiquidation
        ? ServiceTypeEnum.DAMAGE_COMPENSATION
        : ServiceTypeEnum.CLEANING,
      amount: 0,
      description: "",
    },
  ]);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chỉ upload file ảnh");
      return;
    }

    setUploadedFile(file);
    setIsProcessing(true);

    try {
      const response = await invoiceService.processInvoice(file);
      if (!response.data) {
        throw new Error("No data returned from API");
      }

      // Xử lý dữ liệu trích xuất
      const processed: {
        supplierName?: string;
        supplierPhone?: string;
        receiverName?: string;
        totalAmount?: number;
        netAmount?: number;
        invoiceType?: string;
      } = {};

      response.data.extractedData.forEach((data) => {
        const name = data.name.toLowerCase();

        if (name.includes("supplier_name")) {
          processed.supplierName = data.value;
        } else if (name.includes("supplier_phone")) {
          processed.supplierPhone = data.value;
        } else if (name.includes("receiver_name")) {
          processed.receiverName = data.value;
        } else if (name.includes("total_amount")) {
          // Remove all non-digit characters (including dots, commas) then parse
          const amount = parseFloat(data.value.replace(/[^\d]/g, ""));
          if (!isNaN(amount)) {
            processed.totalAmount = Math.round(amount); // Convert to integer
          }
        } else if (name.includes("net_amount")) {
          // Remove all non-digit characters (including dots, commas) then parse
          const amount = parseFloat(data.value.replace(/[^\d]/g, ""));
          if (!isNaN(amount)) {
            processed.netAmount = Math.round(amount); // Convert to integer
          }
        } else if (name.includes("invoice_type")) {
          processed.invoiceType = data.value;
        }
      });

      setProcessedInvoiceData(processed);

      // Tạo một mục hóa đơn duy nhất từ dữ liệu trích xuất
      const amount = processed.totalAmount || processed.netAmount || 0;
      const description = processed.invoiceType || "Hóa đơn thanh toán";

      setInvoiceItems([
        {
          description: description,
          amount: amount,
          serviceType: ServiceTypeEnum.ELECTRICITY, // Default service type
        },
      ]);

      // Không cho phép chỉnh sửa nếu là hóa đơn điện/nước/gas tự động
      const autoInvoiceTypes = [
        "điện",
        "nước",
        "gas",
        "electricity",
        "water",
        "electric",
      ];
      const isAutoInvoice = autoInvoiceTypes.some((type) =>
        processed.invoiceType?.toLowerCase().includes(type)
      );
      setIsInvoiceItemsEditable(!isAutoInvoice);

      toast.success("Đã xử lý hóa đơn thành công");
    } catch (error) {
      console.error("Error processing invoice:", error);
      toast.error("Không thể xử lý hóa đơn. Vui lòng thử lại");
      setUploadedFile(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setProcessedInvoiceData({});
    setInvoiceItems([]);
    setIsInvoiceItemsEditable(true);
  };

  const handleAddInvoiceItem = () => {
    setInvoiceItems([
      ...invoiceItems,
      { description: "", amount: 0, serviceType: ServiceTypeEnum.OTHER },
    ]);
  };

  const handleRemoveInvoiceItem = (index: number) => {
    setInvoiceItems(invoiceItems.filter((_, i) => i !== index));
  };

  const handleInvoiceItemChange = (
    index: number,
    field: "description" | "amount" | "serviceType",
    value: string | number | ServiceTypeEnum
  ) => {
    const newItems = [...invoiceItems];
    if (field === "amount") {
      newItems[index][field] = Math.round(Number(value)); // Ensure integer
    } else if (field === "serviceType") {
      newItems[index][field] = value as ServiceTypeEnum;
    } else {
      newItems[index][field] = String(value);
    }
    setInvoiceItems(newItems);
  };

  const handleAddService = () => {
    setServices([
      ...services,
      {
        serviceType: ServiceTypeEnum.OTHER,
        amount: 0,
        description: "",
      },
    ]);
  };

  const handleRemoveService = (index: number) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const handleServiceChange = (
    index: number,
    field: keyof ServiceItem,
    value: string | number
  ) => {
    const newServices = [...services];
    if (field === "serviceType") {
      newServices[index][field] = value as ServiceTypeEnum;
      // Reset fields based on service type
      if (value === ServiceTypeEnum.ELECTRICITY) {
        newServices[index].KwhNo = 0;
        delete newServices[index].M3No;
        delete newServices[index].amount;
      } else if (value === ServiceTypeEnum.WATER) {
        newServices[index].M3No = 0;
        delete newServices[index].KwhNo;
        delete newServices[index].amount;
      } else {
        newServices[index].amount = 0;
        delete newServices[index].KwhNo;
        delete newServices[index].M3No;
      }
    } else if (field === "KwhNo" || field === "M3No" || field === "amount") {
      newServices[index][field] = Math.round(Number(value)); // Ensure integer
    } else {
      newServices[index][field] = String(value);
    }
    setServices(newServices);
  };

  const validateApartmentForm = () => {
    if (!dueDate) {
      toast.error("Vui lòng chọn hạn thanh toán");
      return false;
    }
    if (!uploadedFile) {
      toast.error("Vui lòng upload hóa đơn");
      return false;
    }
    if (invoiceItems.length === 0) {
      toast.error("Vui lòng thêm ít nhất một mục thanh toán");
      return false;
    }
    for (const item of invoiceItems) {
      if (!item.description.trim()) {
        toast.error("Vui lòng điền mô tả cho tất cả các mục");
        return false;
      }
      if (item.amount <= 0) {
        toast.error("Số tiền phải lớn hơn 0");
        return false;
      }
    }
    return true;
  };

  const validateBoardingForm = () => {
    if (!dueDate) {
      toast.error("Vui lòng chọn hạn thanh toán");
      return false;
    }
    if (!billingPeriod) {
      toast.error("Vui lòng chọn kỳ thanh toán");
      return false;
    }
    if (services.length === 0) {
      toast.error("Vui lòng thêm ít nhất một dịch vụ");
      return false;
    }
    for (const service of services) {
      if (service.serviceType === ServiceTypeEnum.ELECTRICITY) {
        if (!service.KwhNo || service.KwhNo <= 0) {
          toast.error("Vui lòng nhập số KWh cho dịch vụ điện");
          return false;
        }
      } else if (service.serviceType === ServiceTypeEnum.WATER) {
        if (!service.M3No || service.M3No <= 0) {
          toast.error("Vui lòng nhập số M³ cho dịch vụ nước");
          return false;
        }
      } else {
        if (!service.amount || service.amount <= 0) {
          toast.error("Vui lòng nhập số tiền cho dịch vụ");
          return false;
        }
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (propertyType === "APARTMENT") {
      if (!validateApartmentForm()) return;

      setIsSubmitting(true);
      try {
        const request: CreateInvoiceRequest = {
          contractId,
          dueDate,
          items: invoiceItems,
        };

        await invoiceService.createInvoice(request);
        toast.success("Tạo hóa đơn thành công");
        onSuccess?.();
        handleClose();
      } catch (error) {
        console.error("Error creating invoice:", error);
        const errorMessage = getApiErrorMessage(
          error,
          "Không thể tạo hóa đơn. Vui lòng thử lại"
        );
        toast.error(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // BOARDING
      if (!validateBoardingForm()) return;

      setIsSubmitting(true);
      try {
        const request: CreateUtilityBillRequest = {
          contractId,
          dueDate,
          billingPeriod,
          services,
        };

        await invoiceService.createUtilityBill(request);
        toast.success("Tạo hóa đơn phòng trọ thành công");
        onSuccess?.();
        handleClose();
      } catch (error) {
        console.error("Error creating utility bill:", error);
        const errorMessage = getApiErrorMessage(
          error,
          "Không thể tạo hóa đơn. Vui lòng thử lại"
        );
        toast.error(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleClose = () => {
    setDueDate("");
    setBillingPeriod("");
    setUploadedFile(null);
    setProcessedInvoiceData({});
    setInvoiceItems([]);
    setIsInvoiceItemsEditable(true);
    setServices([
      {
        serviceType: isLiquidation
          ? ServiceTypeEnum.DAMAGE_COMPENSATION
          : ServiceTypeEnum.CLEANING,
        amount: 0,
        description: "",
      },
    ]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isLiquidation
              ? "Tạo hóa đơn thanh lý"
              : propertyType === "APARTMENT"
              ? "Tạo hóa đơn căn hộ"
              : "Tạo hóa đơn phòng trọ"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Common fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dueDate">
                Hạn thanh toán <span className="text-red-500">*</span>
              </Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="mt-2"
              />
            </div>
            {propertyType === "BOARDING" && (
              <div>
                <Label htmlFor="billingPeriod">
                  Kỳ thanh toán <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="billingPeriod"
                  type="month"
                  value={billingPeriod}
                  onChange={(e) => setBillingPeriod(e.target.value)}
                  className="mt-2"
                />
              </div>
            )}
          </div>

          {/* APARTMENT: Upload invoice */}
          {propertyType === "APARTMENT" && (
            <div className="space-y-4">
              <div>
                <Label>
                  Upload hóa đơn <span className="text-red-500">*</span>
                </Label>
                <div
                  className={cn(
                    "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors",
                    uploadedFile && "border-primary bg-primary/5"
                  )}
                  onClick={() =>
                    document.getElementById("invoice-upload")?.click()
                  }
                >
                  <input
                    id="invoice-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                    disabled={isProcessing}
                  />
                  {isProcessing ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                      <p className="text-sm text-muted-foreground">
                        Đang xử lý hóa đơn...
                      </p>
                    </div>
                  ) : uploadedFile ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Upload className="w-5 h-5 text-primary" />
                        <span className="text-sm">{uploadedFile.name}</span>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFile();
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="w-8 h-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Click để upload ảnh hóa đơn
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Show processed invoice data */}
              {Object.keys(processedInvoiceData).length > 0 && (
                <Card className="bg-primary-foreground">
                  <CardContent>
                    <h4 className="font-semibold mb-3">
                      Thông tin hóa đơn đã trích xuất:
                    </h4>
                    <div className="grid grid-cols-1 gap-3">
                      {processedInvoiceData.supplierName && (
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">
                            Nhà cung cấp:
                          </span>
                          <span className="text-sm">
                            {processedInvoiceData.supplierName}
                          </span>
                        </div>
                      )}
                      {processedInvoiceData.supplierPhone && (
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">
                            Số điện thoại:
                          </span>
                          <span className="text-sm">
                            {processedInvoiceData.supplierPhone}
                          </span>
                        </div>
                      )}
                      {processedInvoiceData.receiverName && (
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">
                            Người nhận:
                          </span>
                          <span className="text-sm">
                            {processedInvoiceData.receiverName}
                          </span>
                        </div>
                      )}
                      {processedInvoiceData.invoiceType && (
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">
                            Loại hóa đơn:
                          </span>
                          <span className="text-sm">
                            {processedInvoiceData.invoiceType}
                          </span>
                        </div>
                      )}
                      {(processedInvoiceData.totalAmount ||
                        processedInvoiceData.netAmount) && (
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">
                            Tổng tiền:
                          </span>
                          <span className="text-sm font-semibold text-green-600">
                            {formatCurrency(
                              processedInvoiceData.totalAmount ||
                                processedInvoiceData.netAmount ||
                                0
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Invoice items */}
              {uploadedFile && (
                <div className="space-y-3">
                  {!isInvoiceItemsEditable && (
                    <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-md border border-amber-200">
                      ℹ️ Hóa đơn này đã được xử lý tự động. Bạn không thể chỉnh
                      sửa thông tin chi tiết.
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <Label>
                      Chi tiết hóa đơn <span className="text-red-500">*</span>
                    </Label>
                    {isInvoiceItemsEditable && (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={handleAddInvoiceItem}
                        className="text-primary"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Thêm mục
                      </Button>
                    )}
                  </div>

                  {invoiceItems.map((item, index) => (
                    <div key={index} className="flex gap-2 items-start">
                      <div className="flex-1">
                        <Input
                          placeholder="Mô tả"
                          value={item.description}
                          onChange={(e) =>
                            handleInvoiceItemChange(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                          disabled={!isInvoiceItemsEditable}
                        />
                      </div>
                      <div className="w-40">
                        <Select
                          value={item.serviceType}
                          onValueChange={(value) =>
                            handleInvoiceItemChange(
                              index,
                              "serviceType",
                              value as ServiceTypeEnum
                            )
                          }
                          disabled={!isInvoiceItemsEditable}
                        >
                          <SelectTrigger className="truncate">
                            <SelectValue
                              placeholder="Loại dịch vụ"
                              className="truncate"
                            />
                          </SelectTrigger>
                          <SelectContent className="bg-primary-foreground">
                            {Object.entries(SERVICE_TYPE_LABELS).map(
                              ([value, label]) => (
                                <SelectItem
                                  key={value}
                                  value={value}
                                  className="truncate"
                                >
                                  {label}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="w-32">
                        <Input
                          type="number"
                          placeholder="Số tiền"
                          value={item.amount}
                          onChange={(e) =>
                            handleInvoiceItemChange(
                              index,
                              "amount",
                              e.target.value
                            )
                          }
                          min="0"
                          disabled={!isInvoiceItemsEditable}
                        />
                      </div>
                      {invoiceItems.length > 1 && isInvoiceItemsEditable && (
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemoveInvoiceItem(index)}
                          className="hover:bg-transparent"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* BOARDING: Service selection */}
          {propertyType === "BOARDING" && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label>
                  Dịch vụ <span className="text-red-500">*</span>
                </Label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleAddService}
                  className="text-primary"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Thêm dịch vụ
                </Button>
              </div>

              {services.map((service, index) => (
                <Card key={index} className="bg-primary-foreground">
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex gap-2 items-start">
                        <div className="flex-1">
                          <Label className="mb-1">Loại dịch vụ</Label>
                          <Select
                            value={service.serviceType}
                            onValueChange={(value) =>
                              handleServiceChange(
                                index,
                                "serviceType",
                                value as ServiceTypeEnum
                              )
                            }
                          >
                            <SelectTrigger className="truncate">
                              <SelectValue className="truncate" />
                            </SelectTrigger>
                            <SelectContent className="bg-primary-foreground">
                              {Object.entries(SERVICE_TYPE_LABELS).map(
                                ([key, label]) => (
                                  <SelectItem
                                    key={key}
                                    value={key}
                                    className="truncate"
                                  >
                                    {label}
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>
                        </div>

                        {services.length > 1 && (
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            className="mt-6 hover:bg-transparent"
                            onClick={() => handleRemoveService(index)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        )}
                      </div>

                      {service.serviceType === ServiceTypeEnum.ELECTRICITY && (
                        <div>
                          <Label className="mb-1">Số KWh</Label>
                          <Input
                            type="number"
                            placeholder="Nhập số KWh"
                            value={service.KwhNo || ""}
                            onChange={(e) =>
                              handleServiceChange(
                                index,
                                "KwhNo",
                                e.target.value
                              )
                            }
                            min="0"
                          />
                        </div>
                      )}

                      {service.serviceType === ServiceTypeEnum.WATER && (
                        <div>
                          <Label className="mb-1">Số M³</Label>
                          <Input
                            type="number"
                            placeholder="Nhập số M³"
                            value={service.M3No || ""}
                            onChange={(e) =>
                              handleServiceChange(index, "M3No", e.target.value)
                            }
                            min="0"
                          />
                        </div>
                      )}

                      {service.serviceType !== ServiceTypeEnum.ELECTRICITY &&
                        service.serviceType !== ServiceTypeEnum.WATER && (
                          <div>
                            <Label className="mb-1">Số tiền</Label>
                            <Input
                              type="number"
                              placeholder="Nhập số tiền"
                              value={service.amount || ""}
                              onChange={(e) =>
                                handleServiceChange(
                                  index,
                                  "amount",
                                  e.target.value
                                )
                              }
                              min="0"
                            />
                          </div>
                        )}

                      <div>
                        <Label className="mb-1">Ghi chú (Tùy chọn)</Label>
                        <Textarea
                          placeholder="Nhập ghi chú"
                          value={service.description || ""}
                          onChange={(e) =>
                            handleServiceChange(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                          rows={2}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            className="border-red-500 text-red-500"
          >
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang tạo...
              </>
            ) : (
              "Tạo hóa đơn"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
