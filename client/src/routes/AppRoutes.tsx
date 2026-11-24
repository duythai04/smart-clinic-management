import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";

import DashboardPage from "../pages/dashboard/DashboardPage";

import PatientsPage from "../pages/patients/PatientsPage";
import PatientDetailPage from "../pages/patients/PatientDetailPage";

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
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Dashboard */}
          <Route path="/dashboard" element={<DashboardPage />} />

          {/* Patient Management */}
          <Route path="/patients" element={<PatientsPage />} />

          {/* Patient Detail */}
          <Route path="/patients/:id" element={<PatientDetailPage />} />

          {/* Appointment Management */}
          <Route
            path="/appointments"
            element={<ComingSoon title="Quản lý lịch hẹn" />}
          />

          {/* Reception */}
          <Route
            path="/reception"
            element={<ComingSoon title="Tiếp đón bệnh nhân" />}
          />

          {/* Medical Examination */}
          <Route path="/medical" element={<ComingSoon title="Khám bệnh" />} />

          {/* Pharmacy Management */}
          <Route
            path="/pharmacy"
            element={<ComingSoon title="Quản lý nhà thuốc" />}
          />

          {/* Laboratory Management */}
          <Route
            path="/laboratory"
            element={<ComingSoon title="Quản lý xét nghiệm" />}
          />

          {/* Billing Management */}
          <Route path="/billing" element={<ComingSoon title="Thanh toán" />} />

          {/* Reports */}
          <Route path="/reports" element={<ComingSoon title="Báo cáo" />} />

          {/* Settings */}
          <Route
            path="/settings"
            element={<ComingSoon title="Cài đặt hệ thống" />}
          />

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
