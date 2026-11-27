import { useEffect, useState } from "react";
import {
  UserRound,
  Mail,
  Phone,
  CalendarDays,
  Clock,
  ShieldCheck,
  LoaderCircle,
  AlertCircle,
  Pencil,
  RefreshCw,
  Fingerprint,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";
import type { User } from "../../types/user";

import Modal from "../common/Modal";
import RoleBadge from "./RoleBadge";
import UserStatusBadge from "./UserStatusBadge";

import { userService } from "../../services/userService";
import { getApiError } from "../../services/api";

interface Props {
  userId: number;
  onClose: () => void;
  onEdit: (user: User) => void;
}

interface InfoFieldProps {
  icon: LucideIcon;
  label: string;
  value?: string | null;
}

function InfoField({ icon: Icon, label, value }: InfoFieldProps) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-100 p-4">
      <div className="rounded-lg bg-slate-50 p-2.5 text-slate-500">
        <Icon size={18} />
      </div>

      <div className="min-w-0">
        <p className="text-xs text-slate-400">{label}</p>

        <p className="mt-1 break-words text-sm font-medium text-slate-800">
          {value || "Chưa cập nhật"}
        </p>
      </div>
    </div>
  );
}

function formatDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("vi-VN");
}

export default function UserDetailModal({ userId, onClose, onEdit }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchUser() {
      setLoading(true);
      setError(nullError());

      try {
        const result = await userService.getById(userId, controller.signal);

        if (!controller.signal.aborted) {
          setUser(result);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setError(getApiError(error));
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void fetchUser();

    return () => controller.abort();
  }, [userId, refreshKey]);

  return (
    <Modal
      title="Chi tiết nhân viên"
      description="Thông tin tài khoản và quyền truy cập hệ thống"
      onClose={onClose}
      size="lg"
    >
      {loading ? (
        <div className="flex min-h-72 flex-col items-center justify-center gap-3">
          <LoaderCircle size={32} className="animate-spin text-emerald-600" />

          <p className="text-sm text-slate-500">
            Đang tải thông tin nhân viên...
          </p>
        </div>
      ) : error ? (
        <div className="flex min-h-72 flex-col items-center justify-center p-6 text-center">
          <AlertCircle size={36} className="text-red-500" />

          <h3 className="mt-4 font-semibold text-slate-800">
            Không thể tải thông tin
          </h3>

          <p className="mt-2 text-sm text-slate-500">{error}</p>

          <button
            type="button"
            onClick={() => setRefreshKey((previous) => previous + 1)}
            className="mt-5 flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm text-white"
          >
            <RefreshCw size={16} />
            Thử lại
          </button>
        </div>
      ) : user ? (
        <>
          <div className="space-y-6 p-6">
            <div className="flex flex-wrap items-center gap-5 rounded-2xl border border-emerald-100 bg-linear-to-r from-emerald-50 to-white p-5">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <UserRound size={38} />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-xl font-bold text-slate-900">
                  {user.fullName}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  NV-{String(user.id).padStart(5, "0")}
                </p>

                <div className="mt-3">
                  <UserStatusBadge active={user.active} />
                </div>
              </div>
            </div>

            <section>
              <h3 className="mb-4 font-semibold text-slate-800">
                Thông tin cá nhân
              </h3>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <InfoField
                  icon={UserRound}
                  label="Họ và tên"
                  value={user.fullName}
                />

                <InfoField
                  icon={Fingerprint}
                  label="Mã nhân viên"
                  value={`NV-${String(user.id).padStart(5, "0")}`}
                />

                <InfoField
                  icon={Mail}
                  label="Địa chỉ email"
                  value={user.email}
                />

                <InfoField
                  icon={Phone}
                  label="Số điện thoại"
                  value={user.phone}
                />

                <InfoField
                  icon={CalendarDays}
                  label="Ngày tạo tài khoản"
                  value={formatDateTime(user.createdAt)}
                />

                <InfoField
                  icon={Clock}
                  label="Cập nhật lần cuối"
                  value={formatDateTime(user.updatedAt)}
                />
              </div>
            </section>

            <section>
              <div className="mb-4 flex items-center gap-2">
                <ShieldCheck size={19} className="text-emerald-600" />

                <h3 className="font-semibold text-slate-800">
                  Vai trò và quyền truy cập
                </h3>
              </div>

              <div className="flex flex-wrap gap-2 rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                {user.roles.map((role) => (
                  <RoleBadge key={role} role={role} />
                ))}
              </div>
            </section>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              Đóng
            </button>

            <button
              type="button"
              onClick={() => onEdit(user)}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700"
            >
              <Pencil size={16} />
              Chỉnh sửa
            </button>
          </div>
        </>
      ) : null}
    </Modal>
  );
}

function nullError() {
  return "";
}
