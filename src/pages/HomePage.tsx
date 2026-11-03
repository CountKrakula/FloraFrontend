import { AuthenticatedDashboard } from "@/components/home/AuthenticatedDashboard";
import { VisitorHome } from "@/components/home/VisitorHome";
import { useAuth } from "@/context/AuthContext";

export const HomePage = () => {
  const { isAuthenticated, isCheckingAuthentication } = useAuth();

  if (isCheckingAuthentication) {
    return <p className="p-8 text-center">Checking login...</p>;
  }

  return isAuthenticated ? <AuthenticatedDashboard /> : <VisitorHome />;
};
