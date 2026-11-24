import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  UserRound,
  Pencil,
  Phone,
  Mail,
  MapPin,
  HeartPulse,
  ClipboardList,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";

import PatientForm from "../../components/patients/PatientForm";

import { patientService } from "../../services/patientService";
import { getApiError } from "../../services/api";

import {
  genderLabels,
  bloodTypeLabels,
  formatDate,
  type Patient,
} from "../../types/patient";

interface InfoFieldProps {
  label: string;
  value?: string | null;
}

function InfoField({ label, value }: InfoFieldProps) {
  return (
    <div>
      <p className="text-sm text-slate-400">{label}</p>

      <p className="mt-1.5 break-words text-sm font-medium text-slate-800">
        {value || "Chưa cập nhật"}
      </p>
    </div>
  );
}

export default function PatientDetailPage() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [patient, setPatient] = useState<Patient>();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchPatient() {
      const patientId = Number(id);

      setLoading(true);
      setError("");
      setPatient(undefined);

      if (!Number.isSafeInteger(patientId) || patientId <= 0) {
        setError("Mã hồ sơ không hợp lệ");
        setLoading(false);
        return;
      }

      try {
        const result = await patientService.getById(
          patientId,
          controller.signal,
        );

        if (!controller.signal.aborted) {
          setPatient(result);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setError(getApiError(error));
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void fetchPatient();

    return () => controller.abort();
  }, [id, refreshKey]);

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-3 p-20 text-slate-500">
        <LoaderCircle size={24} className="animate-spin text-blue-600" />
        Đang tải hồ sơ bệnh nhân...
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="flex flex-col items-center p-20 text-center">
        <AlertCircle size={40} className="text-red-500" />

        <p className="mt-4 text-slate-600">
          {error || "Không tìm thấy bệnh nhân"}
        </p>

        <button
          onClick={() => navigate("/patients")}
          className="mt-5 rounded-xl bg-blue-600 px-5 py-3 text-white"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Navigation */}

      <button
        onClick={() => navigate("/patients")}
        className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600"
      >
        <ArrowLeft size={18} />
        Quay lại danh sách bệnh nhân
      </button>

      {/* Profile Header */}

      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div className="flex items-center gap-5">
            <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <UserRound size={48} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {patient.fullName}
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                {patient.patientCode}
              </p>

              <span className="mt-3 inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                Hồ sơ đang hoạt động
              </span>
            </div>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Pencil size={18} />
            Chỉnh sửa hồ sơ
          </button>
        </div>

        <div className="mt-6 flex flex-wrap gap-6 border-t border-slate-100 pt-6 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <Phone size={17} className="text-blue-500" />

            {patient.phone}
          </div>

          <div className="flex items-center gap-2">
            <Mail size={17} className="text-blue-500" />

            {patient.email || "Chưa có email"}
          </div>

          <div className="flex items-center gap-2">
            <MapPin size={17} className="text-blue-500" />

            {patient.address || "Chưa có địa chỉ"}
          </div>
        </div>
      </div>

      {/* Profile Information */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="mb-6 flex items-center gap-2 font-semibold text-slate-900">
            <UserRound size={20} className="text-blue-600" />
            Thông tin cá nhân
          </h2>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <InfoField label="Họ và tên" value={patient.fullName} />

            <InfoField label="Mã bệnh nhân" value={patient.patientCode} />

            <InfoField label="Giới tính" value={genderLabels[patient.gender]} />

            <InfoField
              label="Ngày sinh"
              value={formatDate(patient.dateOfBirth)}
            />

            <InfoField label="Số CCCD" value={patient.identityNumber} />

            <InfoField
              label="Ngày tạo hồ sơ"
              value={formatDate(patient.createdAt.slice(0, 10))}
            />

            <InfoField label="Số điện thoại" value={patient.phone} />

            <InfoField label="Email" value={patient.email} />

            <div className="sm:col-span-2">
              <InfoField label="Địa chỉ" value={patient.address} />
            </div>
          </div>
        </section>

        {/* Medical Information */}

        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="mb-6 flex items-center gap-2 font-semibold text-slate-900">
              <HeartPulse size={20} className="text-red-500" />
              Thông tin y tế cơ bản
            </h2>

            <div className="space-y-5">
              <InfoField
                label="Nhóm máu"
                value={bloodTypeLabels[patient.bloodType ?? "UNKNOWN"]}
              />

              <div className="rounded-xl bg-amber-50 p-4">
                <p className="text-sm font-medium text-amber-800">
                  Tiền sử dị ứng
                </p>

                <p className="mt-2 whitespace-pre-wrap text-sm text-amber-700">
                  {patient.allergies || "Chưa có thông tin dị ứng"}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="mb-6 font-semibold text-slate-900">
              Người liên hệ khẩn cấp
            </h2>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <InfoField
                label="Họ và tên"
                value={patient.emergencyContactName}
              />

              <InfoField
                label="Số điện thoại"
                value={patient.emergencyContactPhone}
              />
            </div>
          </section>
        </div>
      </div>

      {/* Medical History */}

      <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h2 className="flex items-center gap-2 font-semibold text-slate-900">
          <ClipboardList size={20} className="text-blue-600" />
          Lịch sử khám bệnh
        </h2>

        <div className="py-12 text-center">
          <ClipboardList size={40} className="mx-auto mb-4 text-slate-300" />

          <p className="text-sm text-slate-500">
            Chức năng lịch sử khám bệnh sẽ được tích hợp trong module Medical
            Records.
          </p>
        </div>
      </section>

      {showForm && (
        <PatientForm
          patient={patient}
          onClose={() => setShowForm(false)}
          onSuccess={() => setRefreshKey((previous) => previous + 1)}
        />
      )}
    </div>
  );
}
