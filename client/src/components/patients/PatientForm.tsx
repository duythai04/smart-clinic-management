import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { X, Save, LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";

import { patientService } from "../../services/patientService";
import { getApiError } from "../../services/api";

import { bloodTypeLabels, type Patient } from "../../types/patient";

function getToday() {
  const date = new Date();

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

const patientSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập họ tên")
    .max(150, "Họ tên quá dài"),

  gender: z.enum(["MALE", "FEMALE", "OTHER"]),

  dateOfBirth: z
    .string()
    .min(1, "Vui lòng chọn ngày sinh")
    .refine((value) => value <= getToday(), "Ngày sinh không hợp lệ"),

  phone: z.string().regex(/^\+?[0-9]{9,15}$/, "Số điện thoại không hợp lệ"),

  email: z.union([
    z.string().email("Email không hợp lệ").max(150),
    z.literal(""),
  ]),

  identityNumber: z.string().max(30),

  address: z.string().max(500),

  bloodType: z.enum([
    "A_POSITIVE",
    "A_NEGATIVE",
    "B_POSITIVE",
    "B_NEGATIVE",
    "AB_POSITIVE",
    "AB_NEGATIVE",
    "O_POSITIVE",
    "O_NEGATIVE",
    "UNKNOWN",
  ]),

  allergies: z.string().max(5000),

  emergencyContactName: z.string().max(150),

  emergencyContactPhone: z
    .string()
    .regex(/^$|^\+?[0-9]{9,15}$/, "Số điện thoại liên hệ không hợp lệ"),
});

type FormData = z.infer<typeof patientSchema>;

