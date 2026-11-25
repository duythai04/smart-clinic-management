import { useState } from "react";

import {
  Activity,
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  Eye,
  EyeOff,
  HeartPulse,
  LoaderCircle,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UsersRound,
  CircleAlert,
} from "lucide-react";

import "./LoginPage.css";
import { Navigate, useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";

import toast from "react-hot-toast";

import { useAuth } from "../../hooks/useAuth";

import { getApiError } from "../../services/api";

import heroImage from "../../assets/hero.png";

// ==========================================
// VALIDATION
// ==========================================

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập địa chỉ email")
    .email("Địa chỉ email không hợp lệ")
    .max(150),

  password: z
    .string()
    .min(1, "Vui lòng nhập mật khẩu")
    .max(72, "Mật khẩu quá dài"),
});

type LoginFormData = z.infer<typeof loginSchema>;

// ==========================================
// FEATURES
// ==========================================

const features = [
  {
    icon: UsersRound,
    title: "Quản lý bệnh nhân",
    description: "Hồ sơ tập trung",
  },
  {
    icon: CalendarCheck,
    title: "Lịch khám thông minh",
    description: "Tối ưu quy trình",
  },
  {
    icon: ShieldCheck,
    title: "Phân quyền truy cập",
    description: "Quản lý tài khoản",
  },
];

// ==========================================
// LOGIN PAGE
// ==========================================

