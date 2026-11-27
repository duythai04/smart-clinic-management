import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";
import ProtectedRoute from "../components/auth/ProtectedRoute";

import LoginPage from "../pages/auth/LoginPage";
import ForbiddenPage from "../pages/auth/ForbiddenPage";
import DashboardPage from "../pages/dashboard/DashboardPage";
import PatientsPage from "../pages/patients/PatientsPage";
import PatientDetailPage from "../pages/patients/PatientDetailPage";
import UsersPage from "../pages/users/UsersPage";

import { permissions } from "../config/permissions";

function ComingSoon({ title }: { title: string }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-10">
      <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
      <p className="mt-3 text-slate-500">Chức năng đang được phát triển.</p>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/403" element={<ForbiddenPage />} />

            <Route
              element={<ProtectedRoute allowedRoles={permissions.patients} />}
            >
              <Route path="/patients" element={<PatientsPage />} />
              <Route path="/patients/:id" element={<PatientDetailPage />} />
            </Route>

            <Route
              element={
                <ProtectedRoute allowedRoles={permissions.appointments} />
              }
            >
              <Route
                path="/appointments"
                element={<ComingSoon title="Quản lý lịch hẹn" />}
              />
            </Route>

            <Route
              element={<ProtectedRoute allowedRoles={permissions.reception} />}
            >
              <Route
                path="/reception"
                element={<ComingSoon title="Tiếp đón bệnh nhân" />}
              />
            </Route>

            <Route
              element={<ProtectedRoute allowedRoles={permissions.medical} />}
            >
              <Route
                path="/medical"
                element={<ComingSoon title="Khám bệnh" />}
              />
            </Route>

            <Route
              element={<ProtectedRoute allowedRoles={permissions.pharmacy} />}
            >
              <Route
                path="/pharmacy"
                element={<ComingSoon title="Quản lý nhà thuốc" />}
              />
            </Route>

            <Route
              element={<ProtectedRoute allowedRoles={permissions.laboratory} />}
            >
              <Route
                path="/laboratory"
                element={<ComingSoon title="Quản lý xét nghiệm" />}
              />
            </Route>

            <Route
              element={<ProtectedRoute allowedRoles={permissions.billing} />}
            >
              <Route
                path="/billing"
                element={<ComingSoon title="Thanh toán" />}
              />
            </Route>

            <Route
              element={<ProtectedRoute allowedRoles={permissions.reports} />}
            >
              <Route path="/reports" element={<ComingSoon title="Báo cáo" />} />
            </Route>

            <Route
              element={<ProtectedRoute allowedRoles={permissions.users} />}
            >
              <Route path="/users" element={<UsersPage />} />
            </Route>

            <Route
              element={<ProtectedRoute allowedRoles={permissions.settings} />}
            >
              <Route
                path="/settings"
                element={<ComingSoon title="Cài đặt hệ thống" />}
              />
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
