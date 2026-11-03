import { createContext, useContext, useEffect, useState } from "react";
import { checkAuthentication } from "@/service/AuthService";

type AuthContextValue = {
  isAuthenticated: boolean;
  isCheckingAuthentication: boolean;
  setAuthenticated: (isAuthenticated: boolean) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

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

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
