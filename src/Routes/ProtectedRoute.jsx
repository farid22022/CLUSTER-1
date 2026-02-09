// src/Components/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider"; // ← assume you have an auth context

/**
 * ProtectedRoute - protects dashboard routes based on:
 * - authentication
 * - current role permissions (dynamic, from backend)
 * - optional required page name
 */
const ProtectedRoute = ({ requiredPage = null, requireAuth = true, children }) => {
  const { user, isAuthenticated, loading } = useAuth(); // ← use your real auth hook/context
  console.log("Protected check:", {
    loading,
    isAuthenticated,
    user: user ? {
      email: user.email,
      hasMembership: !!user.current_membership,
      roleName: user.current_membership?.role?.name,
      isPresident: user.current_membership?.role?.is_president
    } : null
  });
  // While auth is loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600"></div>
      </div>
    );
  }

  // Not logged in
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // No user object or no current membership → no access
  if (!user || !user.current_membership) {
    return <Navigate to="/" replace />;
  }

  const currentRole = user.current_membership.role;

  // If a specific page is required, check permission
  if (requiredPage) {
    const hasPermission = currentRole?.permissions?.some(
      (p) => p.name.toLowerCase() === requiredPage.toLowerCase()
    );

    if (!hasPermission) {
      console.warn(`Access denied: missing permission for "${requiredPage}"`);
      return <Navigate to="/dashboard" replace />;
    }
  }

  // All checks passed → render protected content
  return children ? children : <Outlet />;
};

export default ProtectedRoute;