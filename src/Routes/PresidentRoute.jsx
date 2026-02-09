// src/Components/PresidentRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";

const PresidentRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();

  console.log("PresidentRoute check:", {
    loading,
    isAuthenticated,
    user: user ? {
      email: user.email,
      hasMembership: !!user.current_membership,
      roleName: user.current_membership?.role?.name,
      isPresident: user.current_membership?.role?.is_president
    } : null
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user?.current_membership?.role?.is_president) {
    console.warn("Access denied: not current president");
    Swal.fire({
      icon: "error",
      title: "Access Denied",
      text: "Only the current President can access this section.",
      timer: 3000,
    });
    return <Navigate to="/dashboard" replace />;
  }

  return children ? children : <Outlet />;
};

export default PresidentRoute;