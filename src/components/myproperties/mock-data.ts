import { PropertyRoomProps } from "./PropertyRoom";
import { PropertyUnitProps } from "./PropertyUnit";

// Mock data cho PropertyRoom (quản lý theo phòng)
export const mockPropertyRooms: PropertyRoomProps[] = [
  {
    id: "PR001",
    title: "Căn hộ Saigon South Residences - Phòng A101",
    image: "/assets/imgs/house-item.png",
    status: "Đang cho thuê",
    roomCode: "A101",
    isRented: true,
    bedrooms: 2,
    bathrooms: 2,
    area: 75,
    address:
      "Nguyễn Xiển, Phường Long Thạnh Mỹ (Quận 9 cũ), Thành phố Thủ Đức, TP HCM",
    furnitureStatus: "Đầy đủ",
    category: "Chung cư",
    price: 15000000,
    currency: "VND",
  },
  {
    id: "PR002",
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
  },
  {
    id: "PR003",
    title: "Nhà phố Landmark 81 - Tầng 1",
    image: "/assets/imgs/house-item.png",
    status: "Đang cho thuê",
    roomCode: "LM101",
    isRented: true,
    bedrooms: 1,
    bathrooms: 1,
    area: 35,
    address: "Võ Văn Kiệt, Phường Cô Giang, Quận 1, TP HCM",
    furnitureStatus: "Không",
    category: "Nhà phố",
    price: 8000000,
    currency: "VND",
  },
  {
    id: "PR004",
    title: "Căn hộ Vinhomes Central Park - Tầng cao",
    image: "/assets/imgs/house-item.png",
    status: "Đang cho thuê",
    roomCode: "VCP301",
    isRented: true,
    bedrooms: 2,
    bathrooms: 2,
    area: 85,
    address: "208 Nguyễn Hữu Cảnh, Phường 22, Quận Bình Thạnh, TP HCM",
    furnitureStatus: "Đầy đủ",
    category: "Chung cư",
    price: 20000000,
    currency: "VND",
  },
  {
    id: "PR005",
    title: "Shophouse The Manor Central Park",
    image: "/assets/imgs/house-item.png",
    status: "Trống",
    roomCode: "MCP01",
    isRented: false,
    bedrooms: 0,
    bathrooms: 2,
    area: 150,
    address: "91 Nguyễn Hữu Cảnh, Phường 22, Quận Bình Thạnh, TP HCM",
    furnitureStatus: "Không",
    category: "Shophouse",
    price: 35000000,
    currency: "VND",
  },
];

// Mock data cho PropertyUnit (quản lý theo căn)
export const mockPropertyUnits: PropertyUnitProps[] = [
  {
    title: "Villa Archetype",
    address:
      "Nguyễn Xiển, Phường Long Thạnh Mỹ (Quận 9 cũ), Thành phố Thủ Đức, TP HCM",
    mainImage: "/assets/imgs/house-item.png",
    rentedCount: 6,
    emptyCount: 12,
    monthlyIncome: 52000000,
    currency: "VND",
    roomTypes: [
      {
        name: "Phòng loại 1/2",
        floors: [
          {
            floor: "Tầng trệt",
            units: [
              { code: "A001", status: "rented" },
              { code: "A002", status: "rented" },
              { code: "A003", status: "rented" },
              { code: "A004", status: "empty" },
            ],
          },
          {
            floor: "Tầng 1",
            units: [
              { code: "A101", status: "rented" },
              { code: "A102", status: "rented" },
              { code: "A103", status: "rented" },
              { code: "A104", status: "empty" },
              { code: "A105", status: "empty" },
            ],
          },
          {
            floor: "Tầng 2",
            units: [
              { code: "A201", status: "empty" },
              { code: "A202", status: "empty" },
              { code: "A203", status: "empty" },
            ],
          },
          {
            floor: "Tầng 3",
            units: [{ code: "A301", status: "empty" }],
          },
        ],
        bedrooms: 2,
        bathrooms: 2,
        area: 85,
        furniture: "Có",
        images: ["/assets/imgs/house-item.png", "/assets/imgs/house-item.png"],
        price: 12000000,
      },
      {
        name: "Phòng loại 2/2",
        floors: [
          {
            floor: "Tầng trệt",
            units: [
              { code: "A003", status: "empty" },
              { code: "A004", status: "empty" },
            ],
          },
          {
            floor: "Tầng 1",
            units: [
              { code: "A102", status: "rented" },
              { code: "A103", status: "empty" },
            ],
          },
          {
            floor: "Tầng 2",
            units: [{ code: "A201", status: "empty" }],
          },
          {
            floor: "Tầng 3",
            units: [{ code: "A301", status: "empty" }],
          },
        ],
        bedrooms: 1,
        bathrooms: 1,
        area: 25,
        furniture: "Không",
        images: ["/assets/imgs/house-item.png", "/assets/imgs/house-item.png"],
        price: 8000000,
      },
    ],
  },
  {
    title: "Saigon South Residences",
    address: "Nguyễn Văn Linh, Phường Tân Phong, Quận 7, TP HCM",
    mainImage: "/assets/imgs/house-item.png",
    rentedCount: 8,
    emptyCount: 4,
    monthlyIncome: 96000000,
    currency: "VND",
    roomTypes: [
      {
        name: "Studio",
        floors: [
          {
            floor: "Tầng 5",
            units: [
              { code: "S501", status: "rented" },
              { code: "S502", status: "rented" },
              { code: "S503", status: "empty" },
            ],
          },
          {
            floor: "Tầng 6",
            units: [
              { code: "S601", status: "rented" },
              { code: "S602", status: "empty" },
            ],
          },
        ],
        bedrooms: 1,
        bathrooms: 1,
        area: 35,
        furniture: "Đầy đủ",
        images: ["/assets/imgs/house-item.png", "/assets/imgs/house-item.png"],
        price: 10000000,
      },
      {
        name: "1 PN",
        floors: [
          {
            floor: "Tầng 7",
            units: [
              { code: "B701", status: "rented" },
              { code: "B702", status: "rented" },
              { code: "B703", status: "rented" },
            ],
          },
          {
            floor: "Tầng 8",
            units: [
              { code: "B801", status: "rented" },
              { code: "B802", status: "rented" },
              { code: "B803", status: "empty" },
              { code: "B804", status: "empty" },
            ],
          },
        ],
        bedrooms: 1,
        bathrooms: 1,
        area: 55,
        furniture: "Đầy đủ",
        images: ["/assets/imgs/house-item.png", "/assets/imgs/house-item.png"],
        price: 15000000,
      },
    ],
  },
];
