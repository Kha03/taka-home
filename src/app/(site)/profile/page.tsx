"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Camera,
  Mail,
  Phone,
  Calendar,
  CreditCard,
  Save,
  Loader2,
  Upload,
  CheckCircle2,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { getAccountFromStorage } from "@/lib/utils/auth-utils";
import type { Account } from "@/lib/api/types";
import { authService } from "@/lib/api/services/auth";

interface ProfileFormData {
  fullName: string;
  email: string;
  phone: string;
  cccd: string;
  bio: string;
  avatarUrl: string;
}

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingCCCD, setIsUploadingCCCD] = useState(false);
  const [account, setAccount] = useState<Account | null>(null);
  const [formData, setFormData] = useState<ProfileFormData>({
    fullName: "",
    email: "",
    phone: "",
    cccd: "",
    bio: "",
    avatarUrl: "",
  });
  const [avatarPreview, setAvatarPreview] = useState<string>("");

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      try {
        const accountData = getAccountFromStorage();
        if (accountData) {
          setAccount(accountData);
          setFormData({
            fullName: accountData.user?.fullName || "",
            email: accountData.email || "",
            phone: accountData.user?.phone || "",
            cccd: accountData.user?.CCCD || "",
            bio: "", // TODO: Add bio to user model
            avatarUrl: accountData.user?.avatarUrl || "",
          });
          setAvatarPreview(
            accountData.user?.avatarUrl || "/assets/imgs/avatar.png"
          );
        }
      } catch {
        toast.error("Lỗi", "Không thể tải thông tin tài khoản");
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Lỗi", "Kích thước ảnh không được vượt quá 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Lỗi", "Vui lòng chọn file ảnh");
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // TODO: Upload to server
      // uploadAvatar(file);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: Call API to update profile
      // await userService.updateProfile(formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update localStorage
      if (account) {
        const updatedAccount = {
          ...account,
          user: {
            ...account.user,
            fullName: formData.fullName,
            phone: formData.phone,
            avatarUrl: formData.avatarUrl || account.user.avatarUrl,
          },
        };
        localStorage.setItem("account_info", JSON.stringify(updatedAccount));
        setAccount(updatedAccount);
      }

      toast.success("Thành công", "Cập nhật thông tin cá nhân thành công");
    } catch {
      toast.error("Lỗi", "Không thể cập nhật thông tin");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCCCDUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Lỗi", "Kích thước ảnh không được vượt quá 10MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Lỗi", "Vui lòng chọn file ảnh");
      return;
    }

    setIsUploadingCCCD(true);
    try {
      // Gọi API recognize CCCD
      const response = await authService.recognizeCCCD(file);

      if (response.code === 200 && response.data) {
        const { id, name, dob, address } = response.data;

        // Chỉ cập nhật isVerified trong localStorage và state
        if (account) {
          const updatedAccount = {
            ...account,
            isVerified: true,
          };
          localStorage.setItem("account_info", JSON.stringify(updatedAccount));
          setAccount(updatedAccount);
        }

        // Hiển thị thông báo với thông tin nhận dạng được
        toast.success(
          "Xác thực CCCD thành công!",
          `Thông tin nhận dạng:\n• Số CCCD: ${id}\n• Họ tên: ${name}\n• Ngày sinh: ${dob}\n• Địa chỉ: ${address}`
        );
      } else {
        throw new Error(response.message || "Upload failed");
      }
    } catch (error) {
      console.error("CCCD upload error:", error);
      toast.error(
        "Lỗi",
        error instanceof Error
          ? error.message
          : "Không thể xác thực CCCD. Vui lòng thử lại."
      );
    } finally {
      setIsUploadingCCCD(false);
      // Reset input
      e.target.value = "";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#DCBB87]" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div>
        <h2 className="text-primary mt-2 font-bold text-3xl">
          Thông tin cá nhân
        </h2>
      </div>

      {/* Avatar Section */}
      <Card className="border-none shadow-sm bg-primary-foreground">
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative group">
              <Avatar className="w-32 h-32 border-4 border-[#DCBB87]/20">
                <AvatarImage src={avatarPreview} alt="Avatar" />
                <AvatarFallback className="bg-gradient-to-br from-[#DCBB87] to-[#B8935A] text-white text-3xl">
                  {formData.fullName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <label
                htmlFor="avatar-upload"
                className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <Camera className="w-8 h-8 text-white" />
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-xl font-bold text-gray-900">
                {formData.fullName || "Chưa cập nhật"}
              </h3>
              <p className="text-gray-600 mt-1">{formData.email}</p>
              <p className="text-sm text-gray-500 mt-2">
                {account?.roles?.[0] === "LANDLORD" ? "Chủ nhà" : "Người thuê"}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3 text-primary"
                onClick={() =>
                  document.getElementById("avatar-upload")?.click()
                }
              >
                <Camera className="w-4 h-4 mr-2" />
                Thay đổi ảnh đại diện
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information Form */}
      <Card className="border-none shadow-sm bg-primary-foreground">
        <CardHeader>
          <CardTitle>Thông tin cơ bản</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName">
                Họ và tên <span className="text-red-500">*</span>
              </Label>
              <Input
                id="fullName"
                name="fullName"
                placeholder="Nguyễn Văn A"
                value={formData.fullName}
                onChange={handleInputChange}
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  className="pl-10"
                  value={formData.email}
                  disabled
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">
                Số điện thoại <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="0912345678"
                  className="pl-10"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* CCCD */}
            <div className="space-y-2">
              <Label htmlFor="cccd">CCCD/CMND</Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="cccd"
                  name="cccd"
                  placeholder="001234567890"
                  className="pl-10"
                  value={formData.cccd}
                  disabled
                />
              </div>
              {!account?.isVerified && (
                <div className="mt-2">
                  <label
                    htmlFor="cccd-upload"
                    className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors ${
                      isUploadingCCCD
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-[#DCBB87] text-white hover:bg-[#B8935A]"
                    }`}
                  >
                    {isUploadingCCCD ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        Upload ảnh CCCD để xác thực
                      </>
                    )}
                  </label>
                  <input
                    id="cccd-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleCCCDUpload}
                    disabled={isUploadingCCCD}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Upload ảnh mặt trước CCCD để xác thực tài khoản
                  </p>
                </div>
              )}
            </div>

            {/* Bio */}
            {account?.roles?.[0] === "LANDLORD" && (
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="bio">Giới thiệu bản thân</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  placeholder="Viết vài dòng giới thiệu về bản thân..."
                  rows={4}
                  value={formData.bio}
                  onChange={handleInputChange}
                />
                <p className="text-xs text-gray-500">
                  Giới thiệu này sẽ giúp người thuê hiểu rõ hơn về bạn
                </p>
              </div>
            )}
          </div>

          {/* Account Info */}
          <div className="pt-6 border-t">
            <h4 className="font-semibold text-gray-900 mb-4">
              Thông tin tài khoản
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-[#DCBB87]/20 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-[#DCBB87]" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Ngày tham gia</p>
                  <p className="font-semibold text-gray-900">
                    {account?.createdAt
                      ? new Date(account.createdAt).toLocaleDateString()
                      : "—"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    account?.isVerified ? "bg-green-100" : "bg-yellow-100"
                  }`}
                >
                  {account?.isVerified ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : (
                    <CreditCard className="w-5 h-5 text-yellow-600" />
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-600">Trạng thái xác thực</p>
                  <p
                    className={`font-semibold ${
                      account?.isVerified ? "text-green-600" : "text-yellow-600"
                    }`}
                  >
                    {account?.isVerified ? "Đã xác thực" : "Chưa xác thực"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="text-red-500 border-red-500"
            >
              Hủy bỏ
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-[#DCBB87] hover:bg-[#B8935A]"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Lưu thay đổi
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
