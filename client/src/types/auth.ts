export type Role =
  | "ADMIN"
  | "DOCTOR"
  | "RECEPTIONIST"
  | "PHARMACIST"
  | "LAB_TECHNICIAN"
  | "CASHIER";

export interface AuthUser {
  id: number;
  email: string;
  fullName: string;
  roles: Role[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: AuthUser;
}

export const roleLabels: Record<Role, string> = {
  ADMIN: "Quản trị viên",
  DOCTOR: "Bác sĩ",
  RECEPTIONIST: "Lễ tân",
  PHARMACIST: "Dược sĩ",
  LAB_TECHNICIAN: "Kỹ thuật viên xét nghiệm",
  CASHIER: "Thu ngân",
};
