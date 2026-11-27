import { Search, RefreshCw, X, Filter } from "lucide-react";

import { roleLabels } from "../../types/auth";
import type { Role } from "../../types/auth";

import { roleOptions } from "../../types/user";
import type { UserStatusFilter } from "../../types/user";

interface Props {
  keyword: string;
  role: Role | "ALL";
  status: UserStatusFilter;
  loading: boolean;
  onKeywordChange: (value: string) => void;
  onRoleChange: (value: Role | "ALL") => void;
  onStatusChange: (value: UserStatusFilter) => void;
  onRefresh: () => void;
  onReset: () => void;
}

export default function UserFilters({
  keyword,
  role,
  status,
  loading,
  onKeywordChange,
  onRoleChange,
  onStatusChange,
  onRefresh,
  onReset,
}: Props) {
  const selectClass =
    "rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 outline-none focus:border-emerald-500";

  const hasFilters = keyword !== "" || role !== "ALL" || status !== "ALL";

  return (
    <div className="border-b border-slate-100 p-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-56 flex-1">
          <Search
            size={18}
            className="absolute left-3.5 top-3.5 text-slate-400"
          />

          <input
            value={keyword}
            onChange={(event) => onKeywordChange(event.target.value)}
            placeholder="Tìm tên, email, số điện thoại..."
            aria-label="Tìm kiếm nhân viên"
            className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-10 text-sm outline-none focus:border-emerald-500"
          />

          {keyword && (
            <button
              type="button"
              aria-label="Xóa từ khóa"
              onClick={() => onKeywordChange("")}
              className="absolute right-3 top-3.5 text-slate-400"
            >
              <X size={17} />
            </button>
          )}
        </div>

        <select
          value={role}
          aria-label="Lọc theo vai trò"
          onChange={(event) => onRoleChange(event.target.value as Role | "ALL")}
          className={selectClass}
        >
          <option value="ALL">Tất cả vai trò</option>

          {roleOptions.map((item) => (
            <option key={item} value={item}>
              {roleLabels[item]}
            </option>
          ))}
        </select>

        <select
          value={status}
          aria-label="Lọc theo trạng thái"
          onChange={(event) =>
            onStatusChange(event.target.value as UserStatusFilter)
          }
          className={selectClass}
        >
          <option value="ALL">Tất cả trạng thái</option>
          <option value="ACTIVE">Đang hoạt động</option>
          <option value="LOCKED">Đã khóa</option>
        </select>

        {hasFilters && (
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-2 rounded-xl px-3 py-3 text-sm font-medium text-slate-500 hover:bg-slate-50"
          >
            <Filter size={16} />
            Xóa bộ lọc
          </button>
        )}

        <button
          type="button"
          title="Làm mới dữ liệu"
          aria-label="Làm mới dữ liệu"
          disabled={loading}
          onClick={onRefresh}
          className="rounded-xl border border-slate-200 p-3 text-slate-600 hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
        </button>
      </div>
    </div>
  );
}
