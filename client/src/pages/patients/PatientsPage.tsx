import { useMemo, useState } from "react";

import { Search, Plus, Filter, Eye, Pencil } from "lucide-react";

import { patients } from "../../data/mockData";

export default function PatientsPage() {
  const [search, setSearch] = useState("");

  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      const keyword = search.toLowerCase();

      return (
        patient.name.toLowerCase().includes(keyword) ||
        patient.id.toLowerCase().includes(keyword) ||
        patient.phone.includes(keyword)
      );
    });
  }, [search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Quản lý bệnh nhân
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Quản lý thông tin và hồ sơ bệnh nhân
          </p>
        </div>

        <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl text-sm font-medium">
          <Plus size={18} />
          Thêm bệnh nhân
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="p-6 flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 w-full md:w-96">
            <Search size={18} className="text-slate-400" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Tìm theo tên, mã BN, số điện thoại..."
              className="bg-transparent outline-none w-full text-sm"
            />
          </div>

          <button className="flex items-center justify-center gap-2 border border-slate-200 rounded-xl px-5 py-3 text-sm text-slate-600 hover:bg-slate-50">
            <Filter size={18} />
            Bộ lọc
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="text-left px-6 py-4">Mã BN</th>
                <th className="text-left px-6 py-4">Họ tên</th>
                <th className="text-left px-6 py-4">Giới tính</th>
                <th className="text-left px-6 py-4">Ngày sinh</th>
                <th className="text-left px-6 py-4">Số điện thoại</th>
                <th className="text-left px-6 py-4">Trạng thái</th>
                <th className="text-left px-6 py-4">Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {filteredPatients.map((patient) => (
                <tr
                  key={patient.id}
                  className="border-t border-slate-100 hover:bg-slate-50"
                >
                  <td className="px-6 py-4 font-semibold text-emerald-700">
                    {patient.id}
                  </td>

                  <td className="px-6 py-4 font-medium">{patient.name}</td>

                  <td className="px-6 py-4">{patient.gender}</td>

                  <td className="px-6 py-4">{patient.birthDate}</td>

                  <td className="px-6 py-4">{patient.phone}</td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        patient.status === "Hoàn thành"
                          ? "bg-green-50 text-green-700"
                          : patient.status === "Đang khám"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-orange-50 text-orange-700"
                      }`}
                    >
                      {patient.status}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button
                        title="Xem hồ sơ"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Eye size={18} />
                      </button>

                      <button
                        title="Chỉnh sửa"
                        className="text-emerald-600 hover:text-emerald-800"
                      >
                        <Pencil size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredPatients.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              Không tìm thấy bệnh nhân phù hợp.
            </div>
          )}
        </div>

        <div className="p-5 border-t border-slate-100 text-sm text-slate-500">
          Hiển thị {filteredPatients.length} bệnh nhân
        </div>
      </div>
    </div>
  );
}
