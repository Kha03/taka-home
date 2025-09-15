# 🌙 Hướng dẫn sử dụng Dark Mode với shadcn/ui

## 📋 Tổng quan

Project đã được cấu hình đầy đủ với dark mode sử dụng `next-themes` và shadcn/ui. Dark mode hoạt động bằng cách thêm/xóa class `dark` trên thẻ `<html>`.

## 🛠️ Cài đặt đã hoàn thành

### Dependencies đã cài:

- ✅ `next-themes` - Quản lý theme state
- ✅ `lucide-react` - Icons cho theme toggle
- ✅ shadcn/ui components với dark mode support

### Files đã tạo:

- ✅ `src/components/theme-provider.tsx` - Theme context provider
- ✅ `src/components/theme-toggle.tsx` - Toggle buttons
- ✅ `src/app/layout.tsx` - Đã wrap với ThemeProvider

## 🎨 Cách hoạt động

### 1. CSS Variables System

Theme được định nghĩa trong `globals.css`:

```css
:root {
  --background: oklch(1 0 0); /* White */
  --foreground: oklch(0.141 0.005 285.823); /* Dark text */
  /* ... more colors */
}

.dark {
  --background: oklch(0.141 0.005 285.823); /* Dark */
  --foreground: oklch(0.985 0 0); /* Light text */
  /* ... more colors */
}
```

### 2. Tailwind Classes

Sử dụng semantic color classes:

```tsx
<div className="bg-background text-foreground">
  <div className="bg-card text-card-foreground">Content</div>
</div>
```

## 🔧 Sử dụng trong Components

### 1. Import useTheme hook:

```tsx
"use client";
import { useTheme } from "next-themes";

export function MyComponent() {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={() => setTheme("dark")}>Dark Mode</button>
    </div>
  );
}
```

### 2. Conditional rendering based on theme:

```tsx
"use client";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export function ThemeAwareComponent() {
  const { theme } = useTheme();

  return <div>{theme === "dark" ? <Moon /> : <Sun />}</div>;
}
```

### 3. Handle hydration mismatch:

```tsx
"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ClientOnlyComponent() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div>Loading...</div>;
  }

  return <div>Theme: {theme}</div>;
}
```

## 🎯 Theme Options

### Available themes:

- `light` - Light mode
- `dark` - Dark mode
- `system` - Follow system preference

### Set theme programmatically:

```tsx
const { setTheme } = useTheme();

// Set specific theme
setTheme("dark");
setTheme("light");
setTheme("system");
```

## 🎨 Customizing Colors

### 1. Modify CSS variables in globals.css:

```css
:root {
  --primary: oklch(0.5 0.2 240); /* Custom blue */
  --secondary: oklch(0.8 0.1 120); /* Custom green */
}

.dark {
  --primary: oklch(0.7 0.2 240); /* Lighter blue for dark mode */
  --secondary: oklch(0.6 0.1 120); /* Darker green for dark mode */
}
```

### 2. Use semantic classes:

```tsx
<div className="bg-primary text-primary-foreground">
  Primary colored content
</div>

<div className="bg-secondary text-secondary-foreground">
  Secondary colored content
</div>
```

## 🔍 Available Color Classes

### Background Colors:

- `bg-background` - Main background
- `bg-card` - Card background
- `bg-popover` - Popover background
- `bg-primary` - Primary color
- `bg-secondary` - Secondary color
- `bg-muted` - Muted background
- `bg-accent` - Accent background
- `bg-destructive` - Error/danger background

### Text Colors:

- `text-foreground` - Main text
- `text-card-foreground` - Card text
- `text-primary-foreground` - Primary text
- `text-secondary-foreground` - Secondary text
- `text-muted-foreground` - Muted text
- `text-accent-foreground` - Accent text
- `text-destructive-foreground` - Error text

### Border Colors:

- `border-border` - Default border
- `border-input` - Input border
- `border-ring` - Focus ring

## 🚀 Best Practices

### 1. Always use semantic colors:

```tsx
// ✅ Good
<div className="bg-card text-card-foreground">

// ❌ Avoid
<div className="bg-white text-black dark:bg-gray-900 dark:text-white">
```

### 2. Handle client-side rendering:

```tsx
// ✅ Good - prevents hydration mismatch
const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);
if (!mounted) return null;

// ❌ Avoid - can cause hydration issues
return <div>{theme === "dark" ? "Dark" : "Light"}</div>;
```

### 3. Use the theme toggle components:

```tsx
import { ThemeToggle, SimpleThemeToggle } from "@/components/providers"

// Dropdown with Light/Dark/System options
<ThemeToggle />

// Simple toggle between Light/Dark
<SimpleThemeToggle />
```

## 🎯 Examples

### Complete component example:

```tsx
"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { Button } from "@/components/ui";

export function ThemeDemo() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Card>
        <CardContent>Loading...</CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Theme Demo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>Current theme: {theme}</p>
        <div className="flex gap-2">
          <Button
            variant={theme === "light" ? "default" : "outline"}
            onClick={() => setTheme("light")}
          >
            Light
          </Button>
          <Button
            variant={theme === "dark" ? "default" : "outline"}
            onClick={() => setTheme("dark")}
          >
            Dark
          </Button>
          <Button
            variant={theme === "system" ? "default" : "outline"}
            onClick={() => setTheme("system")}
          >
            System
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
```

## 📚 Resources

- [next-themes Documentation](https://github.com/pacocoursey/next-themes)
- [shadcn/ui Theming](https://ui.shadcn.com/docs/theming)
- [Tailwind Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [OKLCH Color Tool](https://oklch.com/)

## 🎉 Demo

Truy cập `http://localhost:3000` để xem demo với theme toggle hoạt động!
