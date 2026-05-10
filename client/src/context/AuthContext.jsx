import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { api, getStoredToken, getStoredUser } from '../api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser());
  const [token, setToken] = useState(() => getStoredToken());

  const login = useCallback((payload) => {
    localStorage.setItem('traveloop_token', payload.token);
    localStorage.setItem('traveloop_user', JSON.stringify(payload.user));
    setToken(payload.token);
    setUser(payload.user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('traveloop_token');
    localStorage.removeItem('traveloop_user');
    setToken(null);
    setUser(null);
  }, []);

  const register = useCallback(async (body) => {
    const data = await api('/api/auth/register', { method: 'POST', body });
    login(data);
    return data;
  }, [login]);

  const loginRequest = useCallback(async (body) => {
    const data = await api('/api/auth/login', { method: 'POST', body });
    login(data);
    return data;
  }, [login]);

  const updateProfile = useCallback(async (body) => {
    const data = await api('/api/auth/me', { method: 'PATCH', body });
    setUser(data);
    localStorage.setItem('traveloop_user', JSON.stringify(data));
    return data;
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      login,
      logout,
      register,
      loginRequest,
      updateProfile,
    }),
    [user, token, login, logout, register, loginRequest, updateProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
