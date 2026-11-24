import { api } from "./api";

import type { Patient, PatientPage, PatientRequest } from "../types/patient";

export const patientService = {
  async getAll(
    keyword = "",
    page = 0,
    size = 10,
    signal?: AbortSignal,
  ): Promise<PatientPage> {
    const response = await api.get<PatientPage>("/patients", {
      params: {
        keyword,
        page,
        size,
      },
      signal,
    });

    return response.data;
  },

  async getById(id: number, signal?: AbortSignal): Promise<Patient> {
    const response = await api.get<Patient>(`/patients/${id}`, { signal });

    return response.data;
  },

  async create(data: PatientRequest): Promise<Patient> {
    const response = await api.post<Patient>("/patients", data);

    return response.data;
  },

  async update(id: number, data: PatientRequest): Promise<Patient> {
    const response = await api.put<Patient>(`/patients/${id}`, data);

    return response.data;
  },

  async remove(id: number): Promise<void> {
    await api.delete(`/patients/${id}`);
  },
};
