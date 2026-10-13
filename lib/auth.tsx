"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { api } from "./api";
import { clearSession, getStoredUser, getToken, isTokenExpired, saveSession, tokenExpiry } from "./session";
import type { Account } from "./types";

type AuthContextValue = {
  user: Account | null;
  /** false until localStorage has been read (avoids redirecting before we know if the user is logged in). */
  ready: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<Account>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Account | null>(null);
  const [ready, setReady] = useState(false);

  // Restore the session on first load (and drop it when the token is already expired).
  useEffect(() => {
    const token = getToken();
    const stored = getStoredUser();
    if (token && stored && !isTokenExpired(token)) {
      setUser(stored);
    } else {
      clearSession();
    }
    setReady(true);
  }, []);

  // Log the user out automatically when the token expires while the page is open.
  useEffect(() => {
    if (!user) return;
    const token = getToken();
    const exp = token ? tokenExpiry(token) : null;
    if (exp === null) return;
    const delay = Math.min(Math.max(exp - Date.now(), 0), 2_147_000_000);
    const timer = window.setTimeout(() => {
      clearSession();
      setUser(null);
      window.location.assign("/login?expired=1");
    }, delay);
    return () => window.clearTimeout(timer);
  }, [user]);

  const login = useCallback(async (email: string, password: string) => {
    const result = await api.auth.login({ email: email.trim(), password });
    saveSession(result.token, result.account);
    setUser(result.account);
    return result.account;
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
    window.location.assign("/"); // back to the home page
  }, []);

  const value = useMemo(
    () => ({ user, ready, isAdmin: user?.role === 1, login, logout }),
    [user, ready, login, logout],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
