import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  UserRound,
  Mail,
  Phone,
  LockKeyhole,
  Eye,
  EyeOff,
  ShieldCheck,
  LoaderCircle,
  Save,
  UserPlus,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";

import Modal from "../common/Modal";
import { userService } from "../../services/userService";
import { getApiError } from "../../services/api";
import { roleLabels } from "../../types/auth";
import { roleOptions } from "../../types/user";

import type { User } from "../../types/user";

const userSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập họ và tên")
    .max(150, "Họ tên không được vượt quá 150 ký tự"),

  email: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập email")
    .email("Địa chỉ email không hợp lệ")
    .max(150, "Email không được vượt quá 150 ký tự"),

  phone: z
    .string()
    .trim()
    .refine(
      (value) => value === "" || /^\+?[0-9]{9,15}$/.test(value),
      "Số điện thoại không hợp lệ",
    ),

  password: z.string(),

  confirmPassword: z.string(),

  roles: z.array(
    z.enum([
      "ADMIN",
      "DOCTOR",
      "RECEPTIONIST",
      "PHARMACIST",
      "LAB_TECHNICIAN",
      "CASHIER",
    ]),
  ),
});

type FormValues = z.infer<typeof userSchema>;

interface Props {
  user?: User;
  onClose: () => void;
  onSuccess: () => void;
}

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

