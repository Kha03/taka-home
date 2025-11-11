/**
 * User Types
 * Định nghĩa các types liên quan đến user
 */

export interface Account {
  id: string;
  email: string;
  isVerified: boolean;
  lastLoginAt: string | null;
  roles: string[];
}

export interface User {
  id: string;
  email: string;
  phone: string;
  fullName: string;
  isVerified: boolean;
  avatarUrl: string | null;
  status: "ACTIVE" | "INACTIVE" | "BLOCKED";
  CCCD: string | null;
  createdAt: string;
  updatedAt: string;
  account: Account;
}

export interface UsersListResponse {
  data: User[];
}
