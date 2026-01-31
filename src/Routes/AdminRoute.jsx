// src/Components/AdminRoute.jsx

import { Navigate, Outlet } from "react-router-dom";

// Example: fetch user info from context or localStorage
const getCurrentUser = () => {
  // Replace this with your actual user retrieval logic
  // For example: JSON.parse(localStorage.getItem('user'))
  return {
    role: "ADMIN" , // or 'SUPER_ADMIN', 'USER', etc.
    allowedPages: [ "/dashboard",
      "/dashboard/projects",
      "/dashboard/events",
      "/dashboard/emails"],
  };
};

const AdminRoute = ({ allowedRoles = [], allowedPages = [], children }) => {
  const user = getCurrentUser();

  // Check if user exists and has allowed role
  const roleAllowed = allowedRoles.includes(user.role);
  // Check if user has permission for the page
  const pageAllowed = allowedPages.some((page) =>
    user.allowedPages.includes(page)
  );

  console.log(user,roleAllowed,pageAllowed)

  if (!user || !roleAllowed || !pageAllowed) {
    // Redirect to home or login if not authorized
    return <Navigate to="/" replace />;
  }

  // Render children if passed, otherwise render nested routes (Outlet)
  return children ? children : <Outlet />;
};

export default AdminRoute;
