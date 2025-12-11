import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function ProtectedRoute({ children, requiresPartner = false }) {
  const { user } = useAuthStore();

  // Not logged in
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Logged in but requires partner role
  if (requiresPartner && user.userType !== 'employee') {
    return <Navigate to="/" replace />;
  }

  return children;
}
