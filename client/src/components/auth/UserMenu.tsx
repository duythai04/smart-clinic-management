import { useState } from "react";

import { LoaderCircle, LogOut } from "lucide-react";

import toast from "react-hot-toast";

import { useAuth } from "../../hooks/useAuth";

import { roleLabels } from "../../types/auth";

import { getApiError } from "../../services/api";

export default function UserMenu() {
  const { user, logout } = useAuth();

  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);

    try {
      await logout();

      toast.success("Đăng xuất thành công");
    } catch (error) {
      toast.error(getApiError(error));
    } finally {
      setLoggingOut(false);
    }
  };

  if (!user) {
    return null;
  }

  const initials = user.fullName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(-2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();

  return (
    <div className="flex items-center gap-3">
      {/* AVATAR */}

      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700">
        {initials || "U"}
      </div>

      {/* USER INFORMATION */}

      <div className="hidden sm:block">
        <p className="max-w-48 truncate text-sm font-semibold text-slate-800">
          {user.fullName}
        </p>

        <p className="text-xs text-slate-400">
          {user.roles.map((role) => roleLabels[role] ?? role).join(", ")}
        </p>
      </div>

      {/* LOGOUT */}

      <button
        type="button"
        onClick={handleLogout}
        disabled={loggingOut}
        title="Đăng xuất"
        aria-label="Đăng xuất"
        className="rounded-xl p-2.5 text-slate-500 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loggingOut ? (
          <LoaderCircle size={20} className="animate-spin" />
        ) : (
          <LogOut size={20} />
        )}
      </button>
    </div>
  );
}
