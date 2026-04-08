import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { login as apiLogin, register as apiRegister, getMe } from '@/api/auth';

const AuthContext = createContext();

const STORAGE_TOKEN_KEY = 'token';
const STORAGE_USER_KEY = 'user';

const DEMO_USERS = {
  user: {
    token: 'demo-token-user',
    user: { id: 'demo-user-1', email: 'user@example.com', fullName: 'Demo User', role: 'user' },
  },
  host: {
    token: 'demo-token-host',
    user: { id: 'demo-host-1', email: 'host@example.com', fullName: 'Demo Host', role: 'host' },
  },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Bootstraps auth state on refresh.
  useEffect(() => {
    const token = localStorage.getItem(STORAGE_TOKEN_KEY);
    const storedUser = localStorage.getItem(STORAGE_USER_KEY);

    // Demo mode: if we have a stored user, trust it (keeps the frontend usable without backend).
    if (token?.startsWith('demo-token') && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem(STORAGE_TOKEN_KEY);
        localStorage.removeItem(STORAGE_USER_KEY);
      } finally {
        setLoading(false);
      }
      return;
    }

    // Normal mode: if token exists, try to fetch /users/me from backend.
    if (token) {
      getMe()
        .then((me) => {
          // `apiClient` returns response.data, so `me` is the user object.
          setUser(me);
          localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(me));
        })
        .catch(() => {
          localStorage.removeItem(STORAGE_TOKEN_KEY);
          localStorage.removeItem(STORAGE_USER_KEY);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    const response = await apiLogin(credentials);
    // With the axios interceptor, response is already response.data.
    const { token, user: nextUser } = response;
    localStorage.setItem(STORAGE_TOKEN_KEY, token);
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
    return response;
  };

  const register = async (userData) => {
    const response = await apiRegister(userData);
    const { token, user: nextUser } = response;
    localStorage.setItem(STORAGE_TOKEN_KEY, token);
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
    return response;
  };

  // Demo helpers (used for showcasing + tests)
  const loginAsUser = () => {
    const { token, user: nextUser } = DEMO_USERS.user;
    localStorage.setItem(STORAGE_TOKEN_KEY, token);
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
  };

  const loginAsHost = () => {
    const { token, user: nextUser } = DEMO_USERS.host;
    localStorage.setItem(STORAGE_TOKEN_KEY, token);
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_TOKEN_KEY);
    localStorage.removeItem(STORAGE_USER_KEY);
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, login, register, logout, loading, loginAsUser, loginAsHost }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
