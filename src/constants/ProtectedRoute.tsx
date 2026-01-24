import { Navigate, Outlet } from "react-router-dom";
import { isTokenExpired } from "@/utils/jwt";

interface ProtectedRouteProps {
  allowedRoles: string[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token || isTokenExpired(token)) {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    return <Navigate to="/signin" replace />;
  }

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
