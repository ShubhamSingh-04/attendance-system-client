import { createContext, useContext, useEffect, useMemo, useState } from 'react';

type User = {
  token: string;
  role: 'Admin' | 'Teacher' | 'Student';
  [k: string]: any;
} | null;

type AuthCtx = {
  user: User;
  setUser: (u: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthCtx>({
  user: null,
  setUser: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User>(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role') as
      | 'Admin'
      | 'Teacher'
      | 'Student'
      | null;
    if (!token) return null;
    return { token, role: role || 'Admin' } as any;
  });

  const setUser = (u: User) => {
    setUserState(u);
    const token = u?.token || null;
    const role = u?.role || null;
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
    if (role) localStorage.setItem('role', role);
    else localStorage.removeItem('role');
    if (navigator.serviceWorker?.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'SET_AUTH_TOKEN',
        token,
      });
    }
  };

  const logout = () => setUser(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (navigator.serviceWorker?.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'SET_AUTH_TOKEN',
        token,
      });
    }
  }, []);

  const value = useMemo(() => ({ user, setUser, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
