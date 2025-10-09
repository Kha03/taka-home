import { PropertyStatus } from "./PropertyApprovalItem";

export interface PropertyApprovalData {
  id: string;
  title: string;
  beds: number;
  baths: number;
  areaM2: number;
  priceMonthly: number;
  updatedAt: Date;
  location: string;
  images: string[];
  status: PropertyStatus;
  category: string;
  description?: string;
}

export const mockPropertyApprovalData: PropertyApprovalData[] = [
  {
    id: "1",
    title: "Villa Archetype - Luxury Living Space",
    beds: 4,
    baths: 2,
    areaM2: 1520,
    priceMonthly: 12000000,
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    location:
      "Nguyen Xiển, Phường Long Thạnh Mỹ (Quận 9 cũ), Thành phố Thủ Đức, Tp Hồ Chí Minh",
    images: [
      "/assets/imgs/house-item.png",
      "/assets/imgs/about-us.png",
      "/assets/imgs/banner.png",
      "/assets/imgs/DetailBDS.png",
      "/assets/imgs/DetailBDS2.png",
    ],
    status: "cho-duyet",
    category: "Villa",
    description:
      "Luxury villa with modern amenities and beautiful garden view.",
  },
  {
    id: "2",
    title: "Modern Apartment in District 1",
    beds: 2,
    baths: 1,
    areaM2: 85,
    priceMonthly: 8500000,
    updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    location: "Đường Đồng Khởi, Phường Bến Nghé, Quận 1, Tp Hồ Chí Minh",
    images: [
      "/assets/imgs/DetailBDS.png",
      "/assets/imgs/house-item.png",
      "/assets/imgs/about-us.png",
      "/assets/imgs/banner.png",
      "/assets/imgs/DetailBDS2.png",
    ],
    status: "cho-duyet",
    category: "Apartment",
    description:
      "Modern apartment in the heart of the city with great amenities.",
  },
  {
    id: "3",
    title: "Cozy House in Thu Duc City",
    beds: 3,
    baths: 2,
    areaM2: 120,
    priceMonthly: 6500000,
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    location: "Phường Linh Xuân, Thành phố Thủ Đức, Tp Hồ Chí Minh",
    images: [
      "/assets/imgs/DetailBDS2.png",
      "/assets/imgs/house-item.png",
      "/assets/imgs/about-us.png",
      "/assets/imgs/banner.png",
      "/assets/imgs/DetailBDS.png",
    ],
    status: "da-duyet",
    category: "House",
    description: "Comfortable family house with garden and parking space.",
  },
  {
    id: "4",
    title: "Studio Apartment Near University",
    beds: 1,
    baths: 1,
    areaM2: 45,
    priceMonthly: 4200000,
    updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    location: "Phường Đông Hòa, Thành phố Dĩ An, Tỉnh Bình Dương",
    images: [
      "/assets/imgs/banner.png",
      "/assets/imgs/house-item.png",
      "/assets/imgs/about-us.png",
      "/assets/imgs/DetailBDS.png",
      "/assets/imgs/DetailBDS2.png",
    ],
    status: "cho-duyet",
    category: "Studio",
    description:
      "Perfect for students, close to university and public transport.",
  },
  {
    id: "5",
    title: "Luxury Penthouse with City View",
    beds: 3,
    baths: 2,
    areaM2: 180,
    priceMonthly: 25000000,
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    location: "Phường Bến Thành, Quận 1, Tp Hồ Chí Minh",
    images: [
      "/assets/imgs/about-us.png",
      "/assets/imgs/house-item.png",
      "/assets/imgs/banner.png",
      "/assets/imgs/DetailBDS.png",
      "/assets/imgs/DetailBDS2.png",
    ],
    status: "tu-choi",
    category: "Penthouse",
    description:
      "Luxury penthouse with panoramic city view and premium finishes.",
  },
  {
    id: "6",
    title: "Family House in Binh Thanh",
    beds: 4,
    baths: 3,
    areaM2: 200,
    priceMonthly: 15000000,
    updatedAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    location: "Phường 25, Quận Bình Thạnh, Tp Hồ Chí Minh",
    images: [
      "/assets/imgs/house-item.png",
      "/assets/imgs/about-us.png",
      "/assets/imgs/banner.png",
      "/assets/imgs/DetailBDS.png",
      "/assets/imgs/DetailBDS2.png",
    ],
    status: "da-duyet",
    category: "House",
    description:
      "Spacious family house with modern kitchen and large living area.",
  },
  {
    id: "7",
    title: "Townhouse in Go Vap District",
    beds: 3,
    baths: 2,
    areaM2: 150,
    priceMonthly: 9500000,
    updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    location: "Phường 6, Quận Gò Vấp, Tp Hồ Chí Minh",
    images: [
      "/assets/imgs/DetailBDS.png",
      "/assets/imgs/house-item.png",
      "/assets/imgs/about-us.png",
      "/assets/imgs/banner.png",
      "/assets/imgs/DetailBDS2.png",
    ],
    status: "cho-duyet",
    category: "Townhouse",
    description: "Modern townhouse with rooftop terrace and garage.",
  },
  {
    id: "8",
    title: "Budget Apartment in Tan Binh",
    beds: 2,
    baths: 1,
    areaM2: 70,
    priceMonthly: 5500000,
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    location: "Phường 2, Quận Tân Bình, Tp Hồ Chí Minh",
    images: [
      "/assets/imgs/DetailBDS2.png",
      "/assets/imgs/house-item.png",
      "/assets/imgs/about-us.png",
      "/assets/imgs/banner.png",
      "/assets/imgs/DetailBDS.png",
    ],
    status: "tu-choi",
    category: "Apartment",
    description:
      "Affordable apartment near airport, suitable for young professionals.",
  },
];

export const getPropertiesByStatus = (status?: PropertyStatus | "all") => {
  if (!status || status === "all") {
    return mockPropertyApprovalData;
  }
  return mockPropertyApprovalData.filter(
    (property) => property.status === status
  );
};

export const getPropertyCounts = () => {
  const all = mockPropertyApprovalData.length;
  const pending = mockPropertyApprovalData.filter(
    (p) => p.status === "cho-duyet"
  ).length;
  const approved = mockPropertyApprovalData.filter(
    (p) => p.status === "da-duyet"
  ).length;
  const rejected = mockPropertyApprovalData.filter(
    (p) => p.status === "tu-choi"
  ).length;

  return { all, pending, approved, rejected };
};
