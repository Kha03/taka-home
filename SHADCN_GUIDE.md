# Hướng dẫn sử dụng shadcn/ui trong Taka Home

## 📦 Cài đặt hoàn tất

Project đã được cài đặt thành công với shadcn/ui! Các thành phần sau đã được thêm:

- ✅ shadcn/ui CLI và cấu hình cơ bản
- ✅ Button component với nhiều variants
- ✅ Card, CardContent, CardHeader, CardTitle, CardDescription
- ✅ Input và Label components
- ✅ Dropdown Menu component
- ✅ Utils function `cn()` để merge classes

## 🎨 Theme Configuration

Theme được cấu hình trong `src/app/globals.css` với:

- Base color: **Zinc**
- Style: **New York**
- CSS Variables: **Enabled**
- Icons: **Lucide React**

## 🔧 Cách sử dụng

### 1. Thêm components mới

```bash
npx shadcn@latest add [component-name]
```

Ví dụ:

```bash
npx shadcn@latest add dialog
npx shadcn@latest add form
npx shadcn@latest add table
```

### 2. Import và sử dụng

```tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hello World</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Click me</Button>
      </CardContent>
    </Card>
  );
}
```

### 3. Customization

Bạn có thể:

- Thay đổi theme colors trong `globals.css`
- Tùy chỉnh component styles trong `src/components/ui/`
- Sử dụng `cn()` utility để merge classes

## 📚 Components có sẵn

- `Button` - với variants: default, secondary, destructive, outline, ghost, link
- `Card` family - Card, CardContent, CardHeader, CardTitle, CardDescription
- `Input` - styled input fields
- `Label` - accessible labels
- `DropdownMenu` family - menus và submenus

## 🌙 Dark Mode

Dark mode đã được cấu hình và sẵn sàng sử dụng. Để toggle dark mode, thêm class `dark` vào thẻ `html`.

## 📖 Tài liệu tham khảo

- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Radix UI](https://www.radix-ui.com)
- [Lucide Icons](https://lucide.dev)

## 🚀 Next Steps

1. Khám phá thêm components tại [ui.shadcn.com/docs/components](https://ui.shadcn.com/docs/components)
2. Tạo custom components riêng trong `src/components/`
3. Cấu hình dark mode toggle
4. Thêm form validation với react-hook-form + zod

Happy coding! 🎉
