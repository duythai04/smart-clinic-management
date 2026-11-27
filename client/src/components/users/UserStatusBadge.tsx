export default function UserStatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium ${
        active ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
      }`}
    >
      <span
        className={`h-2 w-2 rounded-full ${
          active ? "bg-emerald-500" : "bg-red-500"
        }`}
      />

      {active ? "Hoạt động" : "Đã khóa"}
    </span>
  );
}
