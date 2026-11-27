import { useState } from "react";
import { AlertCircle, RefreshCw, ShieldCheck, UserPlus } from "lucide-react";

import UserStats from "../../components/users/UserStats";
import UserFilters from "../../components/users/UserFilters";
import UserTable from "../../components/users/UserTable";
import UserPagination from "../../components/users/UserPagination";
import UserForm from "../../components/users/UserForm";
import UserDetailModal from "../../components/users/UserDetailModal";

import { useUsers } from "../../hooks/useUsers";
import { useAuth } from "../../hooks/useAuth";

import type { User } from "../../types/user";

type UserModal =
  | { type: "create" }
  | { type: "edit"; user: User }
  | { type: "detail"; userId: number }
  | null;

export default function UsersPage() {
  const { user } = useAuth();

  const [modal, setModal] = useState<UserModal>(null);

  const {
    users,
    summary,
    keyword,
    setKeyword,
    role,
    setRole,
    status,
    setStatus,
    page,
    setPage,
    size,
    totalPages,
    totalElements,
    loading,
    summaryLoading,
    error,
    summaryError,
    refresh,
    resetFilters,
  } = useUsers();

  function closeModal() {
    setModal(null);
  }

  function handleSuccess() {
    closeModal();
    refresh();
  }

  function handleCreate() {
    setModal({ type: "create" });
  }

  function handleEdit(selectedUser: User) {
    setModal({
      type: "edit",
      user: selectedUser,
    });
  }

  function handleView(selectedUser: User) {
    setModal({
      type: "detail",
      userId: selectedUser.id,
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="mb-2 text-sm text-slate-400">
            Trang chủ / Quản lý nhân viên
          </p>

          <h1 className="text-2xl font-bold text-slate-900">
            Quản lý nhân viên
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Quản lý tài khoản, vai trò và quyền truy cập hệ thống
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            <ShieldCheck size={19} />
            Quyền quản trị viên
          </div>

          <button
            type="button"
            onClick={handleCreate}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 hover:shadow-md"
          >
            <UserPlus size={19} />
            Thêm nhân viên
          </button>
        </div>
      </div>

      <UserStats
        summary={summaryError ? null : summary}
        loading={summaryLoading}
      />

      {summaryError && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
          <span>Không thể tải thống kê: {summaryError}</span>

          <button
            type="button"
            onClick={refresh}
            className="font-semibold underline"
          >
            Thử lại
          </button>
        </div>
      )}

      <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 p-5">
          <div>
            <h2 className="font-semibold text-slate-900">
              Danh sách nhân viên
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Thông tin tài khoản và phân quyền trong hệ thống
            </p>
          </div>

          <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
            {loading || error ? "—" : totalElements} nhân viên
          </span>
        </div>

        <UserFilters
          keyword={keyword}
          role={role}
          status={status}
          loading={loading}
          onKeywordChange={setKeyword}
          onRoleChange={setRole}
          onStatusChange={setStatus}
          onRefresh={refresh}
          onReset={resetFilters}
        />

        {error ? (
          <div className="flex min-h-80 flex-col items-center justify-center p-8 text-center">
            <div className="rounded-full bg-red-50 p-4 text-red-500">
              <AlertCircle size={32} />
            </div>

            <h3 className="mt-4 font-semibold text-slate-800">
              Không thể tải danh sách nhân viên
            </h3>

            <p className="mt-2 text-sm text-slate-500">{error}</p>

            <button
              type="button"
              onClick={refresh}
              className="mt-5 flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700"
            >
              <RefreshCw size={16} />
              Thử lại
            </button>
          </div>
        ) : (
          <>
            <UserTable
              users={users}
              loading={loading}
              currentUserId={user?.id}
              onView={handleView}
              onEdit={handleEdit}
            />

            <UserPagination
              page={page}
              size={size}
              totalPages={totalPages}
              totalElements={totalElements}
              loading={loading}
              onPageChange={setPage}
            />
          </>
        )}
      </section>

      {modal?.type === "create" && (
        <UserForm onClose={closeModal} onSuccess={handleSuccess} />
      )}

      {modal?.type === "edit" && (
        <UserForm
          key={modal.user.id}
          user={modal.user}
          onClose={closeModal}
          onSuccess={handleSuccess}
        />
      )}

      {modal?.type === "detail" && (
        <UserDetailModal
          key={modal.userId}
          userId={modal.userId}
          onClose={closeModal}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
}
