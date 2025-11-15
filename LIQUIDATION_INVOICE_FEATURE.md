# Tính năng Hóa đơn Thanh lý Hợp đồng

## 📋 Tổng quan

Tính năng này tự động nhắc nhở chủ nhà tạo hóa đơn thanh lý khi hợp đồng sắp hết hạn (trong vòng 7 ngày cuối), đặc biệt cho các trường hợp có thiệt hại hoặc phí phát sinh cần bồi thường.

## 🎯 Mục đích

- Nhắc nhở chủ nhà xử lý các khoản phí phát sinh trước khi kết thúc hợp đồng
- Hỗ trợ việc tạo hóa đơn bồi thường thiệt hại một cách thuận tiện
- Đảm bảo quy trình thanh lý hợp đồng được thực hiện đầy đủ

## ✨ Các thay đổi chính

### 1. Thêm ServiceType mới: `DAMAGE_COMPENSATION`

**File**: `src/lib/api/services/invoice.ts`

```typescript
export enum ServiceTypeEnum {
  ELECTRICITY = "ELECTRICITY", // Tiền điện
  WATER = "WATER", // Tiền nước
  PARKING = "PARKING", // Tiền giữ xe
  INTERNET = "INTERNET", // Tiền internet
  CLEANING = "CLEANING", // Tiền vệ sinh
  SECURITY = "SECURITY", // Tiền bảo vệ
  DAMAGE_COMPENSATION = "DAMAGE_COMPENSATION", // Bồi thường thiệt hại ⭐ MỚI
  OTHER = "OTHER", // Khác
}
```

### 2. Component Alert nhắc nhở mới

**File**: `src/components/contracts/contract-detail/contract-liquidation-alert.tsx`

Component này hiển thị cảnh báo khi:

- Hợp đồng đang ở trạng thái `ACTIVE`
- Còn từ 1-7 ngày đến khi hợp đồng hết hạn
- Người dùng là `LANDLORD` (chủ nhà)

### 3. Cập nhật CreateInvoiceDialog

**File**: `src/components/contracts/create-invoice-dialog.tsx`

Thêm props `isLiquidation?: boolean` để:

- Tự động chọn service type là `DAMAGE_COMPENSATION` khi tạo hóa đơn thanh lý
- Thay đổi tiêu đề dialog thành "Tạo hóa đơn thanh lý"

### 4. Tích hợp vào trang chi tiết hợp đồng

**File**: `src/app/(site)/contracts/[id]/page.tsx`

Alert được hiển thị giữa phần thông tin hợp đồng và các hành động.

## 📱 Giao diện người dùng

### Alert nhắc nhở

```
┌────────────────────────────────────────────────────────┐
│ ⚠️  Nhắc nhở: Hợp đồng sắp hết hạn                     │
│                                                        │
│ Hợp đồng sẽ kết thúc trong 5 ngày (10/11/2025).       │
│ Nếu có thiệt hại hoặc phí phát sinh, vui lòng         │
│ tạo hóa đơn thanh lý để xử lý trước khi kết thúc      │
│ hợp đồng.                                              │
│                                                        │
│ [📄 Tạo hóa đơn thanh lý]                             │
│ ℹ️ Loại dịch vụ: Bồi thường thiệt hại (DAMAGE_COM...) │
└────────────────────────────────────────────────────────┘
```

## 🔄 Luồng hoạt động

1. **Kiểm tra điều kiện hiển thị**

   - Hợp đồng có status = "ACTIVE"
   - Người dùng là LANDLORD
   - Ngày hiện tại nằm trong khoảng 7 ngày cuối của hợp đồng

2. **Hiển thị Alert**

   - Alert màu amber (vàng cam) để thu hút sự chú ý
   - Hiển thị số ngày còn lại và ngày kết thúc hợp đồng
   - Nút "Tạo hóa đơn thanh lý" để mở dialog

3. **Tạo hóa đơn thanh lý**

   - Mở CreateInvoiceDialog với `isLiquidation={true}`
   - Service type mặc định là `DAMAGE_COMPENSATION`
   - Tiêu đề dialog: "Tạo hóa đơn thanh lý"

4. **Sau khi tạo thành công**
   - Đóng dialog
   - Refresh danh sách hóa đơn
   - Alert vẫn hiển thị (chủ nhà có thể tạo nhiều hóa đơn thanh lý nếu cần)

## 🎨 Thiết kế

### Màu sắc

