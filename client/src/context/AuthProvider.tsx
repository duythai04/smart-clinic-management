import { useCallback, useEffect, useState } from "react";

import type { ReactNode } from "react";

import { AuthContext } from "./authContext";

import { authService } from "../services/authService";

import { clearSession, setAccessToken } from "../services/api";

import type { AuthUser, LoginRequest, Role } from "../types/auth";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const handleExpired = () => {
      if (active) {
        setUser(null);
      }
    };

    const handleRefreshed = (event: Event) => {
      const customEvent = event as CustomEvent<AuthUser>;

      if (active) {
        setUser(customEvent.detail);
      }
    };

    window.addEventListener("auth:expired", handleExpired);

    window.addEventListener("auth:refreshed", handleRefreshed);

    const initializeAuth = async () => {
      try {
        const response = await authService.refresh();

        if (active) {
          setUser(response.user);
        }
      } catch {
        if (active) {
          clearSession();
          setUser(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void initializeAuth();

    return () => {
      active = false;

      window.removeEventListener("auth:expired", handleExpired);

      window.removeEventListener("auth:refreshed", handleRefreshed);
    };
  }, []);

  const login = useCallback(async (data: LoginRequest) => {
    const response = await authService.login(data);

    clearSession();

    setAccessToken(response.accessToken);

    setUser(response.user);
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();

    clearSession();

    setUser(null);
  }, []);

  const hasRole = useCallback(
    (...roles: Role[]) => {
      if (!user) {
        return false;
      }

      return roles.some((role) => user.roles.includes(role));
    },
    [user],
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: user !== null,
        login,
        logout,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
