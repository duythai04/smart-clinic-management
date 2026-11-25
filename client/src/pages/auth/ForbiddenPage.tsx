import { ShieldAlert } from "lucide-react";

import { Link } from "react-router-dom";

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-[75vh] items-center justify-center">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-50 text-red-500">
          <ShieldAlert size={48} />
        </div>

        <h1 className="text-6xl font-bold text-slate-900">403</h1>

        <h2 className="mt-4 text-2xl font-semibold text-slate-800">
          Không có quyền truy cập
        </h2>

        <p className="mt-3 text-slate-500">
          Tài khoản của bạn không được cấp quyền sử dụng chức năng này.
        </p>

        <Link
          to="/dashboard"
          className="mt-8 inline-flex rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Quay về tổng quan
        </Link>
      </div>
    </div>
  );
}
