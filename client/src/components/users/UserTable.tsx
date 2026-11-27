import { UsersRound, LoaderCircle } from "lucide-react";

import RoleBadge from "./RoleBadge";
import UserStatusBadge from "./UserStatusBadge";
import UserActionMenu from "./UserActionMenu";

import type { User } from "../../types/user";

interface Props {
  users: User[];
  loading: boolean;
  currentUserId?: number;
  onView: (user: User) => void;
  onEdit: (user: User) => void;
}

function getInitials(fullName: string) {
  return fullName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(-2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("vi-VN");
}

const avatarColors = [
  "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-violet-100 text-violet-700",
  "bg-orange-100 text-orange-700",
  "bg-cyan-100 text-cyan-700",
];

export default function UserTable({
  users,
  loading,
  currentUserId,
  onView,
  onEdit,
}: Props) {
  if (loading) {
    return (
      <div className="flex min-h-80 flex-col items-center justify-center gap-3">
        <LoaderCircle size={32} className="animate-spin text-emerald-600" />

        <p className="text-sm text-slate-500">
          Đang tải danh sách nhân viên...
        </p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex min-h-80 flex-col items-center justify-center p-8 text-center">
        <div className="rounded-full bg-slate-100 p-5 text-slate-400">
          <UsersRound size={36} />
        </div>

        <h3 className="mt-4 font-semibold text-slate-800">
          Không tìm thấy nhân viên
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          Hãy thử thay đổi từ khóa hoặc bộ lọc tìm kiếm.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[950px] text-left">
        <thead className="border-b border-slate-100 bg-slate-50/80">
          <tr className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            <th className="px-6 py-4">Nhân viên</th>
            <th className="px-5 py-4">Liên hệ</th>
            <th className="px-5 py-4">Vai trò</th>
            <th className="px-5 py-4">Trạng thái</th>
            <th className="px-5 py-4">Ngày tạo</th>
            <th className="px-5 py-4 text-center">Thao tác</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {users.map((user) => (
            <tr key={user.id} className="transition hover:bg-slate-50/70">
              <td className="px-6 py-5">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
                      avatarColors[user.id % avatarColors.length]
                    }`}
                  >
                    {getInitials(user.fullName) || "U"}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onView(user)}
                        className="text-left text-sm font-semibold text-slate-800 hover:text-emerald-600"
                      >
                        {user.fullName}
                      </button>

                      {user.id === currentUserId && (
                        <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                          Bạn
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-xs text-slate-400">
                      NV-{String(user.id).padStart(5, "0")}
                    </p>
                  </div>
                </div>
              </td>

              <td className="px-5 py-5">
                <p className="text-sm text-slate-700">{user.email}</p>

                <p className="mt-1 text-xs text-slate-400">
                  {user.phone || "Chưa cập nhật"}
                </p>
              </td>

              <td className="px-5 py-5">
                <div className="flex max-w-56 flex-wrap gap-1.5">
                  {user.roles.map((role) => (
                    <RoleBadge key={role} role={role} />
                  ))}
                </div>
              </td>

              <td className="px-5 py-5">
                <UserStatusBadge active={user.active} />
              </td>

              <td className="whitespace-nowrap px-5 py-5 text-sm text-slate-500">
                {formatDate(user.createdAt)}
              </td>

              <td className="px-5 py-5 text-center">
                <UserActionMenu
                  onView={() => onView(user)}
                  onEdit={() => onEdit(user)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
