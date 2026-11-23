import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";
import DashboardPage from "../pages/dashboard/DashboardPage";
import PatientsPage from "../pages/patients/PatientsPage";

function ComingSoon({ title }: { title: string }) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-10">
      <h1 className="text-2xl font-bold text-slate-800">{title}</h1>

      <p className="text-slate-500 mt-3">Chức năng đang được phát triển.</p>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route path="/dashboard" element={<DashboardPage />} />

          <Route path="/patients" element={<PatientsPage />} />

          <Route
            path="/appointments"
            element={<ComingSoon title="Quản lý lịch hẹn" />}
          />

          <Route
            path="/reception"
            element={<ComingSoon title="Tiếp đón bệnh nhân" />}
          />

          <Route path="/medical" element={<ComingSoon title="Khám bệnh" />} />

          <Route
            path="/pharmacy"
            element={<ComingSoon title="Quản lý nhà thuốc" />}
          />

          <Route
            path="/laboratory"
            element={<ComingSoon title="Quản lý xét nghiệm" />}
          />

          <Route path="/billing" element={<ComingSoon title="Thanh toán" />} />

          <Route path="/reports" element={<ComingSoon title="Báo cáo" />} />

          <Route
            path="/settings"
            element={<ComingSoon title="Cài đặt hệ thống" />}
          />

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
