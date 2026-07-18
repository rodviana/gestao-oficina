import { createContext, useContext, useMemo, useState } from 'react';
import { isAdminRole } from '../constants/userRole';

const AuthContext = createContext(null);

const STORAGE_KEY = 'gestao-oficina-session';

function loadSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.token && parsed?.email) {
      return parsed;
    }
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
  return null;
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(loadSession);

  const value = useMemo(() => ({
    session,
    isAuthenticated: Boolean(session?.token),
    isAdmin: isAdminRole(session?.role),
    login(sessionData) {
      const next = {
        token: sessionData.token,
        name: sessionData.name,
        email: sessionData.email,
        role: sessionData.role,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setSession(next);
    },
    logout() {
      localStorage.removeItem(STORAGE_KEY);
      setSession(null);
    },
  }), [session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;

}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
