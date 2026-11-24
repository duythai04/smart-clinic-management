import axios from "axios";

export const api = axios.create({
  baseURL: "/api/v1",
  timeout: 10000,

  headers: {
    "Content-Type": "application/json",
  },
});

export function getApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return "Không thể kết nối đến máy chủ";
    }

    return (
      error.response.data?.message ||
      `Yêu cầu thất bại (${error.response.status})`
    );
  }

  return "Đã xảy ra lỗi không xác định";
}
