import { useEffect, useState } from "react";
import { checkAuthentication } from "@/service/AuthService";
import { AuthContext } from "./auth-context";

export const AuthProvider = ({ children }: React.PropsWithChildren) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuthentication, setIsCheckingAuthentication] = useState(true);

  useEffect(() => {
    let isCurrent = true;

    checkAuthentication()
      .then((authenticated) => {
        if (isCurrent) setIsAuthenticated(authenticated);
      })
      .finally(() => {
        if (isCurrent) setIsCheckingAuthentication(false);
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isCheckingAuthentication,
        setAuthenticated: setIsAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
