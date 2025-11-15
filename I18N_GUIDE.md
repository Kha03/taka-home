# Hướng dẫn sử dụng i18n (Đa ngôn ngữ)

## Tổng quan

Hệ thống đã được cấu hình với next-intl để hỗ trợ đa ngôn ngữ (Tiếng Anh và Tiếng Việt).

## Cấu trúc

### 1. File cấu hình

- `i18n.config.js`: Cấu hình các ngôn ngữ được hỗ trợ
- `messages/en.json`: File dịch Tiếng Anh
- `messages/vi.json`: File dịch Tiếng Việt

### 2. Ngôn ngữ mặc định

- Mặc định: Tiếng Việt (`vi`)
- Các ngôn ngữ hỗ trợ: `en`, `vi`

## Cách sử dụng

### 1. Trong Server Components

```tsx
import { useTranslations } from "next-intl";

export default function Page() {
  const t = useTranslations("common");

  return (
    <div>
      <h1>{t("welcome")}</h1>
      <p>{t("search")}</p>
    </div>
  );
}
```

### 2. Trong Client Components

```tsx
"use client";

import { useTranslations } from "next-intl";

export default function ClientComponent() {
  const t = useTranslations("auth");

  return (
    <div>
      <h1>{t("signin")}</h1>
      <button>{t("submit")}</button>
    </div>
  );
}
```

### 3. Sử dụng Language Switcher

Import component `LanguageSwitcher` vào header hoặc nơi cần chuyển đổi ngôn ngữ:

```tsx
import { LanguageSwitcher } from "@/components/language-switcher";

export function Header() {
  return (
    <header>
      <nav>
        {/* Other nav items */}
        <LanguageSwitcher />
      </nav>
    </header>
  );
}
```

### 4. Hook tùy chỉnh

```tsx
"use client";

import { useI18n } from "@/hooks/use-i18n";

export function MyComponent() {
  const { locale, changeLanguage, locales } = useI18n();

  return (
    <div>
      <p>Current language: {locale}</p>
      <button onClick={() => changeLanguage("en")}>English</button>
      <button onClick={() => changeLanguage("vi")}>Tiếng Việt</button>
    </div>
  );
}
```

## Các namespace có sẵn

1. **common**: Các từ chung (`welcome`, `home`, `search`, `save`, `cancel`, etc.)
2. **auth**: Xác thực (`signin`, `signup`, `email`, `password`, etc.)
3. **nav**: Điều hướng (`properties`, `myProperties`, `contracts`, etc.)
4. **property**: Bất động sản (`title`, `address`, `price`, `area`, etc.)
5. **contract**: Hợp đồng (`startDate`, `endDate`, `monthlyRent`, etc.)
6. **payment**: Thanh toán (`method`, `amount`, `status`, etc.)
7. **chat**: Trò chuyện (`messages`, `send`, `typing`, etc.)
8. **notification**: Thông báo (`new`, `markAsRead`, etc.)
9. **validation**: Xác thực form (`required`, `invalidEmail`, etc.)
10. **footer**: Footer (`copyright`, `privacyPolicy`, etc.)

## Thêm bản dịch mới

### 1. Thêm key mới vào file JSON

Trong `messages/en.json`:

```json
{
  "common": {
    "newKey": "New Value"
  }
}
```

Trong `messages/vi.json`:

```json
{
  "common": {
    "newKey": "Giá trị mới"
  }
}
```

### 2. Thêm namespace mới

Thêm vào cả `en.json` và `vi.json`:

```json
{
  "newNamespace": {
    "key1": "Value 1",
    "key2": "Value 2"
  }
}
```

## Interpolation (Chèn biến)

Sử dụng biến trong bản dịch:

```tsx
const t = useTranslations("validation");

// File JSON: "minLength": "Minimum {min} characters required"
<p>{t("minLength", { min: 8 })}</p>;
```

## Best Practices

1. **Luôn dùng namespace**: Tổ chức bản dịch theo namespace để dễ quản lý
2. **Key rõ ràng**: Đặt tên key dễ hiểu, mô tả đúng nội dung
3. **Consistency**: Giữ cấu trúc giống nhau giữa các file ngôn ngữ
4. **Fallback**: Luôn cung cấp bản dịch cho cả 2 ngôn ngữ
5. **Type safety**: Update type `Messages` trong `src/lib/i18n/messages.ts` khi thêm namespace mới

## Routing

URL sẽ tự động có prefix ngôn ngữ:

- `/vi/properties` - Tiếng Việt
- `/en/properties` - Tiếng Anh

Middleware sẽ tự động redirect về ngôn ngữ mặc định nếu không có prefix.

## Lưu ý quan trọng

1. Ngôn ngữ được lưu trong cookie `NEXT_LOCALE`
2. Middleware tự động xử lý locale routing
3. Sử dụng `Link` từ `next-intl/navigation` thay vì `next/link` để có tự động locale prefix
4. Client components cần đánh dấu `'use client'`

## Troubleshooting

### Lỗi: "Could not find messages"

- Đảm bảo file JSON tồn tại trong folder `messages/`
- Kiểm tra locale name khớp với tên file (en.json, vi.json)

### Lỗi: "Locale not found"

- Kiểm tra locale có trong `i18n.config.js`
- Đảm bảo middleware được cấu hình đúng

### Translation không hiển thị

- Kiểm tra namespace và key có tồn tại trong file JSON
- Xác nhận component được wrap trong `I18nProvider`
