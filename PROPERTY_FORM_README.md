# Trang Đăng Bất Động Sản Mới

## 📋 Tổng quan

Trang đăng bất động sản mới cho phép người dùng tạo tin đăng bất động sản với 2 loại chính:

- **Căn hộ/Chung cư** (apartment)
- **Phòng trọ** (boarding house)

## 🚀 Tính năng đã implement

### ✅ Header Integration

- Thêm nút "Đăng tin" vào header cho cả user chưa đăng nhập và đã đăng nhập
- Navigation tới `/my-properties/new`

### ✅ Form Validation

- Validation messages chi tiết bằng tiếng Việt
- Error states với border đỏ cho các field có lỗi
- Character counter cho description field
- Real-time validation với React Hook Form + Zod

### ✅ API Integration

- **POST /api/properties** - Submit form tạo bất động sản mới
- **POST /api/upload** - Upload ảnh với validation (5MB max, JPG/PNG/WEBP)
- **GET /api/address** - Load địa chỉ Việt Nam (tỉnh/quận/phường)

### ✅ Address System

- Dropdown cascading: chọn tỉnh → load quận → load phường
- Sử dụng dữ liệu địa chỉ Việt Nam thực tế
- Loading states và disabled states

### ✅ Image Upload

- Upload ảnh thực tế qua API
- Validation file type và size
- Error handling và loading states

## 📁 File Structure

```
src/
├── app/
│   ├── api/
│   │   ├── properties/route.ts     # API xử lý CRUD bất động sản
│   │   ├── upload/route.ts         # API upload ảnh
│   │   └── address/route.ts        # API địa chỉ Việt Nam
│   └── (site)/
│       └── my-properties/
│           └── new/
│               └── page.tsx        # Form đăng tin mới
├── components/
│   └── header/
│       └── UserMenu.tsx           # Updated với nút "Đăng tin"
└── hooks/
    ├── use-image-upload.ts        # Hook upload ảnh
    └── use-vietnamese-address.ts  # Hook địa chỉ VN
```

## 🔧 Cách sử dụng

### 1. Truy cập trang đăng tin

- Click nút "Đăng tin" ở header
- Hoặc truy cập trực tiếp `/my-properties/new`

### 2. Điền form

1. **Thông tin chung**: Tên BĐS, loại (căn hộ/phòng trọ), địa chỉ
2. **Thông tin chi tiết**: Phòng ngủ, phòng tắm, diện tích, giá thuê
3. **Upload ảnh**: Ảnh chính và gallery (tối đa 8 ảnh)

### 3. Submit

- Form sẽ validate trước khi submit
- Hiển thị loading state và error messages
- Redirect sau khi thành công

## 🎯 API Endpoints

### Properties API

```typescript
// Tạo bất động sản mới
POST /api/properties
Body: NewPropertyForm

// Lấy danh sách bất động sản của user
GET /api/properties?page=1&limit=10&status=pending
```

### Upload API

```typescript
// Upload ảnh
POST /api/upload
Body: FormData { file: File }
Response: { success: boolean, data: { url: string } }
```

### Address API

```typescript
// Lấy tỉnh/thành
GET /api/address?level=province

// Lấy quận/huyện
GET /api/address?level=district&province={code}

// Lấy phường/xã
GET /api/address?level=ward&district={code}
```

## 📝 Form Schema

```typescript
interface NewPropertyForm {
  // Basic info
  title: string;
  kind: "apartment" | "boarding";
  province: string;
  district: string;
  ward: string;
  street: string;

  // Apartment specific
  block?: string;
  floor?: string;
  unit?: string;

  // Boarding specific
  floors: Array<{
    name: string;
    rooms: string[];
  }>;
  roomTypes: Array<{
    name: string;
    bedrooms: number;
    bathrooms: number;
    area: number;
    price: number;
    count: number;
    // ...
  }>;

  // Common details
  description?: string;
  bedrooms?: number;
  bathrooms?: number;
  furnishing?: string;
  legalDoc?: string;
  area: number;
  price: number;
  deposit?: number;

  // Media
  heroImage?: string;
  gallery: string[];
}
```

## 🔄 Next Steps

### Cần implement thêm:

1. **Database integration** - Kết nối với database thực tế
2. **Authentication** - Xác thực user trước khi cho phép đăng tin
3. **File storage** - Upload lên cloud storage (Cloudinary/AWS S3)
4. **Multi-step wizard** - Chia form thành nhiều bước
5. **Draft saving** - Lưu draft tự động
6. **Preview mode** - Xem trước tin đăng

### Improvements:

1. **Rich text editor** cho description
2. **Map integration** cho location picker
3. **Image cropping/resizing** tools
4. **Bulk upload** cho nhiều ảnh
5. **Progress indicators** và better UX

## 🐛 Known Issues

- TypeScript errors cần fix (any types, implicit types)
- Image upload chỉ là mock, cần tích hợp service thực tế
- Address data là mock, cần database thực tế
- Cần thêm authentication check

## 📞 Support

Liên hệ team development nếu có vấn đề hoặc cần support thêm tính năng.
