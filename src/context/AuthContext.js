import { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('logicompare-user') || 'null'));
  const login = (profile) => { const next = { id: profile.id || 'customer-1', name: profile.name || 'Rafi Ahmed', role: profile.role || 'customer' }; localStorage.setItem('logicompare-user', JSON.stringify(next)); setUser(next); return next; };
  const logout = () => { localStorage.removeItem('logicompare-user'); setUser(null); };
  const value = useMemo(() => ({ user, isAuthenticated: Boolean(user), login, logout }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() { return useContext(AuthContext); }