export default function UserForm({ user, onClose, onSuccess }: Props) {
  const isEditing = Boolean(user);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  const schema = userSchema.superRefine((data, context) => {
    if (isEditing) return;

    if (data.password.length < 12) {
      context.addIssue({
        code: "custom",
        path: ["password"],
        message: "Mật khẩu phải có ít nhất 12 ký tự",
      });
    }

    if (new TextEncoder().encode(data.password).length > 72) {
      context.addIssue({
        code: "custom",
        path: ["password"],
        message: "Mật khẩu không được vượt quá 72 byte",
      });
    }

    if (data.confirmPassword !== data.password) {
      context.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "Mật khẩu xác nhận không khớp",
      });
    }

    if (data.roles.length === 0) {
      context.addIssue({
        code: "custom",
        path: ["roles"],
        message: "Vui lòng chọn ít nhất một vai trò",
      });
    }
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: user?.fullName ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
      password: "",
      confirmPassword: "",
      roles: user?.roles ?? [],
    },
  });

  async function onSubmit(values: FormValues) {
    setServerError("");

    try {
      const data = {
        fullName: values.fullName.trim(),
        email: values.email.trim().toLowerCase(),
        phone: values.phone.trim(),
      };

      if (user) {
        await userService.update(user.id, data);
        toast.success("Cập nhật thông tin nhân viên thành công");
      } else {
        await userService.create({
          ...data,
          password: values.password,
          roles: values.roles,
        });

        toast.success("Thêm nhân viên thành công");
      }

      onSuccess();
    } catch (error) {
      setServerError(getApiError(error));
    }
  }

  return (
    <Modal
      title={isEditing ? "Chỉnh sửa nhân viên" : "Thêm nhân viên mới"}
      description={
        isEditing
          ? "Cập nhật thông tin cá nhân của nhân viên"
          : "Tạo tài khoản và cấp quyền truy cập hệ thống"
      }
      onClose={onClose}
      busy={isSubmitting}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <fieldset disabled={isSubmitting} className="space-y-6 p-6">
          {serverError && (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600"
            >
              <AlertCircle size={19} className="shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          <section>
            <div className="mb-4 flex items-center gap-2">
              <UserRound size={19} className="text-emerald-600" />
              <h3 className="font-semibold text-slate-800">
                Thông tin cá nhân
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="user-full-name"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Họ và tên <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <UserRound
                    size={18}
                    className="absolute left-3.5 top-3.5 text-slate-400"
                  />

                  <input
                    id="user-full-name"
                    {...register("fullName")}
                    placeholder="Nguyễn Văn A"
                    autoComplete="name"
                    className={inputClass}
                  />
                </div>

                {errors.fullName && (
                  <p className="mt-1.5 text-xs text-red-500">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="user-email"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Địa chỉ email <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-3.5 top-3.5 text-slate-400"
                    />

                    <input
                      id="user-email"
                      {...register("email")}
                      type="email"
                      autoComplete="off"
                      placeholder="nhanvien@example.com"
                      className={inputClass}
                    />
                  </div>

                  {errors.email && (
                    <p className="mt-1.5 text-xs text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="user-phone"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Số điện thoại
                  </label>

                  <div className="relative">
                    <Phone
                      size={18}
                      className="absolute left-3.5 top-3.5 text-slate-400"
                    />

                    <input
                      id="user-phone"
                      {...register("phone")}
                      type="tel"
                      placeholder="0912345678"
                      autoComplete="tel"
                      className={inputClass}
                    />
                  </div>

                  {errors.phone && (
                    <p className="mt-1.5 text-xs text-red-500">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>

          {!isEditing && (
            <>
              <section className="border-t border-slate-100 pt-5">
                <div className="mb-4 flex items-center gap-2">
                  <LockKeyhole size={19} className="text-emerald-600" />
                  <h3 className="font-semibold text-slate-800">
                    Thông tin đăng nhập
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="user-password"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      Mật khẩu <span className="text-red-500">*</span>
                    </label>

                    <div className="relative">
                      <LockKeyhole
                        size={18}
                        className="absolute left-3.5 top-3.5 text-slate-400"
                      />

                      <input
                        id="user-password"
                        {...register("password")}
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="Tối thiểu 12 ký tự"
                        className={`${inputClass} pr-11`}
                      />

                      <button
                        type="button"
                        aria-label={
                          showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                        }
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3.5 text-slate-400"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>

                    {errors.password && (
                      <p className="mt-1.5 text-xs text-red-500">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="user-confirm-password"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      Xác nhận mật khẩu <span className="text-red-500">*</span>
                    </label>

                    <div className="relative">
                      <LockKeyhole
                        size={18}
                        className="absolute left-3.5 top-3.5 text-slate-400"
                      />

                      <input
                        id="user-confirm-password"
                        {...register("confirmPassword")}
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="Nhập lại mật khẩu"
                        className={`${inputClass} pr-11`}
                      />

                      <button
                        type="button"
                        aria-label={
                          showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                        }
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-3.5 text-slate-400"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>

                    {errors.confirmPassword && (
                      <p className="mt-1.5 text-xs text-red-500">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>

                <p className="mt-3 text-xs leading-5 text-slate-400">
                  Mật khẩu phải có ít nhất 12 ký tự và không vượt quá 72 byte.
                </p>
              </section>

              <section className="border-t border-slate-100 pt-5">
                <div className="mb-4 flex items-center gap-2">
                  <ShieldCheck size={19} className="text-emerald-600" />

                  <h3 className="font-semibold text-slate-800">
                    Phân quyền tài khoản
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {roleOptions.map((role) => (
                    <label
                      key={role}
                      className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-3.5 transition hover:border-emerald-300 hover:bg-emerald-50/40 has-checked:border-emerald-500 has-checked:bg-emerald-50"
                    >
                      <input
                        type="checkbox"
                        value={role}
                        {...register("roles")}
                        className="h-4 w-4 accent-emerald-600"
                      />

                      <span className="text-sm font-medium text-slate-700">
                        {roleLabels[role]}
                      </span>
                    </label>
                  ))}
                </div>

                {errors.roles && (
                  <p className="mt-2 text-xs text-red-500">
                    {errors.roles.message}
                  </p>
                )}
              </section>

              <div className="flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                <ShieldCheck size={20} className="shrink-0 text-emerald-600" />

                <p className="text-xs leading-5 text-emerald-700">
                  Tài khoản mới sẽ được kích hoạt ngay sau khi tạo thành công.
                  Nhân viên có thể đăng nhập bằng email và mật khẩu được cấp.
                </p>
              </div>
            </>
          )}
        </fieldset>

        <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-4">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-50"
          >
            Hủy bỏ
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
          >
            {isSubmitting ? (
              <LoaderCircle size={18} className="animate-spin" />
            ) : isEditing ? (
              <Save size={18} />
            ) : (
              <UserPlus size={18} />
            )}

            {isSubmitting
              ? "Đang xử lý..."
              : isEditing
                ? "Lưu thay đổi"
                : "Tạo nhân viên"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
