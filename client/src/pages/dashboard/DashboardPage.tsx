import {
  Users,
  CalendarDays,
  Activity,
  Wallet,
  ArrowUpRight,
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import StatCard from "../../components/common/StatCard";
import { revenueData, appointments } from "../../data/mockData";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Tổng quan phòng khám
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Theo dõi hoạt động và hiệu suất phòng khám
          </p>
        </div>

        <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
          <CalendarDays size={18} />
          Đặt lịch khám
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Tổng bệnh nhân"
          value="12.540"
          change="+12.5% so với tháng trước"
          icon={Users}
          color="emerald"
        />

        <StatCard
          title="Lịch hẹn hôm nay"
          value="125"
          change="+8.2% so với hôm qua"
          icon={CalendarDays}
          color="blue"
        />

        <StatCard
          title="Đang khám"
          value="18"
          change="12 bác sĩ đang làm việc"
          icon={Activity}
          color="orange"
        />

        <StatCard
          title="Doanh thu hôm nay"
          value="28,5 triệu"
          change="+15.3% so với hôm qua"
          icon={Wallet}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-semibold text-lg">Biểu đồ doanh thu</h2>

              <p className="text-sm text-slate-400">
                Thống kê doanh thu 7 ngày gần nhất
              </p>
            </div>

            <div className="flex items-center gap-2 text-emerald-600 text-sm font-semibold">
              <ArrowUpRight size={18} />
              +12.8%
            </div>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.25} />

                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e2e8f0"
                />

                <XAxis dataKey="name" axisLine={false} tickLine={false} />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `${value / 1000000}tr`}
                />

                <Tooltip
                  formatter={(value) =>
                    `${Number(value).toLocaleString("vi-VN")} đ`
                  }
                />

                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={3}
                  fill="url(#revenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="font-semibold text-lg mb-2">Hoạt động hôm nay</h2>

          <p className="text-sm text-slate-400 mb-6">
            Thống kê trạng thái bệnh nhân
          </p>

          <div className="space-y-6">
            {[
              {
                label: "Đã hoàn thành",
                value: 95,
                total: 125,
                color: "bg-emerald-500",
              },
              {
                label: "Đang khám",
                value: 18,
                total: 125,
                color: "bg-blue-500",
              },
              {
                label: "Đang chờ",
                value: 12,
                total: 125,
                color: "bg-orange-500",
              },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600">{item.label}</span>

                  <span className="font-semibold">{item.value}</span>
                </div>

                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full`}
                    style={{
                      width: `${(item.value / item.total) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 p-5 rounded-xl bg-emerald-50">
            <p className="text-sm text-emerald-700">
              Tổng số lượt khám hôm nay
            </p>

            <h3 className="text-3xl font-bold text-emerald-800 mt-2">125</h3>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-semibold">Lịch khám gần đây</h2>

          <p className="text-sm text-slate-400 mt-1">
            Danh sách lịch khám trong ngày
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="text-left px-6 py-4">Mã lịch</th>
                <th className="text-left px-6 py-4">Bệnh nhân</th>
                <th className="text-left px-6 py-4">Bác sĩ</th>
                <th className="text-left px-6 py-4">Chuyên khoa</th>
                <th className="text-left px-6 py-4">Giờ khám</th>
                <th className="text-left px-6 py-4">Trạng thái</th>
              </tr>
            </thead>

            <tbody>
              {appointments.map((appointment) => (
                <tr
                  key={appointment.id}
                  className="border-t border-slate-100 hover:bg-slate-50"
                >
                  <td className="px-6 py-4 font-medium">{appointment.id}</td>

                  <td className="px-6 py-4">{appointment.patient}</td>

                  <td className="px-6 py-4">{appointment.doctor}</td>

                  <td className="px-6 py-4">{appointment.department}</td>

                  <td className="px-6 py-4">{appointment.time}</td>

                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
                      {appointment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
