import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from '@/components/common/ProtectedRoute';

// Keep auth state controllable per-test.
let currentUser = null;

vi.mock('@/contexts/AuthContext', () => {
  return {
    useAuth: () => ({
      user: currentUser,
      loading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    }),
  };
});

const TestComponent = () => <div>Protected Content</div>;

function renderProtected(initialEntries = ['/protected']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path="/login" element={<div>Login Page</div>} />
        <Route
          path="/protected"
          element={
            <ProtectedRoute>
              <TestComponent />
            </ProtectedRoute>
          }
        />
      </Routes>
    </MemoryRouter>
  );
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    currentUser = null;
  });

  it('redirects unauthenticated users to /login', () => {
    renderProtected();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('allows authenticated users to see protected content', () => {
    currentUser = { id: 'demo-user-1', email: 'user@example.com', role: 'user' };
    renderProtected();
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});