- Background: `bg-amber-50` (vàng cam nhạt)
- Border: `border-amber-200`
- Icon: `text-amber-600`
- Text chính: `text-amber-900`
- Text phụ: `text-amber-800`
- Button: `bg-amber-600 hover:bg-amber-700`

### Icon

- AlertCircle (⚠️) trong circle màu amber

## 📝 Ví dụ sử dụng

### Tạo hóa đơn thanh lý cho căn hộ

```typescript
// Dialog tự động mở với isLiquidation={true}
// Service type mặc định: DAMAGE_COMPENSATION
// Người dùng có thể:
// - Upload ảnh hóa đơn thiệt hại
// - Thêm mô tả chi tiết
// - Nhập số tiền bồi thường
```

### Tạo hóa đơn thanh lý cho phòng trọ

```typescript
// Dialog tự động mở với isLiquidation={true}
// Service type mặc định: DAMAGE_COMPENSATION
// Người dùng có thể:
// - Thêm nhiều mục thiệt hại
// - Nhập số tiền cho mỗi mục
// - Thêm ghi chú
```

## 🔧 Cấu hình

### Thời gian nhắc nhở

```typescript
const daysUntilEnd = Math.ceil(
  (endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
);

// Hiển thị khi: 0 < daysUntilEnd <= 7
if (daysUntilEnd > 7 || daysUntilEnd < 0) {
  return null;
}
```

### Điều kiện hiển thị

```typescript
{
  booking.contract && booking.status === "ACTIVE" && (
    <ContractLiquidationAlert
      contractId={booking.contract.id}
      contractEndDate={booking.contract.endDate}
      propertyType={booking.property.type as "APARTMENT" | "BOARDING"}
      userRole={userRole}
      onInvoiceCreated={handleRefresh}
    />
  );
}
```

## 🧪 Testing

### Test case 1: Alert hiển thị đúng thời điểm

- Hợp đồng kết thúc ngày 10/11/2025
- Ngày hiện tại: 05/11/2025 (còn 5 ngày)
- ✅ Alert hiển thị cho LANDLORD
- ❌ Alert không hiển thị cho TENANT

### Test case 2: Alert không hiển thị khi quá sớm

- Hợp đồng kết thúc ngày 30/11/2025
- Ngày hiện tại: 10/11/2025 (còn 20 ngày)
- ❌ Alert không hiển thị

### Test case 3: Alert không hiển thị khi đã hết hạn

- Hợp đồng kết thúc ngày 10/11/2025
- Ngày hiện tại: 12/11/2025 (quá hạn 2 ngày)
- ❌ Alert không hiển thị

### Test case 4: Tạo hóa đơn thanh lý thành công

- Click nút "Tạo hóa đơn thanh lý"
- Dialog mở với service type = DAMAGE_COMPENSATION
- Điền thông tin và submit
- ✅ Hóa đơn được tạo thành công
- ✅ Danh sách hóa đơn được refresh

## 🚀 Triển khai

Tính năng này đã được tích hợp vào các file sau:

1. ✅ `src/lib/api/services/invoice.ts` - Thêm DAMAGE_COMPENSATION
2. ✅ `src/components/contracts/contract-detail/contract-liquidation-alert.tsx` - Component alert mới
3. ✅ `src/components/contracts/contract-detail/index.ts` - Export component
4. ✅ `src/components/contracts/create-invoice-dialog.tsx` - Hỗ trợ chế độ thanh lý
5. ✅ `src/app/(site)/contracts/[id]/page.tsx` - Tích hợp vào trang chi tiết

## 📌 Lưu ý

1. **Chỉ hiển thị cho LANDLORD**: Alert chỉ xuất hiện khi người dùng có role là "LANDLORD"
2. **Không chặn hoạt động khác**: Alert chỉ là nhắc nhở, không chặn các hoạt động khác của hợp đồng
3. **Có thể tạo nhiều hóa đơn**: Chủ nhà có thể tạo nhiều hóa đơn thanh lý nếu có nhiều khoản thiệt hại
4. **Service type khác nhau**: Ngoài DAMAGE_COMPENSATION, chủ nhà vẫn có thể chọn các service type khác nếu cần

## 🎯 Mở rộng trong tương lai

- [ ] Gửi thông báo email/SMS cho chủ nhà
- [ ] Tự động tạo báo cáo thiệt hại dựa trên ảnh
- [ ] Lưu lịch sử tất cả hóa đơn thanh lý
- [ ] Thống kê các loại thiệt hại phổ biến
- [ ] Tích hợp với quy trình bàn giao nhà
