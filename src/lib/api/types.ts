/**
 * API Types cho Taka Home
 * Định nghĩa các interface và type cho API responses
 */

// ========== Standard API Response Format ==========
export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data?: T;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: PaginationMeta;
}

// ========== Address Types (Vietnam API) ==========
export interface Province {
  name: string;
  code: number;
  division_type: string;
  codename: string;
  phone_code: number;
  wards?: Ward[];
}

export interface Ward {
  name: string;
  code: number;
  division_type: string;
  codename: string;
  province_code: number;
}

export interface AddressData {
  provinces: Province[];
  wards: Ward[];
}

// ========== Property Types ==========
export interface PropertyRoomType {
  name: string;
  bedrooms: number;
  bathrooms: number;
  legalDoc?: string;
  area: number;
  price: number;
  deposit?: number;
  description?: string;
  gallery: string[];
}

export interface PropertyFloor {
  name: string;
  rooms: string[];
}

export interface Property {
  id: string;
  title: string;
  kind: "apartment" | "boarding";

  // Location
  province: string;
  district: string;
  ward: string;
  street: string;

  // Apartment specific
  block?: string;
  floor?: string;
  unit?: string;

  // Boarding specific
  floors: PropertyFloor[];

  description?: string;

  // Details
  bedrooms?: number;
  bathrooms?: number;
  furnishing?: string;
  legalDoc?: string;
  area: number;
  price: number;
  deposit?: number;

  // Images
  heroImage?: string;
  gallery: string[];

  // Room types for boarding
  roomTypes: PropertyRoomType[];

  // Metadata
  status: "draft" | "pending" | "approved" | "rejected";
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyCreateRequest {
  title: string;
  kind: "apartment" | "boarding";
  province: string;
  district: string;
  ward: string;
  street: string;
  block?: string;
  floor?: string;
  unit?: string;
  floors?: PropertyFloor[];
  description?: string;
  bedrooms?: number;
  bathrooms?: number;
  furnishing?: string;
  legalDoc?: string;
  area: number;
  price: number;
  deposit?: number;
  heroImage?: string;
  gallery?: string[];
  roomTypes?: PropertyRoomType[];
}

export interface PropertyUpdateRequest extends Partial<PropertyCreateRequest> {
  id: string;
}

export interface PropertySearchParams {
  q?: string; // search query
  kind?: "apartment" | "boarding";
  province?: string;
  district?: string;
  ward?: string;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  bedrooms?: number;
  bathrooms?: number;
  furnishing?: string;
  page?: number;
  limit?: number;
  sortBy?: "price" | "area" | "createdAt";
  sortOrder?: "asc" | "desc";
}

// ========== Chat Types ==========
export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: "text" | "image" | "file";
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Chat {
  id: string;
  participants: string[];
  propertyId?: string;
  lastMessage?: ChatMessage;
  createdAt: string;
  updatedAt: string;
}

export interface ChatCreateRequest {
  receiverId: string;
  propertyId?: string;
  initialMessage?: string;
}

export interface MessageSendRequest {
  chatId: string;
  content: string;
  type?: "text" | "image" | "file";
}

// ========== Contract Types ==========
export interface Contract {
  id: string;
  propertyId: string;
  landlordId: string;
  tenantId: string;
  roomTypeId?: string; // For boarding houses

  // Contract terms
  startDate: string;
  endDate: string;
  monthlyRent: number;
  deposit: number;
  utilities?: string[];

  // Contract details
  terms: string;
  status: "draft" | "pending" | "active" | "expired" | "terminated";

  // Signatures
  landlordSigned: boolean;
  tenantSigned: boolean;
  landlordSignedAt?: string;
  tenantSignedAt?: string;

  createdAt: string;
  updatedAt: string;
}

export interface ContractCreateRequest {
  propertyId: string;
  tenantId: string;
  roomTypeId?: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  deposit: number;
  utilities?: string[];
  terms: string;
}

export interface ContractUpdateRequest extends Partial<ContractCreateRequest> {
  id: string;
}

// ========== Rental Request Types ==========
export interface RentalRequest {
  id: string;
  propertyId: string;
  requesterId: string;
  roomTypeId?: string; // For boarding houses

  message: string;
  status: "pending" | "approved" | "rejected" | "withdrawn";

  // Requested terms
  desiredMoveInDate: string;
  desiredLeaseDuration: number; // in months

  createdAt: string;
  updatedAt: string;
}

export interface RentalRequestCreateRequest {
  propertyId: string;
  roomTypeId?: string;
  message: string;
  desiredMoveInDate: string;
  desiredLeaseDuration: number;
}

export interface RentalRequestUpdateRequest {
  id: string;
  status: "approved" | "rejected" | "withdrawn";
  responseMessage?: string;
}

// ========== Auth Types ==========
export interface User {
  id: string;
  fullName: string;
  avatarUrl?: string;
  status: "ACTIVE" | "INACTIVE" | "BANNED";
  phone?: string;
}

export interface Account {
  id: string;
  email: string;
  roles: ("TENANT" | "LANDLORD" | "ADMIN")[];
  isVerified: boolean;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName?: string;
  phone?: string;
  roles?: ("TENANT" | "LANDLORD")[];
}

export interface AuthResponse {
  accessToken: string;
  account: Account;
}

export interface RegisterResponse {
  message: string;
}

// ========== Upload Types ==========
export interface UploadResponse {
  url: string;
  filename: string;
  size: number;
  mimetype: string;
}

export interface MultipleUploadResponse {
  files: UploadResponse[];
}
