export type CareTaskType = "Watering" | "Fertilize" | "Prune" | "Repot";

// The same four values the backend accepts
export const CARE_TASK_TYPES: CareTaskType[] = [
  "Watering",
  "Fertilize",
  "Prune",
  "Repot",
];

// Matches CareTaskDto from the backend
export type CareTaskDto = {
  id: number;
  type: CareTaskType;
  intervalDays: number;
  lastDoneAt?: string | null;
  nextDueAt: string;
  plantId: number;
};

// What the user fills in when creating or editing a care task
export type CareTaskInput = {
  type: CareTaskType;
  intervalDays: number;
};