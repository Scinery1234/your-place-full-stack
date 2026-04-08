import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function ProtectedRoute({ children, role }) {
  const { user } = useAuth();
  const location = useLocation();

  // Not logged in - redirect to login page
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Role required but user role does not match.
  // Special case: admins can access host-only areas.
  if (role) {
    const allowed = role === 'host' ? ['host', 'admin'] : [role];
    if (!allowed.includes(user.role)) {
      return <Navigate to="/" replace />;
    }
  }

  // Pass of all checks - render the children
  return children;
}
