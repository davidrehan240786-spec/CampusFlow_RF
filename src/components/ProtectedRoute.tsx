import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  allowedRoles?: ('student' | 'staff')[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, dbUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // Provide a neat full-screen loading state to avoid UI flicker
    return (
      <div className="min-h-screen bg-brand-bg-top flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If the route has specific role requirements
  if (allowedRoles && dbUser && !allowedRoles.includes(dbUser.role)) {
    // They are logged in but don't have the right role - redirect them to their home
    return <Navigate to={dbUser.role === 'staff' ? '/staff-dashboard' : '/dashboard'} replace />;
  }

  return <Outlet />;
}
