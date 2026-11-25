import { createContext } from "react";

import type { AuthUser, LoginRequest, Role } from "../types/auth";

export interface AuthContextValue {
  user: AuthUser | null;

  loading: boolean;

  isAuthenticated: boolean;

  login: (data: LoginRequest) => Promise<void>;

  logout: () => Promise<void>;

  hasRole: (...roles: Role[]) => boolean;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);
