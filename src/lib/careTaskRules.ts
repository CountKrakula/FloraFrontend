import { parseUtcDate } from "@/lib/date";
import type { CareTaskDto } from "@/types/careTask";

// True if the task was last done today (the user's local day).
// This one rule is used for every task type, and can be reused on the dashboard too.
export const wasDoneToday = (task: CareTaskDto) => {
    const now = new Date();

    if (!task.lastDoneAt) return false;

    const day = parseUtcDate(task.lastDoneAt);
    return day.toDateString() === now.toDateString();
};

