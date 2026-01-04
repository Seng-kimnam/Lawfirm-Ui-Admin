// ProtectedRoute.tsx
import { isTokenExpired } from "@/utils/jwt";
import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute() {
  const token = localStorage.getItem("token");
  // const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  if (!token || isTokenExpired(token)) {
    localStorage.removeItem("token");
    return <Navigate to="/signin" replace />;
  }
  return <Outlet />;
}

/*  
import { Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  exp: number;
  role?: string;
}

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (!token) return;

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const currentTime = Date.now() / 1000; // seconds

      if (decoded.exp < currentTime) {
        handleLogout();
      } else {
        // Auto logout exactly when token expires
        const timeout = (decoded.exp - currentTime) * 1000;

        const timer = setTimeout(() => {
          handleLogout();
        }, timeout);

        return () => clearTimeout(timer);
      }
    } catch (error) {
      handleLogout();
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/signin", { replace: true });
  };

  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role || "")) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}

*/
