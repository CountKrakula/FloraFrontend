import { createContext, useContext } from "react";

export type AuthContextValue = {
  isAuthenticated: boolean;
  isCheckingAuthentication: boolean;
  setAuthenticated: (isAuthenticated: boolean) => void;
};

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
