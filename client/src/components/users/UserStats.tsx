import { Users, UserCheck, UserX, Stethoscope } from "lucide-react";

import type { UserSummary } from "../../types/user";

interface Props {
  summary: UserSummary | null;
  loading: boolean;
}

export default function UserStats({ summary, loading }: Props) {
  const stats = [
    {
      label: "Tổng nhân viên",
      value: summary?.totalUsers,
      icon: Users,
      color: "bg-blue-50 text-blue-600",
      description: "Tài khoản trong hệ thống",
    },
    {
      label: "Đang hoạt động",
      value: summary?.activeUsers,
      icon: UserCheck,
      color: "bg-emerald-50 text-emerald-600",
      description: "Có quyền đăng nhập",
    },
    {
      label: "Đã khóa",
      value: summary?.lockedUsers,
      icon: UserX,
      color: "bg-red-50 text-red-600",
      description: "Tài khoản bị vô hiệu hóa",
    },
    {
      label: "Tổng bác sĩ",
      value: summary?.totalDoctors,
      icon: Stethoscope,
      color: "bg-violet-50 text-violet-600",
      description: "Tài khoản có vai trò bác sĩ",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.label}
            className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {item.label}
                </p>

                <h2 className="mt-3 text-3xl font-bold text-slate-900">
                  {loading ? (
                    <span className="block h-9 w-14 animate-pulse rounded-lg bg-slate-100" />
                  ) : (
                    (item.value ?? "—")
                  )}
                </h2>
              </div>

              <div className={`rounded-2xl p-3.5 ${item.color}`}>
                <Icon size={24} />
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-400">{item.description}</p>
          </div>
        );
      })}
    </div>
  );
}
