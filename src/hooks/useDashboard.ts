import { useEffect, useState } from "react";
import { getCareLogs } from "@/service/careLogService";
import { getPlants } from "@/service/plantService";
import type { DashboardCareLog } from "@/types/dashboard";
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
            const plantCareLogs = await getAllCareLogs(plant.id);

            return {
              careLogs: plantCareLogs.map((careLog) => ({
                ...careLog,
                plantName: plant.name,
              })),
            };
          }),
        );

        if (isCurrent) {
          setPlants(userPlants);
          setCareLogs(plantDetails.flatMap((item) => item.careLogs));
        }
      } catch {
        if (isCurrent) {
          setError(
            "We couldn’t load your dashboard right now. Please try again later.",
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

  const addPlant = (plant: PlantDto) => {
    setPlants((prev) => [plant, ...prev]);
  };
  const addCareLog = (log: DashboardCareLog) => {
    setCareLogs((prev) => [log, ...prev]);
  };
  return {
    plants,
    careLogs,
    isLoading,
    error,
    addPlant,
    addCareLog,
  };
};
