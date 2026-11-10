import { getAllUserCareTasks } from "@/service/careTaskService";
import type { CareTaskDto } from "@/types/careTask";
import { useEffect, useState } from "react";

export const useUserCareTasks = (isAuthenticated: boolean) => {
  const [userCareTasks, setUserCareTasks] = useState<CareTaskDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }
    let active = true;
    getAllUserCareTasks()
      .then((response) => {
        if (active) {
          setUserCareTasks(response);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (active) {
          setError(err);
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [isAuthenticated]);

  return {
    userCareTasks: isAuthenticated ? userCareTasks : [],
    loading: isAuthenticated && loading,
    error: isAuthenticated ? error : null,
  };
};
