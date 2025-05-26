import React from "react";
import { Navigate } from "react-router-dom";

const isAuthenticated = () => {
  // Check for token existence and optionally expiry
  const token = localStorage.getItem("adminToken");
  // Optionally, decode and check expiry here
  return !!token;
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/admin-login" replace />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;
