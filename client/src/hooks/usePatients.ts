import { useEffect, useState } from "react";

import { patientService } from "../services/patientService";
import { getApiError } from "../services/api";

import type { Patient } from "../types/patient";

export function usePatients() {
  const [patients, setPatients] = useState<Patient[]>([]);

  const [keyword, setKeyword] = useState("");

  const [query, setQuery] = useState({
    keyword: "",
    page: 0,
  });

  const [size] = useState(10);

  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [refreshKey, setRefreshKey] = useState(0);

  // Debounce tìm kiếm
  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery((previous) => {
        const search = keyword.trim();

        if (previous.keyword === search) {
          return previous;
        }

        return {
          keyword: search,
          page: 0,
        };
      });
    }, 400);

    return () => clearTimeout(timer);
  }, [keyword]);

  // Gọi API
  useEffect(() => {
    const controller = new AbortController();

    async function fetchPatients() {
      setLoading(true);
      setError("");

      try {
        const result = await patientService.getAll(
          query.keyword,
          query.page,
          size,
          controller.signal,
        );

        if (controller.signal.aborted) return;

        if (query.page > 0 && query.page >= result.totalPages) {
          setQuery((previous) => ({
            ...previous,
            page: Math.max(0, result.totalPages - 1),
          }));

          return;
        }

        setPatients(result.content);
        setTotalPages(result.totalPages);
        setTotalElements(result.totalElements);
      } catch (error) {
        if (controller.signal.aborted) return;

        setError(getApiError(error));
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void fetchPatients();

    return () => controller.abort();
  }, [query, size, refreshKey]);

  function refresh() {
    setRefreshKey((previous) => previous + 1);
  }

  function setPage(page: number) {
    if (page < 0 || page >= totalPages) return;

    setQuery((previous) => ({
      ...previous,
      page,
    }));
  }

  return {
    patients,
    keyword,
    setKeyword,
    page: query.page,
    setPage,
    size,
    totalPages,
    totalElements,
    loading,
    error,
    refresh,
  };
}
