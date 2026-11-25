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
  UserCog,
  X,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

import { NavLink } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";

import { permissions } from "../../config/permissions";

import type { Role } from "../../types/auth";

interface SidebarProps {
  collapsed: boolean;

  setCollapsed: (value: boolean) => void;

  mobile?: boolean;

  onClose?: () => void;
}

interface MenuItem {
  label: string;
  path: string;
  icon: LucideIcon;
  roles: Role[];
}

const menuItems: MenuItem[] = [
  {
    label: "Tổng quan",
    path: "/dashboard",
    icon: LayoutDashboard,
    roles: permissions.dashboard,
  },

  {
    label: "Bệnh nhân",
    path: "/patients",
    icon: Users,
    roles: permissions.patients,
  },

  {
    label: "Lịch hẹn",
    path: "/appointments",
    icon: CalendarDays,
    roles: permissions.appointments,
  },

  {
    label: "Tiếp đón",
    path: "/reception",
    icon: ClipboardList,
    roles: permissions.reception,
  },

  {
    label: "Khám bệnh",
    path: "/medical",
    icon: Stethoscope,
    roles: permissions.medical,
  },

  {
    label: "Nhà thuốc",
    path: "/pharmacy",
    icon: Pill,
    roles: permissions.pharmacy,
  },

  {
    label: "Xét nghiệm",
    path: "/laboratory",
    icon: FlaskConical,
    roles: permissions.laboratory,
  },

  {
    label: "Thanh toán",
    path: "/billing",
    icon: CreditCard,
    roles: permissions.billing,
  },

  {
    label: "Báo cáo",
    path: "/reports",
    icon: BarChart3,
    roles: permissions.reports,
  },

  {
    label: "Quản lý nhân viên",
    path: "/users",
    icon: UserCog,
    roles: permissions.users,
  },

  {
    label: "Cài đặt",
    path: "/settings",
    icon: Settings,
    roles: permissions.settings,
  },
];

export default function Sidebar({
  collapsed,
  setCollapsed,
  mobile = false,
  onClose,
}: SidebarProps) {
  const { hasRole } = useAuth();

  // Chỉ lấy những menu người dùng được phép truy cập.

  const visibleMenuItems = menuItems.filter((item) => hasRole(...item.roles));

  return (
    <aside
      className={`
        shrink-0
        flex-col
        border-r
        border-slate-200
        bg-white
        transition-all
        duration-300

        ${
          mobile
            ? "flex h-full w-64"
            : `hidden h-screen sticky top-0 md:flex ${
                collapsed ? "w-20" : "w-64"
              }`
        }
      `}
    >
      {/* LOGO */}

      <div className="flex h-20 shrink-0 items-center justify-between border-b border-slate-100 px-5">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="shrink-0 rounded-xl bg-emerald-600 p-2">
            <HeartPulse className="h-6 w-6 text-white" />
          </div>

          {!collapsed && (
            <div>
              <h1 className="text-xl font-bold text-emerald-700">MediClinic</h1>

              <p className="text-xs text-slate-400">Clinic Management</p>
            </div>
          )}
        </div>

        {mobile && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng menu"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* NAVIGATION */}

      <nav className="sidebar-scroll flex-1 space-y-1 overflow-y-auto px-3 py-5">
        {visibleMenuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={mobile ? onClose : undefined}
              title={collapsed ? item.label : undefined}
              aria-label={item.label}
              className={({ isActive }) =>
                `
                  flex items-center gap-3 rounded-xl
                  px-4 py-3 transition

                  ${
                    isActive
                      ? "bg-emerald-50 font-semibold text-emerald-700"
                      : "text-slate-600 hover:bg-slate-50"
                  }
                `
              }
            >
              <Icon size={20} className="shrink-0" />

              {!collapsed && <span className="text-sm">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* COLLAPSE BUTTON */}

      {!mobile && (
        <div className="border-t border-slate-100 p-3">
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Mở rộng menu" : "Thu gọn menu"}
            className="flex w-full items-center justify-center gap-2 rounded-xl p-3 text-slate-600 hover:bg-slate-100"
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
      )}
    </aside>
  );
}
