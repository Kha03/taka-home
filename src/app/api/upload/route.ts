import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "Không có file được gửi" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Định dạng file không được hỗ trợ. Chỉ chấp nhận JPG, PNG, WEBP.",
        },
        { status: 400 }
      );
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          success: false,
          message: "File quá lớn. Kích thước tối đa là 5MB.",
        },
        { status: 400 }
      );
    }

    // TODO: Here you would typically:
    // 1. Upload to cloud storage (Cloudinary, AWS S3, etc.)
    // 2. Get the public URL
    // 3. Optionally resize/optimize the image
    // 4. Save file metadata to database

    // Mock upload - replace with actual upload service
    const fileName = `${Date.now()}-${file.name}`;
    const mockUrl = `/uploads/${fileName}`;

    console.log(`Mock upload: ${file.name} -> ${mockUrl}`);

    return NextResponse.json({
      success: true,
      message: "Upload thành công",
      data: {
        url: mockUrl,
        fileName: fileName,
        originalName: file.name,
        size: file.size,
        type: file.type,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Có lỗi xảy ra khi upload file. Vui lòng thử lại.",
      },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve uploaded images
export async function GET() {
  try {
    // TODO: Get user's uploaded images from database
    // const userId = getCurrentUserId();
    // const images = await getUserImages(userId);

    return NextResponse.json({
      success: true,
      data: [],
    });
  } catch (error) {
    console.error("Get images error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Có lỗi xảy ra khi tải danh sách ảnh.",
      },
      { status: 500 }
    );
  }
}
