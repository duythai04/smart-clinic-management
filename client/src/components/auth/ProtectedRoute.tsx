import { Navigate, Outlet } from "react-router-dom";

import { LoaderCircle } from "lucide-react";

import { useAuth } from "../../hooks/useAuth";

import type { Role } from "../../types/auth";

interface ProtectedRouteProps {
  allowedRoles?: Role[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { loading, isAuthenticated, hasRole } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50">
        <LoaderCircle className="h-10 w-10 animate-spin text-blue-600" />

        <p className="text-sm text-slate-500">
          Đang xác thực phiên đăng nhập...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !hasRole(...allowedRoles)) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
}
