import {
  LayoutDashboard,
  Users,
  CalendarDays,
  ClipboardList,
  Stethoscope,
  Pill,
  FlaskConical,
  CreditCard,
  BarChart3,
  Settings,
  HeartPulse,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { NavLink } from "react-router-dom";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
}

const menuItems = [
  {
    label: "Tổng quan",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Bệnh nhân",
    path: "/patients",
    icon: Users,
  },
  {
    label: "Lịch hẹn",
    path: "/appointments",
    icon: CalendarDays,
  },
  {
    label: "Tiếp đón",
    path: "/reception",
    icon: ClipboardList,
  },
  {
    label: "Khám bệnh",
    path: "/medical",
    icon: Stethoscope,
  },
  {
    label: "Nhà thuốc",
    path: "/pharmacy",
    icon: Pill,
  },
  {
    label: "Xét nghiệm",
    path: "/laboratory",
    icon: FlaskConical,
  },
  {
    label: "Thanh toán",
    path: "/billing",
    icon: CreditCard,
  },
  {
    label: "Báo cáo",
    path: "/reports",
    icon: BarChart3,
  },
  {
    label: "Cài đặt",
    path: "/settings",
    icon: Settings,
  },
];

export default function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  return (
    <aside
      className={`hidden md:flex h-screen sticky top-0 bg-white border-r border-slate-200 flex-col transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="h-20 flex items-center justify-between px-5 border-b border-slate-100">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="bg-emerald-600 p-2 rounded-xl">
            <HeartPulse className="text-white w-6 h-6" />
          </div>

          {!collapsed && (
            <div>
              <h1 className="font-bold text-xl text-emerald-700">MediClinic</h1>
              <p className="text-xs text-slate-400">Clinic Management</p>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto sidebar-scroll px-3 py-5 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700 font-semibold"
                    : "text-slate-600 hover:bg-slate-50"
                }`
              }
            >
              <Icon size={20} className="shrink-0" />

              {!collapsed && <span className="text-sm">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-3 border-t border-slate-100">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex justify-center items-center gap-2 p-3 rounded-xl hover:bg-slate-100 text-slate-600"
        >
          {collapsed ? (
            <ChevronRight size={20} />
          ) : (
            <>
              <ChevronLeft size={20} />
              <span className="text-sm">Thu gọn</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
