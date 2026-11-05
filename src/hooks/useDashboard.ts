import { useEffect, useState } from "react";
import { getCareLogs } from "@/service/careLogService";
import { getCareTasks } from "@/service/careTaskService";
import { getPlants } from "@/service/plantService";
import type { DashboardCareLog, DashboardTask } from "@/types/dashboard";
import type { PlantDto } from "@/types/plant";

const DASHBOARD_PAGE_SIZE = 50;

const getAllPlants = async () => {
  const firstPage = await getPlants(1, DASHBOARD_PAGE_SIZE);
  const remainingPages = await Promise.all(
    Array.from({ length: Math.max(firstPage.totalPages - 1, 0) }, (_, index) =>
      getPlants(index + 2, DASHBOARD_PAGE_SIZE),
    ),
  );

  return [firstPage, ...remainingPages].flatMap((page) => page.items);
};

const getAllCareLogs = async (plantId: number) => {
  const firstPage = await getCareLogs(plantId, 1, DASHBOARD_PAGE_SIZE);
  const remainingPages = await Promise.all(
    Array.from({ length: Math.max(firstPage.totalPages - 1, 0) }, (_, index) =>
      getCareLogs(plantId, index + 2, DASHBOARD_PAGE_SIZE),
    ),
  );

  return [firstPage, ...remainingPages].flatMap((page) => page.items);
};

export const useDashboard = () => {
  const [plants, setPlants] = useState<PlantDto[]>([]);
  const [careTasks, setCareTasks] = useState<DashboardTask[]>([]);
  const [careLogs, setCareLogs] = useState<DashboardCareLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCurrent = true;

    const loadDashboard = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const userPlants = await getAllPlants();
        const plantDetails = await Promise.all(
          userPlants.map(async (plant) => {
            const [plantTasks, plantCareLogs] = await Promise.all([
              getCareTasks(plant.id),
              getAllCareLogs(plant.id),
            ]);

            return {
              tasks: plantTasks.map((task) => ({
                ...task,
                plantName: plant.name,
              })),
              careLogs: plantCareLogs.map((careLog) => ({
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
  }, []);

  return { plants, careTasks, careLogs, isLoading, error };
};
