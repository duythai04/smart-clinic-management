import api from "./api";

import type {
  User,
  UserPage,
  UserSummary,
  UserQuery,
  RoleInfo,
  CreateUserRequest,
  UpdateUserRequest,
  UpdateUserStatusRequest,
  UpdateUserRolesRequest,
  ResetPasswordRequest,
} from "../types/user";

export const userService = {
  async getAll(query: UserQuery = {}, signal?: AbortSignal) {
    const response = await api.get<UserPage>("/users", {
      params: query,
      signal,
    });

    return response.data;
  },

  async getById(id: number, signal?: AbortSignal) {
    const response = await api.get<User>(`/users/${id}`, {
      signal,
    });

    return response.data;
  },

  async getSummary(signal?: AbortSignal) {
    const response = await api.get<UserSummary>("/users/summary", {
      signal,
    });

    return response.data;
  },

  async getRoles(signal?: AbortSignal) {
    const response = await api.get<RoleInfo[]>("/roles", {
      signal,
    });

    return response.data;
  },

  async create(data: CreateUserRequest) {
    const response = await api.post<User>("/users", data);

    return response.data;
  },

  async update(id: number, data: UpdateUserRequest) {
    const response = await api.put<User>(`/users/${id}`, data);

    return response.data;
  },

  async updateStatus(id: number, data: UpdateUserStatusRequest) {
    const response = await api.patch<User>(`/users/${id}/status`, data);

    return response.data;
  },

  async updateRoles(id: number, data: UpdateUserRolesRequest) {
    const response = await api.put<User>(`/users/${id}/roles`, data);

    return response.data;
  },

  async resetPassword(id: number, data: ResetPasswordRequest) {
    await api.post(`/users/${id}/reset-password`, data);
  },
};
