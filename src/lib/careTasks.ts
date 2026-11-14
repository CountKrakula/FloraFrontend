import type { CareTaskDto } from "@/types/careTask";
import { parseUtcDate } from "./date";

// Includes overdue tasks and tasks due any time today, using the user's local day.
export const needsCareTaskAttention = (
  task: Pick<CareTaskDto, "nextDueAt">,
  now: Date = new Date(),
): boolean => {
  const tomorrow = new Date(now);
  tomorrow.setHours(0, 0, 0, 0);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return parseUtcDate(task.nextDueAt).getTime() < tomorrow.getTime();
};

// Includes the next three local calendar days, excluding tasks needing attention today.
export const isCareTaskUpcoming = (
  task: Pick<CareTaskDto, "nextDueAt">,
  now: Date = new Date(),
): boolean => {
  const tomorrow = new Date(now);
  tomorrow.setHours(0, 0, 0, 0);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const afterUpcomingDays = new Date(tomorrow);
  afterUpcomingDays.setDate(afterUpcomingDays.getDate() + 3);

  const dueAt = parseUtcDate(task.nextDueAt).getTime();
  return dueAt >= tomorrow.getTime() && dueAt < afterUpcomingDays.getTime();
};
