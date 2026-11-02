export type HealthStatus =
  | "Healthy"
  | "Sick"
  | "Yellow Leaves"
  | "Brown Leaves"
  | "Bugs";

// The same five values the backend accepts
export const HEALTH_STATUSES: HealthStatus[] = [
  "Healthy",
  "Sick",
  "Yellow Leaves",
  "Brown Leaves",
  "Bugs",
];

// Matches PlantHealthLogDto from the backend
export type PlantHealthLogDto = {
  id: number;
  status: HealthStatus;
  recordedAt: string;
  plantId: number;
};

// Matches CreatePlantHealthLogDto from the backend
export type CreatePlantHealthLogDto = {
  plantId: number;
  status: HealthStatus;
};