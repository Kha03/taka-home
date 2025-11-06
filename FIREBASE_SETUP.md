# Hướng dẫn cấu hình Firebase cho tính năng Quên mật khẩu

## Bước 1: Tạo Firebase Project

1. Truy cập [Firebase Console](https://console.firebase.google.com/)
2. Tạo project mới hoặc chọn project hiện có
3. Vào **Project Settings** (biểu tượng bánh răng) > **General**

## Bước 2: Thêm Web App

1. Trong phần **Your apps**, click vào biểu tượng **Web** (`</>`)
2. Đặt tên cho app (ví dụ: "Taka Home")
3. Copy các giá trị từ `firebaseConfig`

## Bước 3: Cấu hình Authentication

### 3.1. Bật Phone Authentication

1. Vào **Authentication** > **Sign-in method**
2. Click vào **Phone** trong danh sách providers
3. Click **Enable** và Save

### 3.2. Cấu hình reCAPTCHA

Firebase tự động sử dụng reCAPTCHA để bảo vệ phone authentication. Bạn cần:

1. Đảm bảo domain của bạn được thêm vào **Authorized domains** trong Authentication settings
2. Để test trên localhost, Firebase tự động cho phép

### 3.3. Test Phone Numbers (Optional - Chỉ dùng để test)

Nếu muốn test mà không cần SMS thật:

1. Vào **Authentication** > **Sign-in method** > **Phone**
2. Scroll xuống **Phone numbers for testing**
3. Thêm số điện thoại test và mã OTP (ví dụ: +84123456789 và 123456)

## Bước 4: Cấu hình Environment Variables

1. Copy file `.env.example` thành `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Điền các giá trị từ Firebase Config vào `.env.local`:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123...
   ```

## Bước 5: Cấu hình Backend API

Bạn cần tạo endpoint backend để xử lý reset password:

### Endpoint: `POST /api/reset-password`

**Request Body:**
```json
{
  "idToken": "eyJhbGc...",
  "newPassword": "newSecurePassword123"
}
```

**Backend Flow:**

1. Verify `idToken` với Firebase Admin SDK:
   ```javascript
   const decodedToken = await admin.auth().verifyIdToken(idToken);
   const phoneNumber = decodedToken.phone_number;
   ```

2. Tìm user trong database theo số điện thoại

3. Hash mật khẩu mới và cập nhật vào database

4. Return success response

### Ví dụ code backend (Node.js + Firebase Admin):

```javascript
// Cài đặt: npm install firebase-admin

const admin = require('firebase-admin');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  })
});

// API endpoint
app.post('/api/reset-password', async (req, res) => {
  try {
    const { idToken, newPassword } = req.body;

    // Verify idToken
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const phoneNumber = decodedToken.phone_number;

    if (!phoneNumber) {
      return res.status(400).json({ error: 'Invalid token' });
    }

    // Find user by phone number in your database
    const user = await findUserByPhone(phoneNumber);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password in database
    await updateUserPassword(user.id, hashedPassword);

    res.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});
```

## Bước 6: Test tính năng

1. Start development server:
   ```bash
   npm run dev
   ```

2. Truy cập `http://localhost:3001/forgot-password`

3. Chọn "Số điện thoại"

4. Nhập số điện thoại (định dạng: 0912345678 hoặc +84912345678)

5. Nhận mã OTP qua SMS và nhập vào form

6. Nhập mật khẩu mới và xác nhận

## Lưu ý

### Giới hạn SMS của Firebase

- **Spark Plan (Free)**: 
  - 10 SMS/ngày cho testing
  - Không dùng được cho production

- **Blaze Plan (Pay as you go)**:
  - Tính phí theo số SMS gửi
  - Giá: ~$0.01 - $0.10 per SMS (tùy quốc gia)

### Security Best Practices

1. **Rate Limiting**: Thêm rate limiting trên backend để tránh abuse
2. **Phone Validation**: Validate số điện thoại trên backend trước khi gửi OTP
3. **Token Expiry**: idToken có thời hạn 1 giờ, xử lý expired token
4. **HTTPS Only**: Chỉ dùng HTTPS cho production

### Xử lý lỗi phổ biến

- `auth/invalid-phone-number`: Số điện thoại không đúng định dạng E.164
- `auth/too-many-requests`: Quá nhiều request từ 1 IP
- `auth/quota-exceeded`: Vượt quá quota SMS của Firebase
- `auth/captcha-check-failed`: reCAPTCHA validation failed

## Tài liệu tham khảo

- [Firebase Phone Authentication](https://firebase.google.com/docs/auth/web/phone-auth)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Verify ID Tokens](https://firebase.google.com/docs/auth/admin/verify-id-tokens)
