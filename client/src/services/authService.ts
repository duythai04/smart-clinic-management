import { api, authApi, refreshSession } from "./api";

import type { AuthResponse, AuthUser, LoginRequest } from "../types/auth";

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await authApi.post<AuthResponse>("/auth/login", data);

    return response.data;
  },

  async refresh(): Promise<AuthResponse> {
    return refreshSession();
  },

  async me(): Promise<AuthUser> {
    const response = await api.get<AuthUser>("/auth/me");

    return response.data;
  },

  async logout(): Promise<void> {
    await authApi.post("/auth/logout");
  },
};
