import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";

import ProtectedRoute from "../components/auth/ProtectedRoute";

import LoginPage from "../pages/auth/LoginPage";
import ForbiddenPage from "../pages/auth/ForbiddenPage";

import DashboardPage from "../pages/dashboard/DashboardPage";

import PatientsPage from "../pages/patients/PatientsPage";
import PatientDetailPage from "../pages/patients/PatientDetailPage";

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
        {/* PUBLIC ROUTES */}

        <Route path="/login" element={<LoginPage />} />

        {/* AUTHENTICATED ROUTES */}

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            {/* DEFAULT ROUTE */}

            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* DASHBOARD */}

            <Route path="/dashboard" element={<DashboardPage />} />

            {/* FORBIDDEN */}

            <Route path="/403" element={<ForbiddenPage />} />

            {/* PATIENT MANAGEMENT */}

            <Route
              element={<ProtectedRoute allowedRoles={permissions.patients} />}
            >
              <Route path="/patients" element={<PatientsPage />} />

              <Route path="/patients/:id" element={<PatientDetailPage />} />
            </Route>

            {/* APPOINTMENT MANAGEMENT */}

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

            {/* RECEPTION */}

            <Route
              element={<ProtectedRoute allowedRoles={permissions.reception} />}
            >
              <Route
                path="/reception"
                element={<ComingSoon title="Tiếp đón bệnh nhân" />}
              />
            </Route>

            {/* MEDICAL EXAMINATION */}

            <Route
              element={<ProtectedRoute allowedRoles={permissions.medical} />}
            >
              <Route
                path="/medical"
                element={<ComingSoon title="Khám bệnh" />}
              />
            </Route>

            {/* PHARMACY */}

            <Route
              element={<ProtectedRoute allowedRoles={permissions.pharmacy} />}
            >
              <Route
                path="/pharmacy"
                element={<ComingSoon title="Quản lý nhà thuốc" />}
              />
            </Route>

            {/* LABORATORY */}

            <Route
              element={<ProtectedRoute allowedRoles={permissions.laboratory} />}
            >
              <Route
                path="/laboratory"
                element={<ComingSoon title="Quản lý xét nghiệm" />}
              />
            </Route>

            {/* BILLING */}

            <Route
              element={<ProtectedRoute allowedRoles={permissions.billing} />}
            >
              <Route
                path="/billing"
                element={<ComingSoon title="Thanh toán" />}
              />
            </Route>

            {/* REPORTS */}

            <Route
              element={<ProtectedRoute allowedRoles={permissions.reports} />}
            >
              <Route path="/reports" element={<ComingSoon title="Báo cáo" />} />
            </Route>

            {/* USER MANAGEMENT */}

            <Route
              element={<ProtectedRoute allowedRoles={permissions.users} />}
            >
              <Route
                path="/users"
                element={<ComingSoon title="Quản lý nhân viên" />}
              />
            </Route>

            {/* SETTINGS */}

            <Route
              element={<ProtectedRoute allowedRoles={permissions.settings} />}
            >
              <Route
                path="/settings"
                element={<ComingSoon title="Cài đặt hệ thống" />}
              />
            </Route>

            {/* FALLBACK */}

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
