import { Bell, Search, ChevronDown, Menu } from "lucide-react";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-lg hover:bg-slate-100"
        >
          <Menu size={22} />
        </button>

        <div>
          <h2 className="text-lg font-semibold text-slate-800">
            Hệ thống quản lý phòng khám
          </h2>
          <p className="text-xs text-slate-400">Chào mừng bạn quay trở lại!</p>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <div className="hidden lg:flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl">
          <Search size={18} className="text-slate-400" />
          <input
            placeholder="Tìm kiếm..."
            className="bg-transparent outline-none text-sm w-48"
          />
        </div>

        <button
          className="relative text-slate-500 hover:text-emerald-600"
          aria-label="Thông báo"
        >
          <Bell size={22} />

          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />
        </button>

        <div className="flex items-center gap-3 border-l pl-5 border-slate-200">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
            AD
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-semibold">Quản trị viên</p>
            <p className="text-xs text-slate-400">Administrator</p>
          </div>

          <ChevronDown size={16} className="text-slate-400" />
        </div>
      </div>
    </header>
  );
}
