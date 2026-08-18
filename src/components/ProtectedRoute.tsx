import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function ProtectedRoute() {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 dark:bg-gray-900" />;
  }

  if (!user) {
    const callbackUrl = `${location.pathname}${location.search}`;
    return <Navigate to={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`} replace />;
  }

  return <Outlet />;
}
