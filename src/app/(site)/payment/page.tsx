"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PaymentModal } from "@/components/payment/payment-modal";

export default function TestPaymentPage() {
  // 1. Khởi tạo state để kiểm soát modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Hàm xử lý thành công
  const handlePaymentSuccess = (method: string) => {
    console.log(`Thanh toán thành công bằng phương thức: ${method}`);
    // Đóng modal sau khi thành công
    setIsModalOpen(false);
    // Thêm logic chuyển hướng/thông báo thành công tại đây
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Trang Test Modal Thanh Toán</h1>
      
      {/* 2. Nút bấm để mở modal */}
      <Button onClick={() => setIsModalOpen(true)}>
        Mở Modal Thanh Toán
      </Button>

      {/* 3. Render component PaymentModal */}
      <PaymentModal
        // Truyền state isModalOpen vào prop isOpen
        isOpen={isModalOpen} 
        // Truyền hàm để đóng modal (khi bấm Hủy hoặc Esc)
        onClose={() => setIsModalOpen(false)} 
        // Số tiền giả định
        amount={1000000} 
        // Hàm callback khi thanh toán thành công
        onPaymentSuccess={handlePaymentSuccess} 
      />
    </div>
  );
}