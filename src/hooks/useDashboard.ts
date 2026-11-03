import { useEffect, useState } from "react";
import { getCareLogs } from "@/service/careLogService";
import { getCareTasks } from "@/service/careTaskService";
import { getPlants } from "@/service/plantService";
import type { DashboardCareLog, DashboardTask } from "@/types/dashboard";
import type { PlantDto } from "@/types/plant";

export const useDashboard = (isAuthenticated: boolean) => {
  const [plants, setPlants] = useState<PlantDto[]>([]);
  const [careTasks, setCareTasks] = useState<DashboardTask[]>([]);
  const [careLogs, setCareLogs] = useState<DashboardCareLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setPlants([]);
      setCareTasks([]);
      setCareLogs([]);
      return;
    }

    let isCurrent = true;

    const loadDashboard = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const plantResult = await getPlants();
        const userPlants = plantResult.items;
        const plantDetails = await Promise.all(
          userPlants.map(async (plant) => {
            const [plantTasks, plantCareLogs] = await Promise.all([
              getCareTasks(plant.id),
              getCareLogs(plant.id),
            ]);

            return {
              tasks: plantTasks.map((task) => ({
                ...task,
                plantName: plant.name,
              })),
              careLogs: plantCareLogs.items.map((careLog) => ({
                ...careLog,
                plantName: plant.name,
              })),
            };
          }),
        );

        if (isCurrent) {
          setPlants(userPlants);
          setCareTasks(plantDetails.flatMap((item) => item.tasks));
          setCareLogs(plantDetails.flatMap((item) => item.careLogs));
        }
      } catch {
        if (isCurrent) {
          setError(
            "We could not load your dashboard. Check that the backend and database are running, then try again.",
          );
        }
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    };

    void loadDashboard();

    return () => {
      isCurrent = false;
    };
  }, [isAuthenticated]);

  return { plants, careTasks, careLogs, isLoading, error };
};
