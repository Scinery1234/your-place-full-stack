import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('AuthContext - Demo Login', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should login as user and set auth state', () => {
    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.loginAsUser();
    });

    expect(result.current.user).toBeDefined();
    expect(result.current.user.role).toBe('user');
    expect(result.current.user.email).toBe('user@example.com');
    expect(localStorage.getItem('token')).toBe('demo-token-user');
  });

  it('should login as host and set auth state', () => {
    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.loginAsHost();
    });

    expect(result.current.user).toBeDefined();
    expect(result.current.user.role).toBe('host');
    expect(result.current.user.email).toBe('host@example.com');
    expect(localStorage.getItem('token')).toBe('demo-token-host');
  });

  it('should persist user on page refresh', () => {
    // Set up localStorage with demo user
    localStorage.setItem('token', 'demo-token-user');
    localStorage.setItem('user', JSON.stringify({ id: 'demo-user-1', email: 'user@example.com', role: 'user' }));

    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });

    // Wait for useEffect to run
    return new Promise((resolve) => {
      setTimeout(() => {
        expect(result.current.user).toBeDefined();
        expect(result.current.user.role).toBe('user');
        resolve();
      }, 100);
    });
  });

  it('should logout and clear auth state', () => {
    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.loginAsUser();
    });

    expect(result.current.user).toBeDefined();

    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
  });
});
