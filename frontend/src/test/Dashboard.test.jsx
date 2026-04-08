import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard';
import { AuthProvider } from '@/contexts/AuthContext';

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

describe('Dashboard', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should render correctly for host user', async () => {
    localStorage.setItem('token', 'demo-token-host');
    localStorage.setItem(
      'user',
      JSON.stringify({
        id: 'demo-host-1',
        email: 'host@example.com',
        fullName: 'Demo Host',
        role: 'host',
      })
    );

    render(
      <MemoryRouter>
        <AuthProvider>
          <Dashboard />
        </AuthProvider>
      </MemoryRouter>
    );

    // Wait for AuthProvider to hydrate user from localStorage
    expect(await screen.findByText(/welcome back/i)).toBeInTheDocument();

    // Role badge
    expect(screen.getByText('Host')).toBeInTheDocument();

    // Assert the unique CTA button (avoids matching both heading + button)
    expect(screen.getByRole('button', { name: /go to host dashboard/i })).toBeInTheDocument();
  });

  it('should render correctly for regular user', async () => {
    localStorage.setItem('token', 'demo-token-user');
    localStorage.setItem(
      'user',
      JSON.stringify({
        id: 'demo-user-1',
        email: 'user@example.com',
        fullName: 'Demo User',
        role: 'user',
      })
    );

    render(
      <MemoryRouter>
        <AuthProvider>
          <Dashboard />
        </AuthProvider>
      </MemoryRouter>
    );

    expect(await screen.findByText(/welcome back/i)).toBeInTheDocument();
    expect(screen.getByText('User')).toBeInTheDocument();
    expect(screen.getByText(/become a host/i)).toBeInTheDocument();
  });
});