export default function LoginPage() {
  const navigate = useNavigate();

  const { login, loading, isAuthenticated } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),

    defaultValues: {
      email: "",
      password: "",
    },
  });

  // ==========================================
  // LOGIN HANDLER
  // ==========================================

  const onSubmit = async (data: LoginFormData) => {
    setServerError("");

    try {
      await login(data);

      toast.success("Đăng nhập thành công");

      navigate("/dashboard", {
        replace: true,
      });
    } catch (error) {
      setServerError(getApiError(error));
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#f5f9f7]">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-600 shadow-xl shadow-emerald-600/20">
          <HeartPulse size={40} className="text-white" />
        </div>

        <h1 className="text-2xl font-bold text-slate-800">MediClinic</h1>

        <LoaderCircle className="mt-6 h-7 w-7 animate-spin text-emerald-600" />

        <p className="mt-4 text-sm text-slate-500">
          Đang xác thực phiên đăng nhập...
        </p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // ==========================================
  // MAIN INTERFACE
  // ==========================================

  return (
    <div className="min-h-screen bg-[#f3f7f5] p-0 lg:p-5">
      <div className="mx-auto grid min-h-screen max-w-[1800px] overflow-hidden bg-white lg:min-h-[calc(100dvh-40px)] lg:grid-cols-[1.05fr_1fr] lg:rounded-[32px] lg:shadow-xl lg:shadow-slate-200/60">
        {/* ==================================
            LEFT PANEL
        ================================== */}

        <section className="relative hidden min-h-full flex-col overflow-hidden bg-[#064e3b] p-10 text-white lg:flex xl:p-14">
          {/* BACKGROUND DECORATION */}

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#064e3b] via-[#08775d] to-[#10b981]" />

          <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full border border-white/10" />

          <div className="pointer-events-none absolute -right-24 -top-24 h-[400px] w-[400px] rounded-full border border-white/10" />

          <div className="pointer-events-none absolute -bottom-52 -left-40 h-[500px] w-[500px] rounded-full bg-emerald-300/10 blur-3xl" />

          {/* LOGO */}

          <div className="relative z-10 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/15 backdrop-blur-xl">
              <HeartPulse size={32} strokeWidth={2} />
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-tight">MediClinic</h1>

              <p className="mt-1 text-xs tracking-wide text-emerald-100/80">
                SMART HEALTHCARE MANAGEMENT
              </p>
            </div>
          </div>

          {/* HERO CONTENT */}

          <div className="relative z-10 mt-12 xl:mt-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-medium backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-emerald-300" />
              Nền tảng quản lý phòng khám 4.0
            </div>

            <h2 className="mt-6 text-4xl font-bold leading-[1.15] tracking-tight xl:text-5xl 2xl:text-6xl">
              Công nghệ thông minh.
              <br />
              <span className="text-emerald-200">Chăm sóc tận tâm.</span>
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-relaxed text-emerald-50/80 xl:text-base">
              Kết nối đội ngũ y tế, tối ưu quy trình vận hành và nâng cao trải
              nghiệm chăm sóc bệnh nhân trên một nền tảng thống nhất.
            </p>
          </div>

          {/* HERO IMAGE */}

          <div className="relative z-10 mx-auto my-8 flex w-full max-w-[650px] flex-1 items-center justify-center">
            <div className="relative w-full">
              <div className="overflow-hidden rounded-[28px] border border-white/20 bg-white/10 p-2 shadow-2xl shadow-black/10 backdrop-blur-lg">
                <img
                  src={heroImage}
                  alt="Không gian quản lý và chăm sóc sức khỏe MediClinic"
                  className="h-[260px] w-full rounded-[22px] object-cover xl:h-[310px] 2xl:h-[360px]"
                />
              </div>

              {/* FLOATING CARD TOP */}

              <div className="absolute -right-3 top-6 flex items-center gap-3 rounded-2xl border border-white/60 bg-white/95 p-3 text-slate-800 shadow-xl backdrop-blur-xl xl:-right-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                  <Activity size={23} />
                </div>

                <div>
                  <p className="text-[11px] text-slate-500">Nền tảng y tế</p>

                  <p className="mt-0.5 text-sm font-bold">Quản lý tập trung</p>
                </div>
              </div>

              {/* FLOATING CARD BOTTOM */}

              <div className="absolute -bottom-5 -left-3 flex items-center gap-3 rounded-2xl border border-white/60 bg-white/95 p-4 text-slate-800 shadow-xl backdrop-blur-xl xl:-left-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                  <ShieldCheck size={24} />
                </div>

                <div>
                  <p className="text-[11px] text-slate-500">
                    Xác thực người dùng
                  </p>

                  <p className="mt-0.5 text-sm font-bold">Kiểm soát truy cập</p>
                </div>

                <CheckCircle2 size={19} className="ml-2 text-emerald-500" />
              </div>
            </div>
          </div>

          {/* FEATURES */}

          <div className="relative z-10 mt-8 grid grid-cols-3 gap-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:bg-white/15"
                >
                  <Icon size={23} className="mb-3 text-emerald-200" />

                  <h3 className="text-xs font-semibold xl:text-sm">
                    {feature.title}
                  </h3>

                  <p className="mt-2 text-[11px] text-emerald-100/70">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* LEFT FOOTER */}

          <div className="relative z-10 mt-8 flex items-center justify-between border-t border-white/10 pt-5 text-xs text-emerald-100/70">
            <span>© {new Date().getFullYear()} MediClinic</span>

            <span>Healthcare Management System</span>
          </div>
        </section>

        {/* ==================================
            RIGHT PANEL
        ================================== */}

        <section className="relative flex min-h-screen flex-col bg-white px-6 py-8 sm:px-12 lg:min-h-full xl:px-20">
          {/* TOP HEADER */}

          <div className="flex items-center justify-between">
            {/* MOBILE LOGO */}

            <div className="flex items-center gap-3 lg:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-white">
                <HeartPulse size={26} />
              </div>

              <span className="text-xl font-bold text-emerald-800">
                MediClinic
              </span>
            </div>

            <div className="hidden lg:block" />

            <div className="flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-2">
              <ShieldCheck size={15} className="text-emerald-600" />

              <span className="text-xs font-medium text-emerald-700">
                Cổng thông tin nội bộ
              </span>
            </div>
          </div>

          {/* LOGIN CONTAINER */}

          <div className="flex flex-1 items-center justify-center py-12">
            <div className="login-slide-right w-full max-w-[440px]">
              {/* LOGIN ICON */}

              <div className="mb-7 flex h-[72px] w-[72px] items-center justify-center rounded-[24px] border border-emerald-100 bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-600 shadow-sm">
                <LockKeyhole size={32} strokeWidth={1.8} />
              </div>

              {/* TITLE */}

              <div className="mb-8">
                <p className="mb-3 text-xs font-bold tracking-[0.16em] text-emerald-600">
                  MEDICLINIC WORKSPACE
                </p>

                <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-[42px]">
                  Chào mừng trở lại!
                </h2>

                <p className="mt-3 text-sm leading-relaxed text-slate-500 sm:text-base">
                  Đăng nhập vào tài khoản của bạn để tiếp tục quản lý phòng
                  khám.
                </p>
              </div>

              {/* SERVER ERROR */}

              {serverError && (
                <div
                  role="alert"
                  className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                >
                  <CircleAlert size={20} className="mt-0.5 shrink-0" />

                  <span>{serverError}</span>
                </div>
              )}

              {/* LOGIN FORM */}

              <form
                noValidate
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* EMAIL */}

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2.5 block text-sm font-semibold text-slate-700"
                  >
                    Địa chỉ email
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <div className="group relative">
                    <Mail
                      size={20}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-emerald-600"
                    />

                    <input
                      id="email"
                      type="email"
                      autoComplete="username"
                      placeholder="Nhập địa chỉ email"
                      disabled={isSubmitting}
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={
                        errors.email ? "email-error" : undefined
                      }
                      {...register("email")}
                      className={`
                        h-[58px] w-full rounded-xl border
                        bg-slate-50/80 pl-12 pr-4
                        text-sm text-slate-800
                        outline-none transition-all duration-200
                        placeholder:text-slate-400
                        focus:bg-white focus:ring-4
                        disabled:opacity-60
                        ${
                          errors.email
                            ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                            : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-100"
                        }
                      `}
                    />
                  </div>

                  {errors.email && (
                    <p
                      id="email-error"
                      className="mt-2 flex items-center gap-1.5 text-xs text-red-500"
                    >
                      <CircleAlert size={14} />

                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* PASSWORD */}

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2.5 block text-sm font-semibold text-slate-700"
                  >
                    Mật khẩu
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <div className="group relative">
                    <LockKeyhole
                      size={20}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-emerald-600"
                    />

                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="Nhập mật khẩu của bạn"
                      disabled={isSubmitting}
                      aria-invalid={Boolean(errors.password)}
                      aria-describedby={
                        errors.password ? "password-error" : undefined
                      }
                      {...register("password")}
                      className={`
                        h-[58px] w-full rounded-xl border
                        bg-slate-50/80 pl-12 pr-14
                        text-sm text-slate-800
                        outline-none transition-all duration-200
                        placeholder:text-slate-400
                        focus:bg-white focus:ring-4
                        disabled:opacity-60
                        ${
                          errors.password
                            ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                            : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-100"
                        }
                      `}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((previous) => !previous)}
                      aria-label={
                        showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                      }
                      aria-pressed={showPassword}
                      className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-emerald-600"
                    >
                      {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                    </button>
                  </div>

                  {errors.password && (
                    <p
                      id="password-error"
                      className="mt-2 flex items-center gap-1.5 text-xs text-red-500"
                    >
                      <CircleAlert size={14} />

                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* LOGIN BUTTON */}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="
                    group relative flex h-[58px] w-full
                    items-center justify-center gap-3
                    overflow-hidden rounded-xl
                    bg-gradient-to-r from-emerald-600 to-emerald-500
                    font-semibold text-white
                    shadow-lg shadow-emerald-600/20
                    transition-all duration-300
                    hover:-translate-y-0.5
                    hover:from-emerald-700
                    hover:to-emerald-600
                    hover:shadow-xl
                    hover:shadow-emerald-600/25
                    active:translate-y-0
                    focus-visible:outline-2
                    focus-visible:outline-offset-4
                    focus-visible:outline-emerald-600
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                    disabled:hover:translate-y-0
                  "
                >
                  {isSubmitting ? (
                    <>
                      <LoaderCircle size={21} className="animate-spin" />
                      Đang đăng nhập...
                    </>
                  ) : (
                    <>
                      Đăng nhập hệ thống
                      <ArrowRight
                        size={20}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </>
                  )}
                </button>
              </form>

              {/* DIVIDER */}

              <div className="my-8 flex items-center gap-4">
                <div className="h-px flex-1 bg-slate-200" />

                <span className="text-xs font-medium text-slate-400">
                  Hỗ trợ truy cập
                </span>

                <div className="h-px flex-1 bg-slate-200" />
              </div>

              {/* SUPPORT CARD */}

              <div className="flex items-start gap-4 rounded-2xl border border-emerald-100 bg-[#f3faf7] p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                  <ShieldCheck size={22} />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-emerald-900">
                    Bạn cần hỗ trợ đăng nhập?
                  </h3>

                  <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                    Tài khoản được cấp bởi quản trị viên phòng khám. Vui lòng
                    liên hệ bộ phận quản trị nếu bạn quên mật khẩu hoặc không
                    thể truy cập hệ thống.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT FOOTER */}

          <footer className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 border-t border-slate-100 pt-6 text-xs text-slate-400">
            <span>© {new Date().getFullYear()} MediClinic</span>

            <span className="h-1 w-1 rounded-full bg-slate-300" />

            <span>Phiên bản 1.0.0</span>

            <span className="h-1 w-1 rounded-full bg-slate-300" />

            <span className="flex items-center gap-1.5">
              <LockKeyhole size={12} />
              Truy cập nội bộ
            </span>
          </footer>
        </section>
      </div>
    </div>
  );
}