interface PatientFormProps {
  patient?: Patient;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PatientForm({
  patient,
  onClose,
  onSuccess,
}: PatientFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(patientSchema),

    defaultValues: {
      fullName: patient?.fullName ?? "",
      gender: patient?.gender ?? "MALE",
      dateOfBirth: patient?.dateOfBirth ?? "",
      phone: patient?.phone ?? "",
      email: patient?.email ?? "",
      identityNumber: patient?.identityNumber ?? "",
      address: patient?.address ?? "",
      bloodType: patient?.bloodType ?? "UNKNOWN",
      allergies: patient?.allergies ?? "",
      emergencyContactName: patient?.emergencyContactName ?? "",
      emergencyContactPhone: patient?.emergencyContactPhone ?? "",
    },
  });

  async function onSubmit(data: FormData) {
    try {
      if (patient) {
        await patientService.update(patient.id, data);

        toast.success("Cập nhật bệnh nhân thành công");
      } else {
        await patientService.create(data);

        toast.success("Thêm bệnh nhân thành công");
      }

      onSuccess();
      onClose();
    } catch (error) {
      toast.error(getApiError(error));
    }
  }

  const inputClass =
    "w-full rounded-xl border border-slate-200 px-4 py-3 " +
    "text-sm outline-none transition focus:border-blue-500 " +
    "focus:ring-2 focus:ring-blue-100";

  const labelClass = "mb-2 block text-sm font-medium text-slate-700";

  const errorClass = "mt-1 text-xs text-red-500";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="patient-form-title"
        className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
      >
        {/* Header */}

        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white p-6">
          <div>
            <h2
              id="patient-form-title"
              className="text-xl font-bold text-slate-900"
            >
              {patient ? "Chỉnh sửa bệnh nhân" : "Thêm bệnh nhân mới"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Quản lý thông tin hồ sơ bệnh nhân
            </p>
          </div>

          <button
            type="button"
            aria-label="Đóng"
            disabled={isSubmitting}
            onClick={onClose}
            className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"
          >
            <X size={22} />
          </button>
        </div>

        {/* Form */}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 p-6">
          {/* Thông tin cá nhân */}

          <section>
            <h3 className="mb-5 font-semibold text-slate-900">
              01. Thông tin cá nhân
            </h3>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="fullName" className={labelClass}>
                  Họ và tên *
                </label>

                <input
                  id="fullName"
                  {...register("fullName")}
                  className={inputClass}
                  placeholder="Nhập họ và tên"
                />

                <p className={errorClass}>{errors.fullName?.message}</p>
              </div>

              <div>
                <label htmlFor="gender" className={labelClass}>
                  Giới tính *
                </label>

                <select
                  id="gender"
                  {...register("gender")}
                  className={inputClass}
                >
                  <option value="MALE">Nam</option>
                  <option value="FEMALE">Nữ</option>
                  <option value="OTHER">Khác</option>
                </select>
              </div>

              <div>
                <label htmlFor="dateOfBirth" className={labelClass}>
                  Ngày sinh *
                </label>

                <input
                  id="dateOfBirth"
                  type="date"
                  max={getToday()}
                  {...register("dateOfBirth")}
                  className={inputClass}
                />

                <p className={errorClass}>{errors.dateOfBirth?.message}</p>
              </div>

              <div>
                <label htmlFor="identityNumber" className={labelClass}>
                  Số CCCD
                </label>

                <input
                  id="identityNumber"
                  {...register("identityNumber")}
                  className={inputClass}
                  placeholder="Nhập số CCCD"
                />

                <p className={errorClass}>{errors.identityNumber?.message}</p>
              </div>
            </div>
          </section>

          {/* Thông tin liên hệ */}

          <section className="border-t border-slate-100 pt-6">
            <h3 className="mb-5 font-semibold text-slate-900">
              02. Thông tin liên hệ
            </h3>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="phone" className={labelClass}>
                  Số điện thoại *
                </label>

                <input
                  id="phone"
                  type="tel"
                  {...register("phone")}
                  className={inputClass}
                  placeholder="09xxxxxxxx"
                />

                <p className={errorClass}>{errors.phone?.message}</p>
              </div>

              <div>
                <label htmlFor="email" className={labelClass}>
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  {...register("email")}
                  className={inputClass}
                  placeholder="example@email.com"
                />

                <p className={errorClass}>{errors.email?.message}</p>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="address" className={labelClass}>
                  Địa chỉ
                </label>

                <input
                  id="address"
                  {...register("address")}
                  className={inputClass}
                  placeholder="Nhập địa chỉ"
                />

                <p className={errorClass}>{errors.address?.message}</p>
              </div>
            </div>
          </section>

          {/* Thông tin y tế */}

          <section className="border-t border-slate-100 pt-6">
            <h3 className="mb-5 font-semibold text-slate-900">
              03. Thông tin y tế cơ bản
            </h3>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="bloodType" className={labelClass}>
                  Nhóm máu
                </label>

                <select
                  id="bloodType"
                  {...register("bloodType")}
                  className={inputClass}
                >
                  {Object.entries(bloodTypeLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="allergies" className={labelClass}>
                  Tiền sử dị ứng
                </label>

                <textarea
                  id="allergies"
                  rows={3}
                  {...register("allergies")}
                  className={inputClass}
                  placeholder="Thông tin dị ứng đã ghi nhận..."
                />

                <p className={errorClass}>{errors.allergies?.message}</p>
              </div>
            </div>
          </section>

          {/* Liên hệ khẩn cấp */}

          <section className="border-t border-slate-100 pt-6">
            <h3 className="mb-5 font-semibold text-slate-900">
              04. Người liên hệ khẩn cấp
            </h3>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="emergencyContactName" className={labelClass}>
                  Họ và tên người liên hệ
                </label>

                <input
                  id="emergencyContactName"
                  {...register("emergencyContactName")}
                  className={inputClass}
                />

                <p className={errorClass}>
                  {errors.emergencyContactName?.message}
                </p>
              </div>

              <div>
                <label htmlFor="emergencyContactPhone" className={labelClass}>
                  Số điện thoại liên hệ
                </label>

                <input
                  id="emergencyContactPhone"
                  type="tel"
                  {...register("emergencyContactPhone")}
                  className={inputClass}
                />

                <p className={errorClass}>
                  {errors.emergencyContactPhone?.message}
                </p>
              </div>
            </div>
          </section>

          {/* Footer */}

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-6">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium hover:bg-slate-50"
            >
              Hủy bỏ
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? (
                <LoaderCircle size={18} className="animate-spin" />
              ) : (
                <Save size={18} />
              )}

              {isSubmitting ? "Đang lưu..." : "Lưu hồ sơ"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
