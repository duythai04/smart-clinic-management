import { useEffect, useState } from "react";

import { userService } from "../services/userService";
import { getApiError } from "../services/api";

import type { Role } from "../types/auth";

import type { UserPage, UserSummary, UserStatusFilter } from "../types/user";

const PAGE_SIZE = 10;

export function useUsers() {
  const [keyword, setKeyword] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [role, setRole] = useState<Role | "ALL">("ALL");
  const [status, setStatus] = useState<UserStatusFilter>("ALL");
  const [page, setPage] = useState(0);
  const [data, setData] = useState<UserPage | null>(null);
  const [summary, setSummary] = useState<UserSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearchKeyword(keyword.trim());
      setPage(0);
    }, 400);

    return () => window.clearTimeout(timer);
  }, [keyword]);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchUsers() {
      setLoading(true);
      setError(null);

      try {
        const result = await userService.getAll(
          {
            keyword: searchKeyword,
            role: role === "ALL" ? undefined : role,
            active: status === "ALL" ? undefined : status === "ACTIVE",
            page,
            size: PAGE_SIZE,
          },
          controller.signal,
        );

        if (controller.signal.aborted) return;

        if (page > 0 && page >= result.totalPages) {
          setPage(Math.max(0, result.totalPages - 1));
          return;
        }

        setData(result);
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

    void fetchUsers();

    return () => controller.abort();
  }, [searchKeyword, role, status, page, refreshKey]);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchSummary() {
      setSummaryLoading(true);
      setSummaryError(null);

      try {
        const result = await userService.getSummary(controller.signal);

        if (!controller.signal.aborted) {
          setSummary(result);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setSummaryError(getApiError(error));
        }
      } finally {
        if (!controller.signal.aborted) {
          setSummaryLoading(false);
        }
      }
    }

    void fetchSummary();

    return () => controller.abort();
  }, [refreshKey]);

  function changeRole(value: Role | "ALL") {
    setRole(value);
    setPage(0);
  }

  function changeStatus(value: UserStatusFilter) {
    setStatus(value);
    setPage(0);
  }

  function resetFilters() {
    setKeyword("");
    setSearchKeyword("");
    setRole("ALL");
    setStatus("ALL");
    setPage(0);
  }

  function refresh() {
    setRefreshKey((previous) => previous + 1);
  }

  return {
    users: data?.content ?? [],
    summary,
    keyword,
    setKeyword,
    role,
    setRole: changeRole,
    status,
    setStatus: changeStatus,
    page,
    setPage,
    size: PAGE_SIZE,
    totalPages: data?.totalPages ?? 0,
    totalElements: data?.totalElements ?? 0,
    loading,
    summaryLoading,
    error,
    summaryError,
    refresh,
    resetFilters,
  };
}
