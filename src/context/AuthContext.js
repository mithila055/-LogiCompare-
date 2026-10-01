import { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => { const session = JSON.parse(localStorage.getItem('logicompare-session') || 'null'); const profile = JSON.parse(localStorage.getItem('logicompare-user') || 'null'); if (!session || !profile || session.expiresAt <= Date.now() || session.userId !== profile.id) { localStorage.removeItem('logicompare-session'); localStorage.removeItem('logicompare-user'); return null; } return profile; });
  const login = (profile) => { const next = { id: profile.id || 'customer-1', name: profile.name || 'Rafi Ahmed', role: profile.role || 'customer' }; const session = { token: crypto.randomUUID(), userId: next.id, role: next.role, createdAt: Date.now(), expiresAt: Date.now() + 1000 * 60 * 60 * 8 }; localStorage.setItem('logicompare-user', JSON.stringify(next)); localStorage.setItem('logicompare-session', JSON.stringify(session)); setUser(next); return next; };
  const logout = () => { localStorage.removeItem('logicompare-user'); localStorage.removeItem('logicompare-session'); setUser(null); };
  const value = useMemo(() => ({ user, isAuthenticated: Boolean(user), login, logout }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() { return useContext(AuthContext); }
