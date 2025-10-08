# Hệ thống Chat - Taka Home

## Tổng quan

Hệ thống chat hiện đại cho ứng dụng Taka Home, cho phép giao tiếp giữa người thuê và chủ nhà một cách dễ dàng và hiệu quả.

## Tính năng chính

### 🔥 Tính năng nổi bật

- **Giao diện hiện đại**: Thiết kế responsive, tương thích mobile và desktop
- **Real-time messaging**: Tin nhắn được cập nhật theo thời gian thực (simulation)
- **Trạng thái tin nhắn**: Hiển thị trạng thái gửi, đã nhận, đã đọc
- **Thông báo không đọc**: Badge hiển thị số tin nhắn chưa đọc
- **Upload files**: Hỗ trợ gửi hình ảnh và tệp đính kèm
- **Tìm kiếm**: Tìm kiếm cuộc trò chuyện theo tên, tin nhắn hoặc bất động sản

### 💬 Chat Features

- **Bubble messages**: Tin nhắn hiển thị dạng bubble với màu sắc phân biệt
- **Avatar và thông tin**: Hiển thị avatar và thông tin người dùng
- **Thời gian**: Hiển thị thời gian gửi tin nhắn
- **Typing indicator**: Chỉ báo khi người khác đang nhập (UI ready)
- **Online status**: Hiển thị trạng thái online/offline

### 🏠 Property Integration

- **Thông tin BDS**: Hiển thị thông tin bất động sản liên quan trong chat
- **Quick actions**: Nút nhanh để xem chi tiết bất động sản từ chat
- **Context aware**: Chat được gắn với bất động sản cụ thể

## Cấu trúc File

```
src/
├── types/
│   └── chat.ts                 # Type definitions cho chat system
├── contexts/
│   └── chat-context.tsx        # Context quản lý state chat
├── components/
│   └── chat/
│       ├── index.ts            # Export tất cả components
│       ├── message-bubble.tsx  # Component hiển thị tin nhắn
│       ├── message-input.tsx   # Component nhập tin nhắn
│       ├── chat-list.tsx       # Danh sách cuộc trò chuyện
│       └── chat-window.tsx     # Cửa sổ chat chính
└── app/
    └── (site)/
        └── chat/
            └── page.tsx        # Trang chat chính
```

## Components

### 1. ChatContext (`src/contexts/chat-context.tsx`)

- Quản lý trạng thái global cho chat system
- Xử lý gửi tin nhắn, tải messages, cập nhật trạng thái
- Cung cấp mock data cho development

### 2. MessageBubble (`src/components/chat/message-bubble.tsx`)

- Hiển thị tin nhắn dạng bubble
- Hỗ trợ text, image, file messages
- Hiển thị trạng thái tin nhắn và thời gian
- Responsive design

### 3. MessageInput (`src/components/chat/message-input.tsx`)

- Input component cho việc nhập tin nhắn
- Hỗ trợ multiline text với auto-resize
- Upload file và hình ảnh
- Emoji picker (UI ready)

### 4. ChatList (`src/components/chat/chat-list.tsx`)

- Danh sách tất cả cuộc trò chuyện
- Tìm kiếm và filter
- Hiển thị tin nhắn cuối và số tin nhắn chưa đọc
- Thông tin bất động sản liên quan

### 5. ChatWindow (`src/components/chat/chat-window.tsx`)

- Cửa sổ chat chính với header, messages, và input
- Auto-scroll to bottom khi có tin nhắn mới
- Responsive cho mobile và desktop
- Header với thông tin user và actions

## Responsive Design

### Desktop (≥768px)

- Layout 2 cột: ChatList (cố định 320px) + ChatWindow
- Hiển thị đồng thời list và window

### Mobile (<768px)

- Layout single view với navigation
- Hiển thị ChatList hoặc ChatWindow tại một thời điểm
- Nút back để quay về danh sách

## Theme Integration

- Sử dụng màu chủ đạo `#DCBB87` (golden) của hệ thống
- Tích hợp với dark mode (theme provider)
- Consistent với design system hiện có

## Usage

### Truy cập Chat

- Click vào icon chat trong header
- URL: `/chat`
- Badge notification hiển thị số tin nhắn chưa đọc

### Gửi tin nhắn

1. Chọn cuộc trò chuyện từ danh sách
2. Nhập tin nhắn trong ô input
3. Nhấn Enter hoặc click nút Send
4. Hỗ trợ Shift+Enter cho xuống dòng

### Upload files

- Click icon paperclip để chọn file
- Click icon image để chọn hình ảnh
- Hỗ trợ: images, PDF, DOC, DOCX, TXT

## Mock Data

Hệ thống hiện tại sử dụng mock data bao gồm:

- 3 users mẫu (landlords và tenants)
- 2 cuộc trò chuyện mẫu
- Tin nhắn history
- Thông tin bất động sản liên quan

## Next Steps

- [ ] Tích hợp với API backend thực tế
- [ ] Implement real-time với WebSocket/Socket.io
- [ ] Push notifications
- [ ] Message encryption
- [ ] Advanced file sharing
- [ ] Voice messages
- [ ] Video calling integration
- [ ] Message reactions và replies
- [ ] Chat groups for multiple participants

## Technical Notes

- Sử dụng Next.js 15 với App Router
- TypeScript cho type safety
- Tailwind CSS cho styling
- Lucide React cho icons
- Shadcn/ui components
- React Context cho state management
