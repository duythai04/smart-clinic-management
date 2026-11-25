import { Bell, Search, Menu } from "lucide-react";

import UserMenu from "../auth/UserMenu";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-4 md:px-8">
      {/* LEFT SECTION */}

      <div className="flex min-w-0 items-center gap-4">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Mở menu"
          className="rounded-lg p-2 hover:bg-slate-100 md:hidden"
        >
          <Menu size={22} />
        </button>

        <div className="min-w-0">
          <h2 className="truncate text-lg font-semibold text-slate-800">
            Hệ thống quản lý phòng khám
          </h2>

          <p className="text-xs text-slate-400">Chào mừng bạn quay trở lại!</p>
        </div>
      </div>

      {/* RIGHT SECTION */}

      <div className="flex shrink-0 items-center gap-3 md:gap-5">
        {/* SEARCH */}

        <div className="hidden items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 lg:flex">
          <Search size={18} className="text-slate-400" />

          <input
            placeholder="Tìm kiếm..."
            aria-label="Tìm kiếm"
            className="w-48 bg-transparent text-sm outline-none"
          />
        </div>

        {/* NOTIFICATION */}

        <button
          type="button"
          className="relative text-slate-500 hover:text-emerald-600"
          aria-label="Thông báo"
        >
          <Bell size={22} />

          <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-red-500" />
        </button>

        {/* AUTHENTICATED USER */}

        <div className="border-l border-slate-200 pl-3 md:pl-5">
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
