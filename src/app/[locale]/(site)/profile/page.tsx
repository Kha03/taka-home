"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  Video,
  RotateCcw,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { getAccountFromStorage } from "@/lib/utils/auth-utils";
import type { Account } from "@/lib/api/types";
import { authService } from "@/lib/api/services/auth";
import { usersService } from "@/lib/api/services";
import { useAuth } from "@/contexts/auth-context";

interface ProfileFormData {
  fullName: string;
  email: string;
  phone: string;
  cccd: string;
  bio: string;
  avatarUrl: string;
}

export default function ProfilePage() {
  const t = useTranslations("profile");
  const tCommon = useTranslations("common");
  const { user: authUser, updateUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
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
  const [faceImage, setFaceImage] = useState<File | null>(null);
  const [cccdImage, setCccdImage] = useState<File | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
        }
      } catch {
        toast.error(tCommon("error"), t("errors.cannotLoadProfile"));
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

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(tCommon("error"), t("errors.imageTooLarge"));
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error(tCommon("error"), t("errors.selectImageFile"));
        return;
      }

      // Upload to server
      setIsUploadingAvatar(true);
      try {
        const response = await usersService.uploadAvatar(file);

        if (response.code === 200 && response.data?.user?.avatarUrl) {
          const avatarUrl = response.data.user.avatarUrl;

          // Update formData
          setFormData((prev) => ({ ...prev, avatarUrl }));

          // Update account_info
          if (account) {
            const updatedAccount = {
              ...account,
              user: {
                ...account.user,
                avatarUrl,
              },
            };
            localStorage.setItem(
              "account_info",
              JSON.stringify(updatedAccount)
            );
            setAccount(updatedAccount);
          }

          // Update AuthContext - this will sync to header
          updateUser({ avatarUrl });

          toast.success(tCommon("success"), t("success.avatarUpdated"));
        } else {
          throw new Error(response.message || t("errors.cannotUploadAvatar"));
        }
      } catch (error) {
        console.error("Upload avatar error:", error);
        toast.error(
          tCommon("error"),
          error instanceof Error
            ? error.message
            : t("errors.cannotUploadAvatar")
        );
      } finally {
        setIsUploadingAvatar(false);
      }
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Validate phone number
      if (!formData.phone || formData.phone.trim() === "") {
        toast.error(tCommon("error"), t("errors.phoneRequired"));
        return;
      }

      // Validate phone format (10-11 digits)
      if (!/^[0-9]{10,11}$/.test(formData.phone)) {
        toast.error(tCommon("error"), t("errors.phoneFormat"));
        return;
      }

      if (!account?.user?.id) {
        toast.error(tCommon("error"), t("errors.userNotFound"));
        return;
      }

      // Call API to update profile (only phone)
      const response = await usersService.updateUser(account.user.id, {
        phone: formData.phone,
      });

      if (response.code === 200 && response.data) {
        // Update localStorage
        const updatedAccount = {
          ...account,
          user: {
            ...account.user,
            phone: response.data.phone,
          },
        };
        localStorage.setItem("account_info", JSON.stringify(updatedAccount));
        setAccount(updatedAccount);

        toast.success(tCommon("success"), t("success.phoneUpdated"));
      } else {
        throw new Error(response.message || t("errors.cannotUpdateProfile"));
      }
    } catch (error) {
      console.error("Update profile error:", error);
      toast.error(
        tCommon("error"),
        error instanceof Error ? error.message : t("errors.cannotUpdateProfile")
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCCCDUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error(tCommon("error"), t("errors.imageTooLargeCCCD"));
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error(tCommon("error"), t("errors.selectImageFile"));
      return;
    }

    // Store CCCD image
    setCccdImage(file);

    // Reset input
    e.target.value = "";
  };

  // Hàm mở camera
  const openCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
      });
      setStream(mediaStream);
      setIsCameraOpen(true);
      setCapturedImage(null);

      // Wait for dialog to render then attach stream
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      }, 100);
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast.error(tCommon("error"), t("errors.cannotAccessCamera"));
    }
  };

  // Hàm đóng camera
  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsCameraOpen(false);
    setCapturedImage(null);
  };

  // Hàm chụp ảnh
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(video, 0, 0);
        const imageDataUrl = canvas.toDataURL("image/jpeg");
        setCapturedImage(imageDataUrl);
      }
    }
  };

  // Hàm chụp lại
  const retakePhoto = () => {
    setCapturedImage(null);
  };

  // Hàm xác nhận ảnh và chuyển thành File
  const confirmPhoto = () => {
    if (capturedImage) {
      // Convert base64 to File
      fetch(capturedImage)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], "face-photo.jpg", {
            type: "image/jpeg",
          });
          setFaceImage(file);
          closeCamera();
          toast.success(tCommon("success"), t("success.facePhotoCaptured"));
        })
        .catch((error) => {
          console.error("Error converting image:", error);
          toast.error(tCommon("error"), t("errors.cannotSavePhoto"));
        });
    }
  };

  // Cleanup khi component unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  const handleVerifyIdentity = async () => {
    if (!faceImage || !cccdImage) {
      toast.error(tCommon("error"), t("errors.uploadBothImages"));
      return;
    }

    setIsUploadingCCCD(true);
    try {
      // Gọi API verify face with CCCD
      const response = await authService.verifyFaceWithCCCD(
        faceImage,
        cccdImage
      );

      if (response.code === 200 && response.data) {
        const { isMatch, cccdInfo } = response.data;

        if (!isMatch) {
          toast.error(t("errors.verificationFailed"), t("errors.faceNotMatch"));
          return;
        }

        // Cập nhật isVerified, CCCD và fullName trong localStorage và state
        if (account) {
          const updatedAccount = {
            ...account,
            isVerified: true,
            user: {
              ...account.user,
              fullName: cccdInfo.name || account.user.fullName, // Set fullName từ CCCD
              CCCD: cccdInfo.id, // Set CCCD từ response
            },
          };
          localStorage.setItem("account_info", JSON.stringify(updatedAccount));
          setAccount(updatedAccount);

          // Cập nhật formData để hiển thị CCCD và fullName trên UI
          setFormData((prev) => ({
            ...prev,
            fullName: cccdInfo.name || prev.fullName,
            cccd: cccdInfo.id,
          }));
        }

        // Hiển thị thông báo với thông tin nhận dạng được
        toast.success(t("success.verificationSuccess"));

        // Reset images after successful verification
        setFaceImage(null);
        setCccdImage(null);
      } else {
        throw new Error(response.message || t("errors.verificationFailed"));
      }
    } catch (error) {
      console.error("Identity verification error:", error);
      toast.error(
        tCommon("error"),
        error instanceof Error
          ? error.message
          : t("errors.cannotVerifyIdentity")
      );
    } finally {
      setIsUploadingCCCD(false);
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
        <h2 className="text-primary mt-2 font-bold text-3xl">{t("title")}</h2>
      </div>

      {/* Avatar Section */}
      <Card className="border-none shadow-sm bg-primary-foreground">
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative group">
              <Avatar className="w-32 h-32 border-4 border-[#DCBB87]/20">
                <AvatarImage
                  src={authUser?.avatarUrl || "/assets/imgs/avatar.png"}
                  alt="Avatar"
                />
                <AvatarFallback className="bg-gradient-to-br from-[#DCBB87] to-[#B8935A] text-white text-3xl">
                  {formData.fullName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <label
                htmlFor="avatar-upload"
                className={`absolute inset-0 flex items-center justify-center bg-black/50 rounded-full transition-opacity cursor-pointer ${
                  isUploadingAvatar
                    ? "opacity-100"
                    : "opacity-0 group-hover:opacity-100"
                }`}
              >
                {isUploadingAvatar ? (
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                ) : (
                  <Camera className="w-8 h-8 text-white" />
                )}
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
                disabled={isUploadingAvatar}
              />
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-xl font-bold text-gray-900">
                {formData.fullName || t("notUpdated")}
              </h3>
              <p className="text-gray-600 mt-1">{formData.email}</p>
              <p className="text-sm text-gray-500 mt-2">
                {account?.roles?.[0] === "LANDLORD"
                  ? t("landlord")
                  : t("tenant")}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3 text-primary"
                onClick={() =>
                  document.getElementById("avatar-upload")?.click()
                }
                disabled={isUploadingAvatar}
              >
                {isUploadingAvatar ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t("uploadingAvatar")}
                  </>
                ) : (
                  <>
                    <Camera className="w-4 h-4 mr-2" />
                    {t("changeAvatar")}
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information Form */}
      <Card className="border-none shadow-sm bg-primary-foreground">
        <CardHeader>
          <CardTitle>{t("basicInfo")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName">{t("fullName")}</Label>
              <Input
                id="fullName"
                name="fullName"
                placeholder={t("fullNamePlaceholder")}
                value={formData.fullName}
                disabled
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">{t("email")}</Label>
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
                {t("phone")} <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder={t("phonePlaceholder")}
                  className="pl-10"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* CCCD */}
            <div className="space-y-2">
              <Label htmlFor="cccd">{t("cccd")}</Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="cccd"
                  name="cccd"
                  placeholder={t("cccdPlaceholder")}
                  className="pl-10"
                  value={formData.cccd}
                  disabled
                />
              </div>
              {!account?.isVerified && (
                <div className="mt-2 space-y-3">
                  {/* Face Image Camera Capture */}
                  <div>
                    <Button
                      type="button"
                      onClick={openCamera}
                      disabled={isUploadingCCCD}
                      className={`w-full ${
                        faceImage
                          ? "bg-green-100 text-green-700 border-2 border-green-500 hover:bg-green-200"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                      variant="outline"
                    >
                      {faceImage ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          {t("capturedFacePhoto")}
                        </>
                      ) : (
                        <>
                          <Video className="w-4 h-4 mr-2" />
                          {t("captureFacePhoto")}
                        </>
                      )}
                    </Button>
                  </div>

                  {/* CCCD Image Upload */}
                  <div>
                    <label
                      htmlFor="cccd-upload"
                      className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors ${
                        cccdImage
                          ? "bg-green-100 text-green-700 border-2 border-green-500"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {cccdImage ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          {t("selectedCCCDPhoto")}
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" />
                          {t("uploadCCCDPhoto")}
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
                  </div>

                  {/* Verify Button */}
                  <Button
                    onClick={handleVerifyIdentity}
                    disabled={!faceImage || !cccdImage || isUploadingCCCD}
                    className="w-full bg-[#DCBB87] hover:bg-[#B8935A] text-white"
                  >
                    {isUploadingCCCD ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {t("verifying")}
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        {t("verifyIdentity")}
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-gray-500">
                    {t("verifyInstruction")}
                  </p>
                </div>
              )}
            </div>

            {/* Bio */}
            {account?.roles?.[0] === "LANDLORD" && (
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="bio">{t("bio")}</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  placeholder={t("bioPlaceholder")}
                  rows={4}
                  value={formData.bio}
                  onChange={handleInputChange}
                />
                <p className="text-xs text-gray-500">{t("bioHint")}</p>
              </div>
            )}
          </div>

          {/* Account Info */}
          <div className="pt-6 border-t">
            <h4 className="font-semibold text-gray-900 mb-4">
              {t("accountInfo")}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-[#DCBB87]/20 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-[#DCBB87]" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t("joinDate")}</p>
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
                  <p className="text-sm text-gray-600">
                    {t("verificationStatus")}
                  </p>
                  <p
                    className={`font-semibold ${
                      account?.isVerified ? "text-green-600" : "text-yellow-600"
                    }`}
                  >
                    {account?.isVerified ? t("verified") : t("notVerified")}
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
              {t("cancel")}
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-[#DCBB87] hover:bg-[#B8935A]"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t("saving")}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {t("saveChanges")}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Camera Dialog */}
      <Dialog open={isCameraOpen} onOpenChange={closeCamera}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{t("captureFace")}</DialogTitle>
            <DialogDescription>{t("captureFaceDescription")}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Video/Canvas Container */}
            <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
              {!capturedImage ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={capturedImage}
                  alt="Captured"
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Hidden canvas for capturing */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Action Buttons */}
            <DialogFooter className="flex-row gap-2 sm:gap-2">
              {!capturedImage ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={closeCamera}
                    className="flex-1 border-red-500 text-red-500"
                  >
                    {t("cancel")}
                  </Button>
                  <Button
                    type="button"
                    onClick={capturePhoto}
                    className="flex-1 bg-[#DCBB87] hover:bg-[#B8935A]"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    {t("takePhoto")}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={retakePhoto}
                    className="flex-1 text-primary"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    {t("retake")}
                  </Button>
                  <Button
                    type="button"
                    onClick={confirmPhoto}
                    className="flex-1 bg-[#DCBB87] hover:bg-[#B8935A]"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    {t("confirm")}
                  </Button>
                </>
              )}
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
