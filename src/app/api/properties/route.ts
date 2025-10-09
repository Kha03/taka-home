import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Define the schema matching the frontend form
const PropertySubmissionSchema = z.object({
  title: z.string().min(1).max(100),
  kind: z.enum(["apartment", "boarding"]),
  province: z.string().min(1),
  district: z.string().min(1),
  ward: z.string().min(1),
  street: z.string().min(1),

  // Apartment specific
  block: z.string().optional(),
  floor: z.string().optional(),
  unit: z.string().optional(),

  // Boarding specific
  floors: z
    .array(
      z.object({
        name: z.string(),
        rooms: z.array(z.string()),
      })
    )
    .default([]),

  description: z.string().max(1500).optional(),

  // Details
  bedrooms: z.coerce.number().min(0).optional(),
  bathrooms: z.coerce.number().min(0).optional(),
  furnishing: z.string().optional(),
  legalDoc: z.string().optional(),
  area: z.coerce.number().min(0.1),
  price: z.coerce.number().min(0),
  deposit: z.coerce.number().min(0).optional(),

  heroImage: z.string().optional(),
  gallery: z.array(z.string()).max(8).default([]),

  // Boarding room types
  roomTypes: z
    .array(
      z.object({
        name: z.string().min(1),
        bedrooms: z.coerce.number().min(0).default(0),
        bathrooms: z.coerce.number().min(0).default(0),
        legalDoc: z.string().optional(),
        area: z.coerce.number().min(0.1),
        price: z.coerce.number().min(0),
        deposit: z.coerce.number().min(0).optional(),
        count: z.coerce.number().min(1),
        locations: z.array(z.string()).default([]),
        images: z.array(z.string()).max(8).default([]),
      })
    )
    .default([]),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the request body
    const validatedData = PropertySubmissionSchema.parse(body);

    // TODO: Here you would typically:
    // 1. Get the current user from session/auth
    // 2. Save the property to database
    // 3. Upload images to cloud storage
    // 4. Send notifications if needed

    console.log("Property submission:", validatedData);

    // Mock response - replace with actual database save
    const property = {
      id: `prop_${Date.now()}`,
      ...validatedData,
      status: "pending", // pending, approved, rejected
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // userId: currentUser.id, // from auth
    };

    return NextResponse.json({
      success: true,
      message: "Bất động sản đã được gửi thành công và đang chờ xét duyệt",
      data: property,
    });
  } catch (error) {
    console.error("Property submission error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Dữ liệu không hợp lệ",
          errors: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Có lỗi xảy ra khi gửi bất động sản. Vui lòng thử lại.",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status"); // pending, approved, rejected
    const kind = searchParams.get("kind"); // apartment, boarding

    // TODO: Get user from session and fetch their properties
    // const userId = getCurrentUserId();
    // const properties = await getPropertiesByUser(userId, { page, limit, status, kind });

    // Mock response for now
    const mockProperties = {
      data: [],
      pagination: {
        page,
        limit,
        total: 0,
        totalPages: 0,
      },
    };

    return NextResponse.json({
      success: true,
      ...mockProperties,
    });
  } catch (error) {
    console.error("Get properties error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Có lỗi xảy ra khi tải danh sách bất động sản.",
      },
      { status: 500 }
    );
  }
}
