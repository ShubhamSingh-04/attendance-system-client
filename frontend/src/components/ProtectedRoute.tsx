import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export function ProtectedRoute({ roles, children }: { roles?: string[]; children: JSX.Element }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && (!user.role || !roles.includes(user.role))) return <Navigate to="/" replace />;
  return children;
}


