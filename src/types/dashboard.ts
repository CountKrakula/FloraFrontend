import type { CareLogDto } from "./careLog";
import type { CareTaskDto } from "./careTask";

export type DashboardTask = CareTaskDto & { plantName: string };
export type DashboardCareLog = CareLogDto & { plantName: string };
export type DashboardPanel = "plants" | "tasks" | "logs" | null;
