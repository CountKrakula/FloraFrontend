import { useAuth } from "@/context/auth-context";
import { UserCareTasksContext } from "@/context/userCareTasksContext";
import { useUserCareTasks } from "@/hooks/useUserCareTasks";

export const UserCareTasksProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { isAuthenticated } = useAuth();
  const { userCareTasks, loading, error } = useUserCareTasks(isAuthenticated);

  return (
    <UserCareTasksContext.Provider value={{ userCareTasks, loading, error }}>
      {children}
    </UserCareTasksContext.Provider>
  );
};
