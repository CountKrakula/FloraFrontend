import type { CareTaskDto } from "@/types/careTask";
import { createContext } from "react";

type UserCareTasksContextType = {
  userCareTasks: CareTaskDto[];
  loading: boolean;
  error: Error | null;
};

export const UserCareTasksContext = createContext<
  UserCareTasksContextType | undefined
>(undefined);
