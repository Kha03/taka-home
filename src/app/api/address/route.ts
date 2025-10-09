import { NextRequest, NextResponse } from "next/server";

// Mock data for Vietnamese administrative divisions
// In production, you should load this from a proper database or API
const vietnamData = {
  provinces: [
    { code: "01", name: "Hà Nội", type: "Thành phố Trung ương" },
    { code: "79", name: "TP. Hồ Chí Minh", type: "Thành phố Trung ương" },
    { code: "48", name: "Đà Nẵng", type: "Thành phố Trung ương" },
    { code: "31", name: "Hải Phòng", type: "Thành phố Trung ương" },
    { code: "92", name: "Cần Thơ", type: "Thành phố Trung ương" },
    { code: "02", name: "Hà Giang", type: "Tỉnh" },
    { code: "04", name: "Cao Bằng", type: "Tỉnh" },
    { code: "06", name: "Bắc Kạn", type: "Tỉnh" },
    { code: "08", name: "Tuyên Quang", type: "Tỉnh" },
    { code: "10", name: "Lào Cai", type: "Tỉnh" },
  ],
  districts: {
    "01": [
      { code: "001", name: "Ba Đình", type: "Quận" },
      { code: "002", name: "Hoàn Kiếm", type: "Quận" },
      { code: "003", name: "Tây Hồ", type: "Quận" },
      { code: "004", name: "Long Biên", type: "Quận" },
      { code: "005", name: "Cầu Giấy", type: "Quận" },
      { code: "006", name: "Đống Đa", type: "Quận" },
      { code: "007", name: "Hai Bà Trưng", type: "Quận" },
      { code: "008", name: "Hoàng Mai", type: "Quận" },
      { code: "009", name: "Thanh Xuân", type: "Quận" },
    ],
    "79": [
      { code: "760", name: "Quận 1", type: "Quận" },
      { code: "761", name: "Quận 12", type: "Quận" },
      { code: "762", name: "Quận Gò Vấp", type: "Quận" },
      { code: "763", name: "Quận Bình Thạnh", type: "Quận" },
      { code: "764", name: "Quận Tân Bình", type: "Quận" },
      { code: "765", name: "Quận Tân Phú", type: "Quận" },
      { code: "766", name: "Quận Phú Nhuận", type: "Quận" },
      { code: "767", name: "Thành phố Thủ Đức", type: "Thành phố" },
    ],
    "48": [
      { code: "490", name: "Hải Châu", type: "Quận" },
      { code: "491", name: "Thanh Khê", type: "Quận" },
      { code: "492", name: "Sơn Trà", type: "Quận" },
      { code: "493", name: "Ngũ Hành Sơn", type: "Quận" },
      { code: "494", name: "Liên Chiểu", type: "Quận" },
      { code: "495", name: "Cẩm Lệ", type: "Quận" },
    ],
  },
  wards: {
    "001": [
      { code: "00001", name: "Phúc Xá", type: "Phường" },
      { code: "00004", name: "Trúc Bạch", type: "Phường" },
      { code: "00006", name: "Vĩnh Phúc", type: "Phường" },
      { code: "00007", name: "Cống Vị", type: "Phường" },
      { code: "00008", name: "Liễu Giai", type: "Phường" },
    ],
    "760": [
      { code: "26734", name: "Tân Định", type: "Phường" },
      { code: "26737", name: "Đa Kao", type: "Phường" },
      { code: "26740", name: "Bến Nghé", type: "Phường" },
      { code: "26743", name: "Bến Thành", type: "Phường" },
      { code: "26746", name: "Nguyễn Thái Bình", type: "Phường" },
    ],
  },
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const level = searchParams.get("level"); // province, district, ward
    const provinceCode = searchParams.get("province");
    const districtCode = searchParams.get("district");
    
    switch (level) {
      case "province":
        return NextResponse.json({
          success: true,
          data: vietnamData.provinces,
        });
        
      case "district":
        if (!provinceCode) {
          return NextResponse.json(
            { success: false, message: "Thiếu mã tỉnh" },
            { status: 400 }
          );
        }
        
        const districts = vietnamData.districts[provinceCode as keyof typeof vietnamData.districts] || [];
        return NextResponse.json({
          success: true,
          data: districts,
        });
        
      case "ward":
        if (!districtCode) {
          return NextResponse.json(
            { success: false, message: "Thiếu mã quận/huyện" },
            { status: 400 }
          );
        }
        
        const wards = vietnamData.wards[districtCode as keyof typeof vietnamData.wards] || [];
        return NextResponse.json({
          success: true,
          data: wards,
        });
        
      default:
        return NextResponse.json(
          { success: false, message: "Level không hợp lệ. Sử dụng: province, district, ward" },
          { status: 400 }
        );
    }
    
  } catch (error) {
    console.error("Address API error:", error);
    
    return NextResponse.json(
      {
        success: false,
        message: "Có lỗi xảy ra khi tải dữ liệu địa chỉ.",
      },
      { status: 500 }
    );
  }
}