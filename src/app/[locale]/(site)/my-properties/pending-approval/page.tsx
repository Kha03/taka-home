"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { CheckCircle2, Clock, Home } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Stepper } from "@/components/property-form/Stepper";

export default function PendingApprovalPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#FFF7E9] p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-6xl space-y-6 py-8"
      >
        <Stepper step={2} />

        <div className="bg-primary-foreground rounded-xl shadow-lg border border-border/50 overflow-hidden backdrop-blur-sm">
          <div className="p-12 text-center space-y-6">
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="flex justify-center"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl" />
                <CheckCircle2 className="w-24 h-24 text-green-500 relative" />
              </div>
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-2"
            >
              <h1 className="text-3xl font-bold text-primary">
                Đăng tin thành công!
              </h1>
              <p className="text-muted-foreground text-lg">
                Bất động sản của bạn đã được gửi lên hệ thống
              </p>
            </motion.div>

            {/* Status Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="max-w-md mx-auto bg-amber-50 border border-amber-200 rounded-lg p-6"
            >
              <div className="flex items-start gap-4">
                <Clock className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                <div className="text-left space-y-2">
                  <h3 className="font-semibold text-amber-900">
                    Đang chờ xét duyệt
                  </h3>
                  <p className="text-sm text-amber-700">
                    Quản trị viên sẽ xem xét và duyệt bất động sản của bạn trong
                    thời gian sớm nhất.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="flex flex-col sm:flex-row gap-3 justify-center pt-4"
            >
              <Button
                onClick={() => router.push("/my-properties")}
                className="rounded-[8px] bg-accent border-0 hover:bg-[#e59400] text-primary-foreground"
              >
                <Home className="h-4 w-4 mr-2" />
                Xem bất động sản của tôi
              </Button>
              <Button
                onClick={() => router.push("/")}
                variant="outline"
                className="rounded-[8px] border-accent hover:bg-accent/10 text-accent"
              >
                Về trang chủ
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
