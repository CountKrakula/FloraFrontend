import { useEffect, useState } from "react";
import {
  completeCareTask,
  createCareTask,
  deleteCareTask,
  getCareTasks,
  updateCareTask,
} from "@/service/careTaskService";
import type { CareTaskDto, CareTaskInput } from "@/types/careTask";

export const useCareTasks = (plantId: number) => {
  const [result, setResult] = useState<{
    plantId: number;
    tasks: CareTaskDto[];
    loading: boolean;
    error: Error | null;
  }>({ plantId, tasks: [], loading: true, error: null });
  const [refreshCount, setRefreshCount] = useState(0);

  function refresh() {
    setResult((previous) => ({
      plantId,
      tasks: previous.plantId === plantId ? previous.tasks : [],
      loading: true,
      error: null,
    }));
    setRefreshCount((previous) => previous + 1);
  }

  useEffect(() => {
    let active = true;

    async function fetchTasks() {
      if (!Number.isInteger(plantId) || plantId <= 0) {
        throw new Error("A valid plant ID is required.");
      }

      const tasks = await getCareTasks(plantId);
      if (!Array.isArray(tasks)) {
        throw new Error("The care task response must be a list.");
      }
      return tasks;
    }

    fetchTasks()
      .then((tasks) => {
        if (active) setResult({ plantId, tasks, loading: false, error: null });
      })
      .catch((error: unknown) => {
        if (active) {
          setResult((previous) => ({
            plantId,
            tasks: previous.plantId === plantId ? previous.tasks : [],
            loading: false,
            error: error instanceof Error ? error : new Error("Could not load care tasks."),
          }));
        }
      });

    return () => {
      active = false;
    };
  }, [plantId, refreshCount]);

  // Mutation failures are returned to the caller so forms can stay open.
  // Refetch after success to include dates calculated by the backend.
  async function createTask(input: CareTaskInput) {
    const created = await createCareTask(plantId, input);
    refresh();
    return created;
  }

  async function updateTask(id: number, input: CareTaskInput) {
    await updateCareTask(plantId, id, input);
    refresh();
  }

  async function deleteTask(id: number) {
    await deleteCareTask(plantId, id);
    refresh();
  }

  async function completeTask(id: number) {
    const completed = await completeCareTask(plantId, id);
    refresh();
    return completed;
  }

  return {
    tasks: result.plantId === plantId ? result.tasks : [],
    loading: result.plantId !== plantId || result.loading,
    error: result.plantId === plantId ? result.error : null,
    refresh,
    createTask,
    updateTask,
    deleteTask,
    completeTask,
  };
};
