import { roleLabels } from "../../types/auth";
import type { Role } from "../../types/auth";

const roleStyles: Record<Role, string> = {
  ADMIN: "bg-purple-50 text-purple-700 ring-purple-200",
  DOCTOR: "bg-blue-50 text-blue-700 ring-blue-200",
  RECEPTIONIST: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  PHARMACIST: "bg-orange-50 text-orange-700 ring-orange-200",
  LAB_TECHNICIAN: "bg-cyan-50 text-cyan-700 ring-cyan-200",
  CASHIER: "bg-pink-50 text-pink-700 ring-pink-200",
};

export default function RoleBadge({ role }: { role: Role }) {
  return (
    <span
      className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${roleStyles[role]}`}
    >
      {roleLabels[role]}
    </span>
  );
}
