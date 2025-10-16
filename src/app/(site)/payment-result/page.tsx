"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { CheckCheckIcon, TriangleAlert } from "lucide-react";

// Bọc component chính trong Suspense để xử lý việc fetching search params
export default function PaymentResultPageWrapper() {
  return (
    <Suspense fallback={<div>Đang tải kết quả...</div>}>
      <PaymentResultPage />
    </Suspense>
  );
}

function PaymentResultPage() {
  const searchParams = useSearchParams();

  // Lấy các tham số từ URL
  const status = searchParams.get("status");
  const code = searchParams.get("code");
  const amount = searchParams.get("amount");
  const txnRef = searchParams.get("txnRef");
  const payDate = searchParams.get("payDate");
  const orderInfo = searchParams.get("orderInfo");
  const bankCode = searchParams.get("bankCode");

  const isSuccess = status === "success" && code === "00";

  // Định dạng lại số tiền cho dễ đọc
  const formattedAmount = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(Number(amount) || 0);

  // Định dạng lại ngày thanh toán
  const formattedPayDate = (dateString: string | null) => {
    if (!dateString || dateString.length !== 14) return "Không xác định";
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);
    const hour = dateString.substring(8, 10);
    const minute = dateString.substring(10, 12);
    const second = dateString.substring(12, 14);
    return `${day}/${month}/${year}, ${hour}:${minute}:${second}`;
  };

  // Thay thế dấu gạch dưới trong orderInfo
  const formattedOrderInfo = (info: string | null) => {
    return info ? info.replace(/_/g, " ") : "Không có thông tin";
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 py-10">
      <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-lg shadow-md text-center">
        {isSuccess ? (
          <>
            {/* Success Icon */}
            <CheckCheckIcon className="w-16 h-16 mx-auto text-green-500" />
            <h1 className="text-3xl font-bold text-gray-800">
              Thanh toán thành công!
            </h1>
            <p className="text-gray-600">
              Cảm ơn bạn đã hoàn tất thanh toán. Dưới đây là chi tiết giao dịch
              của bạn.
            </p>
          </>
        ) : (
          <>
            {/* Failure Icon */}
            <TriangleAlert className="w-16 h-16 mx-auto text-red-500" />
            <h1 className="text-3xl font-bold text-gray-800">
              Thanh toán thất bại
            </h1>
            <p className="text-gray-600">
              Đã có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại hoặc
              liên hệ bộ phận hỗ trợ.
            </p>
          </>
        )}

        {/* Thông tin giao dịch */}
        <div className="p-6 space-y-4 text-left bg-gray-50 border border-gray-200 rounded-md">
          <div className="flex justify-between">
            <span className="font-semibold text-gray-600">Trạng thái:</span>
            <span
              className={`font-bold ${
                isSuccess ? "text-green-600" : "text-red-600"
              }`}
            >
              {isSuccess ? "Thành công" : "Thất bại"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-600">Mã giao dịch:</span>
            <span className="text-gray-800">{txnRef}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-600">Số tiền:</span>
            <span className="text-gray-800 font-bold">{formattedAmount}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-600">Nội dung:</span>
            <span className="text-gray-800">
              {formattedOrderInfo(orderInfo)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-600">Ngân hàng:</span>
            <span className="text-gray-800">{bankCode}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-600">Thời gian:</span>
            <span className="text-gray-800">{formattedPayDate(payDate)}</span>
          </div>
        </div>

        {/* Nút hành động */}
        <div className="pt-4">
          <Link
            href="/my-properties"
            className="w-full px-4 py-3 font-semibold text-white bg-primary rounded-lg hover:bg-primary/85 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Quản lý hợp đồng
          </Link>
          <Link
            href="/"
            className="block mt-4 text-sm text-center text-gray-600 hover:underline"
          >
            Quay về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
