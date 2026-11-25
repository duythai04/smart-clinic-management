import axios from "axios";

import type { AxiosError, InternalAxiosRequestConfig } from "axios";

import type { AuthResponse } from "../types/auth";

interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface ApiErrorResponse {
  message?: string;
  success?: boolean;
  errors?: Record<string, string>;
}

let accessToken: string | null = null;

let sessionVersion = 0;

let refreshPromise: Promise<AuthResponse> | null = null;

// ==============================
// TOKEN MANAGEMENT
// ==============================

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

export function clearSession() {
  sessionVersion++;
  accessToken = null;
  refreshPromise = null;
}

// ==============================
// AXIOS INSTANCES
// ==============================

export const authApi = axios.create({
  baseURL: "/api/v1",

  timeout: 10000,

  withCredentials: true,

  headers: {
    "Content-Type": "application/json",
  },
});

export const api = axios.create({
  baseURL: "/api/v1",

  timeout: 10000,

  withCredentials: true,

  headers: {
    "Content-Type": "application/json",
  },
});

// ==============================
// REFRESH TOKEN
// ==============================

export function refreshSession(): Promise<AuthResponse> {
  if (refreshPromise) {
    return refreshPromise;
  }

  const currentVersion = sessionVersion;

  const promise = authApi
    .post<AuthResponse>("/auth/refresh")

    .then((response) => {
      if (currentVersion !== sessionVersion) {
        throw new Error("Phiên đăng nhập đã thay đổi");
      }

      const data = response.data;

      setAccessToken(data.accessToken);

      window.dispatchEvent(
        new CustomEvent("auth:refreshed", {
          detail: data.user,
        }),
      );

      return data;
    })

    .finally(() => {
      if (refreshPromise === promise) {
        refreshPromise = null;
      }
    });

  refreshPromise = promise;

  return promise;
}

// ==============================
// REQUEST INTERCEPTOR
// ==============================

api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.set("Authorization", `Bearer ${accessToken}`);
    }

    return config;
  },

  (error) => Promise.reject(error),
);

// ==============================
// RESPONSE INTERCEPTOR
// ==============================

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as RetryConfig | undefined;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const currentVersion = sessionVersion;

      try {
        await refreshSession();

        if (currentVersion !== sessionVersion) {
          return Promise.reject(error);
        }

        return api(originalRequest);
      } catch (refreshError) {
        if (currentVersion === sessionVersion) {
          clearSession();

          window.dispatchEvent(new Event("auth:expired"));
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

// ==============================
// ERROR HANDLER
// ==============================

export function getApiError(error: unknown): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }

    if (!error.response) {
      return "Không thể kết nối đến máy chủ";
    }

    if (error.response.status === 403) {
      return "Bạn không có quyền thực hiện chức năng này";
    }
  }

  return "Đã xảy ra lỗi. Vui lòng thử lại.";
}

export default api;
