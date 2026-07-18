import { createContext, useContext, useMemo, useState } from 'react';
import { getSessionCustomer, login as doLogin, logout as doLogout } from '../../data/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [customer, setCustomer] = useState(() => getSessionCustomer());

  const value = useMemo(
    () => ({
      customer,
      isAuthenticated: Boolean(customer),
      login(loginId, password) {
        const result = doLogin(loginId, password);
        if (result.ok) setCustomer(result.customer);
        return result;
      },
      logout() {
        doLogout();
        setCustomer(null);
      },
    }),
    [customer],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}
