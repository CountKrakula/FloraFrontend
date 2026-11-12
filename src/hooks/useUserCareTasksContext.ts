import { UserCareTasksContext } from "@/context/userCareTasksContext";
import { useContext } from "react";

export const useUserCareTasksContext = () => {
  const context = useContext(UserCareTasksContext);

  if (context === undefined) {
    throw new Error(
      "useUserCareTasksContext must be used inside UserCareTasksProvider",
    );
  }

  return context;
};
