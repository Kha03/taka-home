"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Bell, Lock, Globe, Shield, Trash2, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    contractNotifications: true,
    paymentNotifications: true,
    messageNotifications: true,

    // Privacy
    showEmail: false,
    showPhone: true,
    profileVisibility: "public",

    // Language & Region
    language: "vi",
    timezone: "Asia/Ho_Chi_Minh",
    currency: "VND",
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: Call API to save settings
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Thành công", "Đã lưu cài đặt");
    } catch {
      toast.error("Lỗi", "Không thể lưu cài đặt");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Cài đặt</h1>
        <p className="text-gray-600 mt-2">
          Quản lý thông báo, quyền riêng tư và cài đặt tài khoản
        </p>
      </div>

      {/* Notifications Settings */}
      <Card className="border-none shadow-sm bg-primary-foreground">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#DCBB87]" />
            <CardTitle>Thông báo</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Thông báo qua Email</Label>
              <p className="text-sm text-gray-500">
                Nhận thông báo quan trọng qua email
              </p>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(checked: boolean) =>
                setSettings({ ...settings, emailNotifications: checked })
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Thông báo đẩy</Label>
              <p className="text-sm text-gray-500">
                Nhận thông báo đẩy trên trình duyệt
              </p>
            </div>
            <Switch
              checked={settings.pushNotifications}
              onCheckedChange={(checked: boolean) =>
                setSettings({ ...settings, pushNotifications: checked })
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Thông báo SMS</Label>
              <p className="text-sm text-gray-500">
                Nhận thông báo khẩn cấp qua SMS
              </p>
            </div>
            <Switch
              checked={settings.smsNotifications}
              onCheckedChange={(checked: boolean) =>
                setSettings({ ...settings, smsNotifications: checked })
              }
            />
          </div>

          <Separator />

          <div className="space-y-4 pt-2">
            <h4 className="font-semibold text-sm">Loại thông báo</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="font-normal">Hợp đồng & Booking</Label>
                <Switch
                  checked={settings.contractNotifications}
                  onCheckedChange={(checked: boolean) =>
                    setSettings({ ...settings, contractNotifications: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="font-normal">Thanh toán</Label>
                <Switch
                  checked={settings.paymentNotifications}
                  onCheckedChange={(checked: boolean) =>
                    setSettings({ ...settings, paymentNotifications: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="font-normal">Tin nhắn</Label>
                <Switch
                  checked={settings.messageNotifications}
                  onCheckedChange={(checked: boolean) =>
                    setSettings({ ...settings, messageNotifications: checked })
                  }
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card className="border-none shadow-sm bg-primary-foreground">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#DCBB87]" />
            <CardTitle>Quyền riêng tư</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Hiển thị Email</Label>
              <p className="text-sm text-gray-500">
                Cho phép người khác xem email của bạn
              </p>
            </div>
            <Switch
              checked={settings.showEmail}
              onCheckedChange={(checked: boolean) =>
                setSettings({ ...settings, showEmail: checked })
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Hiển thị số điện thoại</Label>
              <p className="text-sm text-gray-500">
                Cho phép người khác xem số điện thoại
              </p>
            </div>
            <Switch
              checked={settings.showPhone}
              onCheckedChange={(checked: boolean) =>
                setSettings({ ...settings, showPhone: checked })
              }
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Hiển thị hồ sơ</Label>
            <Select
              value={settings.profileVisibility}
              onValueChange={(value) =>
                setSettings({ ...settings, profileVisibility: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-primary-foreground">
                <SelectItem value="public">Công khai</SelectItem>
                <SelectItem value="contacts">Chỉ liên hệ</SelectItem>
                <SelectItem value="private">Riêng tư</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500">
              Kiểm soát ai có thể xem hồ sơ của bạn
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Language & Region */}
      <Card className="border-none shadow-sm bg-primary-foreground">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#DCBB87]" />
            <CardTitle>Ngôn ngữ & Khu vực</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Ngôn ngữ</Label>
            <Select
              value={settings.language}
              onValueChange={(value) =>
                setSettings({ ...settings, language: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-primary-foreground">
                <SelectItem value="vi">Tiếng Việt</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Múi giờ</Label>
            <Select
              value={settings.timezone}
              onValueChange={(value) =>
                setSettings({ ...settings, timezone: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-primary-foreground">
                <SelectItem value="Asia/Ho_Chi_Minh">
                  (GMT+7) Hồ Chí Minh
                </SelectItem>
                <SelectItem value="Asia/Bangkok">(GMT+7) Bangkok</SelectItem>
                <SelectItem value="Asia/Singapore">
                  (GMT+8) Singapore
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Tiền tệ</Label>
            <Select
              value={settings.currency}
              onValueChange={(value) =>
                setSettings({ ...settings, currency: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-primary-foreground">
                <SelectItem value="VND">VND (₫)</SelectItem>
                <SelectItem value="USD">USD ($)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="border-none shadow-sm bg-primary-foreground">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#DCBB87]" />
            <CardTitle>Bảo mật</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Đổi mật khẩu</Label>
            <div className="space-y-3 mt-2">
              <Input type="password" placeholder="Mật khẩu hiện tại" />
              <Input type="password" placeholder="Mật khẩu mới" />
              <Input type="password" placeholder="Xác nhận mật khẩu mới" />
              <Button variant="outline" className="w-full text-primary">
                <Lock className="w-4 h-4 mr-2" />
                Cập nhật mật khẩu
              </Button>
            </div>
          </div>

          <Separator />

          <div>
            <Label>Xác thực hai yếu tố</Label>
            <p className="text-sm text-gray-500 mb-3">
              Thêm lớp bảo mật bổ sung cho tài khoản
            </p>
            <Button variant="outline" className="w-full text-primary">
              <Shield className="w-4 h-4 mr-2" />
              Bật xác thực 2FA
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200 shadow-sm bg-primary-foreground">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-red-600" />
            <CardTitle className="text-red-600">Vùng nguy hiểm</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Xóa tài khoản</h4>
            <p className="text-sm text-gray-600 mb-3">
              Sau khi xóa, tài khoản của bạn sẽ không thể khôi phục. Vui lòng
              cân nhắc kỹ.
            </p>
            <Button variant="destructive" className="w-full">
              <Trash2 className="w-4 h-4 mr-2" />
              Xóa tài khoản vĩnh viễn
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" className="text-primary">
          Đặt lại
        </Button>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-[#DCBB87] hover:bg-[#B8935A]"
        >
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
        </Button>
      </div>
    </div>
  );
}
