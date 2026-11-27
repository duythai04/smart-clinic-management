import type { Role } from "./auth";

export interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string | null;
  active: boolean;
  roles: Role[];
  createdAt: string;
  updatedAt: string;
}

export interface RoleInfo {
  id: number;
  name: Role;
  description: string | null;
}

export interface CreateUserRequest {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
  roles: Role[];
}

export interface UpdateUserRequest {
  fullName: string;
  email: string;
  phone?: string;
}

export interface UpdateUserStatusRequest {
  active: boolean;
}

export interface UpdateUserRolesRequest {
  roles: Role[];
}

export interface ResetPasswordRequest {
  newPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UserPage {
  content: User[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface UserSummary {
  totalUsers: number;
  activeUsers: number;
  lockedUsers: number;
  totalAdmins: number;
  totalDoctors: number;
  totalReceptionists: number;
  totalPharmacists: number;
  totalLabTechnicians: number;
  totalCashiers: number;
}

export interface UserQuery {
  keyword?: string;
  role?: Role;
  active?: boolean;
  page?: number;
  size?: number;
}

export type UserStatusFilter = "ALL" | "ACTIVE" | "LOCKED";

export const roleOptions: Role[] = [
  "ADMIN",
  "DOCTOR",
  "RECEPTIONIST",
  "PHARMACIST",
  "LAB_TECHNICIAN",
  "CASHIER",
];
