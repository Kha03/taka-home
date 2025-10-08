import { PropertyRoomProps } from "@/components/myproperties/PropertyRoom";

// Mock data properties cho trang rental requests
export const mockRentalRequestProperties: PropertyRoomProps[] = [
  {
    id: "RRP001",
    title: "Căn hộ Saigon South Residences - Phòng A101",
    image: "/assets/imgs/house-item.png",
    status: "Trống",
    roomCode: "A101",
    isRented: false,
    bedrooms: 2,
    bathrooms: 2,
    area: 75,
    address:
      "Nguyễn Xiển, Phường Long Thạnh Mỹ (Quận 9 cũ), Thành phố Thủ Đức, TP HCM",
    furnitureStatus: "Đầy đủ",
    category: "Chung cư",
    price: 15000000,
    currency: "VND",
    showRentalStatus: true,
    rentalRequests: [
      {
        user: {
          name: "Nguyễn Văn A",
          avatar: "/assets/imgs/avatar.png",
        },
        status: "pending" as const,
        timestamp: "2 giờ trước",
      },
    ],
  },
  {
    id: "RRP002",
    title: "Biệt thự Villa Archetype - Khu A",
    image: "/assets/imgs/house-item.png",
    status: "Trống",
    roomCode: "VLA01",
    isRented: false,
    bedrooms: 3,
    bathrooms: 3,
    area: 120,
    address:
      "Nguyễn Xiển, Phường Long Thạnh Mỹ (Quận 9 cũ), Thành phố Thủ Đức, TP HCM",
    furnitureStatus: "Cơ bản",
    category: "Biệt thự",
    price: 25000000,
    currency: "VND",
    showRentalStatus: true,
    rentalRequests: [
      {
        user: {
          name: "Trần Thị B",
          avatar: "/assets/imgs/avatar.png",
        },
        status: "approved" as const,
        timestamp: "1 ngày trước",
      },
    ],
  },
  {
    id: "RRP003",
    title: "Nhà phố Landmark 81 - Tầng 1",
    image: "/assets/imgs/house-item.png",
    status: "Trống",
    roomCode: "LM101",
    isRented: false,
    bedrooms: 1,
    bathrooms: 1,
    area: 35,
    address: "Võ Văn Kiệt, Phường Cô Giang, Quận 1, TP HCM",
    furnitureStatus: "Không",
    category: "Nhà phố",
    price: 12000000,
    currency: "VND",
    showRentalStatus: true,
    rentalRequests: [
      {
        user: {
          name: "Lê Văn C",
          avatar: "/assets/imgs/avatar.png",
        },
        status: "rejected" as const,
        reason: "Không đáp ứng yêu cầu về thu nhập",
        timestamp: "3 ngày trước",
      },
      {
        user: {
          name: "Lê Văn C",
          avatar: "/assets/imgs/avatar.png",
        },
        status: "pending" as const,
        reason: "Không đáp ứng yêu cầu về thu nhập",
        timestamp: "3 ngày trước",
      },
      {
        user: {
          name: "Lê Văn C",
          avatar: "/assets/imgs/avatar.png",
        },
        status: "approved" as const,
        reason: "Không đáp ứng yêu cầu về thu nhập",
        timestamp: "3 ngày trước",
      },
    ],
  },
  {
    id: "RRP004",
    title: "Studio Vinhomes Grand Park",
    image: "/assets/imgs/house-item.png",
    status: "Trống",
    roomCode: "VGP201",
    isRented: false,
    bedrooms: 1,
    bathrooms: 1,
    area: 45,
    address: "Nguyễn Xiển, Phường Long Thạnh Mỹ, Thành phố Thủ Đức, TP HCM",
    furnitureStatus: "Đầy đủ",
    category: "Studio",
    price: 8000000,
    currency: "VND",
    showRentalStatus: true,
    rentalRequests: [
      {
        user: {
          name: "Phạm Thị D",
          avatar: "/assets/imgs/avatar.png",
        },
        status: "pending" as const,
        timestamp: "5 giờ trước",
      },
    ],
  },
];
