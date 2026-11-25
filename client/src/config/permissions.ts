import type { Role } from "../types/auth";

export const permissions = {
  dashboard: [
    "ADMIN",
    "DOCTOR",
    "RECEPTIONIST",
    "PHARMACIST",
    "LAB_TECHNICIAN",
    "CASHIER",
  ],

  patients: ["ADMIN", "DOCTOR", "RECEPTIONIST"],

  appointments: ["ADMIN", "DOCTOR", "RECEPTIONIST"],

  reception: ["ADMIN", "DOCTOR", "RECEPTIONIST"],

  medical: ["DOCTOR"],

  pharmacy: ["ADMIN", "PHARMACIST"],

  laboratory: ["ADMIN", "DOCTOR", "LAB_TECHNICIAN"],

  billing: ["ADMIN", "CASHIER"],

  reports: ["ADMIN"],

  settings: ["ADMIN"],

  users: ["ADMIN"],

  patientCreate: ["ADMIN", "RECEPTIONIST"],

  patientEdit: ["ADMIN", "RECEPTIONIST"],

  patientDelete: ["ADMIN"],
} satisfies Record<string, Role[]>;
