export type Gender = "MALE" | "FEMALE" | "OTHER";

export type BloodType =
  | "A_POSITIVE"
  | "A_NEGATIVE"
  | "B_POSITIVE"
  | "B_NEGATIVE"
  | "AB_POSITIVE"
  | "AB_NEGATIVE"
  | "O_POSITIVE"
  | "O_NEGATIVE"
  | "UNKNOWN";

export interface PatientRequest {
  fullName: string;
  gender: Gender;
  dateOfBirth: string;
  phone: string;

  email?: string | null;
  identityNumber?: string | null;
  address?: string | null;
  bloodType?: BloodType | null;
  allergies?: string | null;

  emergencyContactName?: string | null;
  emergencyContactPhone?: string | null;
}

export interface Patient extends PatientRequest {
  id: number;
  patientCode: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PatientPage {
  content: Patient[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export const genderLabels: Record<Gender, string> = {
  MALE: "Nam",
  FEMALE: "Nữ",
  OTHER: "Khác",
};

export const bloodTypeLabels: Record<BloodType, string> = {
  A_POSITIVE: "A+",
  A_NEGATIVE: "A-",
  B_POSITIVE: "B+",
  B_NEGATIVE: "B-",
  AB_POSITIVE: "AB+",
  AB_NEGATIVE: "AB-",
  O_POSITIVE: "O+",
  O_NEGATIVE: "O-",
  UNKNOWN: "Chưa xác định",
};

export function formatDate(date: string): string {
  return date.split("-").reverse().join("/");
}
