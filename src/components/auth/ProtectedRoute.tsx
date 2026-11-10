import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/auth-context";

export const ProtectedRoute = () => {
  // Uses context so it doesn't keep re-checking whether the user is authenticated
  const { isAuthenticated, isCheckingAuthentication } = useAuth();

  if (isCheckingAuthentication) return <p className="p-8 text-center">Loading...</p>;
  // replace makes the Back button work properly
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <Outlet />;
};