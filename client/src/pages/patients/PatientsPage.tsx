import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Plus,
  Search,
  Users,
  RefreshCw,
  AlertCircle,
  X,
  Trash2,
} from "lucide-react";

import toast from "react-hot-toast";

import PatientForm from "../../components/patients/PatientForm";
import PatientTable from "../../components/patients/PatientTable";
import PatientPagination from "../../components/patients/PatientPagination";

import { usePatients } from "../../hooks/usePatients";

import { patientService } from "../../services/patientService";
import { getApiError } from "../../services/api";

import type { Patient } from "../../types/patient";

export default function PatientsPage() {
  const navigate = useNavigate();

  const {
    patients,
    keyword,
    setKeyword,
    page,
    setPage,
    size,
    totalPages,
    totalElements,
    loading,
    error,
    refresh,
  } = usePatients();

  const [showForm, setShowForm] = useState(false);

  const [selectedPatient, setSelectedPatient] = useState<Patient>();

  const [patientToDelete, setPatientToDelete] = useState<Patient>();

  const [deletingId, setDeletingId] = useState<number | null>(null);

  function openCreateForm() {
    setSelectedPatient(undefined);
    setShowForm(true);
  }

  function openEditForm(patient: Patient) {
    setSelectedPatient(patient);
    setShowForm(true);
  }

  async function confirmDelete() {
    if (!patientToDelete || deletingId !== null) return;

    setDeletingId(patientToDelete.id);

    try {
      await patientService.remove(patientToDelete.id);

      toast.success("Đã ngừng sử dụng hồ sơ bệnh nhân");

      setPatientToDelete(undefined);

      refresh();
    } catch (error) {
      toast.error(getApiError(error));
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="mb-2 text-sm text-slate-400">
            Trang chủ / Bệnh nhân
          </div>

          <h1 className="text-2xl font-bold text-slate-900">
            Quản lý bệnh nhân
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Quản lý thông tin và hồ sơ bệnh nhân tại phòng khám
          </p>
        </div>

        <button
          onClick={openCreateForm}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          <Plus size={20} />
          Thêm bệnh nhân
        </button>
      </div>

      {/* Statistics */}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-blue-50 p-4 text-blue-600">
              <Users size={28} />
            </div>

            <div>
              <p className="text-sm text-slate-500">Số hồ sơ phù hợp</p>

              <h2 className="mt-1 text-3xl font-bold text-slate-900">
                {loading || error ? "—" : totalElements}
              </h2>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-emerald-50 p-4 text-emerald-600">
              <RefreshCw size={28} />
            </div>

            <div>
              <p className="text-sm text-slate-500">Trạng thái dữ liệu</p>

              <h2 className="mt-1 text-lg font-semibold text-slate-800">
                {loading
                  ? "Đang đồng bộ..."
                  : error
                    ? "Mất kết nối"
                    : "Đã đồng bộ"}
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Patient List */}

      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 p-5">
          <div>
            <h2 className="font-semibold text-slate-900">
              Danh sách bệnh nhân
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Thông tin hồ sơ đang hoạt động
            </p>
          </div>

          <div className="flex w-full items-center gap-3 md:w-auto">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-3.5 text-slate-400"
              />

              <input
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="Tìm tên, mã BN, SĐT..."
                className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-10 text-sm outline-none focus:border-blue-500 md:w-80"
              />

              {keyword && (
                <button
                  aria-label="Xóa từ khóa tìm kiếm"
                  onClick={() => setKeyword("")}
                  className="absolute right-3 top-3.5 text-slate-400"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <button
              title="Tải lại dữ liệu"
              aria-label="Tải lại dữ liệu"
              disabled={loading}
              onClick={refresh}
              className="rounded-xl border border-slate-200 p-3 text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {error ? (
          <div className="flex flex-col items-center justify-center p-16 text-center">
            <AlertCircle size={40} className="text-red-500" />

            <h3 className="mt-4 font-semibold text-slate-800">
              Không thể tải dữ liệu
            </h3>

            <p className="mt-2 text-sm text-slate-500">{error}</p>

            <button
              onClick={refresh}
              className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm text-white"
            >
              Thử lại
            </button>
          </div>
        ) : (
          <>
            <PatientTable
              patients={patients}
              loading={loading}
              deletingId={deletingId}
              onView={(patient) => navigate(`/patients/${patient.id}`)}
              onEdit={openEditForm}
              onDelete={setPatientToDelete}
            />

            <PatientPagination
              page={page}
              size={size}
              totalPages={totalPages}
              totalElements={totalElements}
              loading={loading}
              onPageChange={setPage}
            />
          </>
        )}
      </div>

      {/* Add / Edit Modal */}

      {showForm && (
        <PatientForm
          patient={selectedPatient}
          onClose={() => setShowForm(false)}
          onSuccess={refresh}
        />
      )}

      {/* Delete Confirmation Modal */}

      {patientToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
          >
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">
              <Trash2 size={26} />
            </div>

            <h2 id="delete-title" className="text-xl font-bold text-slate-900">
              Ngừng sử dụng hồ sơ?
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Bạn có chắc chắn muốn ngừng sử dụng hồ sơ của{" "}
              <strong className="text-slate-800">
                {patientToDelete.fullName}
              </strong>
              ?
            </p>

            <p className="mt-3 rounded-xl bg-amber-50 p-3 text-sm text-amber-700">
              Dữ liệu bệnh nhân vẫn được lưu trong hệ thống, nhưng sẽ không xuất
              hiện trong danh sách hoạt động.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                disabled={deletingId !== null}
                onClick={() => setPatientToDelete(undefined)}
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm"
              >
                Hủy bỏ
              </button>

              <button
                disabled={deletingId !== null}
                onClick={confirmDelete}
                className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {deletingId !== null ? "Đang xử lý..." : "Xác nhận"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
