import { Eye, Pencil, Trash2, Users, LoaderCircle } from "lucide-react";

import { genderLabels, formatDate, type Patient } from "../../types/patient";

interface PatientTableProps {
  patients: Patient[];
  loading: boolean;
  deletingId: number | null;

  onView: (patient: Patient) => void;
  onEdit: (patient: Patient) => void;
  onDelete: (patient: Patient) => void;
}

export default function PatientTable({
  patients,
  loading,
  deletingId,
  onView,
  onEdit,
  onDelete,
}: PatientTableProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center gap-3 p-20 text-slate-500">
        <LoaderCircle size={24} className="animate-spin text-blue-600" />
        Đang tải danh sách bệnh nhân...
      </div>
    );
  }

  if (patients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-center">
        <div className="mb-4 rounded-full bg-slate-100 p-5">
          <Users size={36} className="text-slate-400" />
        </div>

        <h3 className="font-semibold text-slate-700">
          Không tìm thấy bệnh nhân
        </h3>

        <p className="mt-2 text-sm text-slate-400">
          Hãy thêm bệnh nhân mới hoặc thay đổi từ khóa tìm kiếm.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full whitespace-nowrap text-left text-sm">
        <thead className="border-b border-slate-100 bg-slate-50 text-slate-500">
          <tr>
            <th className="px-5 py-4 font-medium">Mã bệnh nhân</th>

            <th className="px-5 py-4 font-medium">Họ và tên</th>

            <th className="px-5 py-4 font-medium">Giới tính</th>

            <th className="px-5 py-4 font-medium">Ngày sinh</th>

            <th className="px-5 py-4 font-medium">Điện thoại</th>

            <th className="px-5 py-4 font-medium">Trạng thái</th>

            <th className="px-5 py-4 text-center font-medium">Thao tác</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {patients.map((patient) => (
            <tr key={patient.id} className="transition hover:bg-slate-50">
              <td className="px-5 py-4">
                <span
                  title={patient.patientCode}
                  className="font-medium text-blue-600"
                >
                  {patient.patientCode}
                </span>
              </td>

              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-semibold ${
                      patient.gender === "FEMALE"
                        ? "bg-pink-100 text-pink-600"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {patient.fullName
                      .trim()
                      .split(/\s+/)
                      .slice(-1)[0]
                      ?.charAt(0)
                      .toUpperCase()}
                  </div>

                  <div>
                    <p className="font-semibold text-slate-800">
                      {patient.fullName}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {patient.email || "Chưa có email"}
                    </p>
                  </div>
                </div>
              </td>

              <td className="px-5 py-4 text-slate-600">
                {genderLabels[patient.gender]}
              </td>

              <td className="px-5 py-4 text-slate-600">
                {formatDate(patient.dateOfBirth)}
              </td>

              <td className="px-5 py-4 text-slate-600">{patient.phone}</td>

              <td className="px-5 py-4">
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Hoạt động
                </span>
              </td>

              <td className="px-5 py-4">
                <div className="flex justify-center gap-2">
                  <button
                    title="Xem hồ sơ"
                    aria-label={`Xem hồ sơ ${patient.fullName}`}
                    onClick={() => onView(patient)}
                    className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                  >
                    <Eye size={18} />
                  </button>

                  <button
                    title="Chỉnh sửa"
                    aria-label={`Chỉnh sửa ${patient.fullName}`}
                    onClick={() => onEdit(patient)}
                    className="rounded-lg p-2 text-amber-600 hover:bg-amber-50"
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    title="Ngừng sử dụng hồ sơ"
                    aria-label={`Ngừng sử dụng hồ sơ ${patient.fullName}`}
                    disabled={deletingId !== null}
                    onClick={() => onDelete(patient)}
                    className="rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    {deletingId === patient.id ? (
                      <LoaderCircle size={18} className="animate-spin" />
                    ) : (
                      <Trash2 size={18} />
                    )}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
