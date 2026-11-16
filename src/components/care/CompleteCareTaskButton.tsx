import { useState } from "react";
import { Droplet, Scissors, Shovel, Sprout } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { completeCareTask } from "@/service/careTaskService";
import { createCareLog } from "@/service/careLogService";
import { wasDoneToday } from "@/lib/careTaskRules";
import type { CareTaskDto, CareTaskType } from "@/types/careTask";
import type { CareLogDto } from "@/types/careLog";

// Button text, care log note and icon for each task type.
// Record<CareTaskType, ...> makes the build fail if a new type is added but not listed here.
const TASK_ACTIONS: Record<
  CareTaskType,
  { label: string; logNote: string; Icon: LucideIcon }
> = {
  Watering: { label: "Mark as watered", logNote: "Watered", Icon: Droplet },
  Fertilize: { label: "Mark as fertilized", logNote: "Fertilized", Icon: Sprout },
  Prune: { label: "Mark as pruned", logNote: "Pruned", Icon: Scissors },
  Repot: { label: "Mark as repotted", logNote: "Repotted", Icon: Shovel },
};

type Props = {
  task: CareTaskDto;
  // Called with the updated task (new "last done" and "next due" dates from the backend)
  onCompleted: (updated: CareTaskDto) => void;
  // Called with the care log entry that was saved for this completion
  onLogged?: (log: CareLogDto) => void;
  // Called with an error message, or null to clear an earlier one
  onError?: (message: string | null) => void;
  // Allows the button to be restyled if used elsewhere
  className?: string;
};

export const CompleteCareTaskButton = ({
  task,
  onCompleted,
  onLogged,
  onError,
  className,
}: Props) => {
  // True while the request is running, so a double click can't complete the task twice
  const [saving, setSaving] = useState(false);

  const { label, logNote, Icon } = TASK_ACTIONS[task.type];
  const doneToday = wasDoneToday(task);

  async function handleClick() {
    if (saving || doneToday) return;
    setSaving(true);

    try {
      // The backend sets "last done" to now and calculates the next due date
      const updated = await completeCareTask(task.plantId, task.id);
      onCompleted(updated);
      onError?.(null);

      // The log is saved separately: if it fails, the task is still completed,
      // so the user gets a message that says exactly that.
      try {
        const log = await createCareLog(task.plantId, {
          date: new Date().toISOString(),
          notes: logNote,
        });
        onLogged?.(log);
      } catch {
        onError?.("The task was completed, but the care log entry could not be saved.");
      }
    } catch {
      onError?.("Could not complete the care task. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Button
      size="sm"
      variant="outline"
      className={className}
      onClick={handleClick}
      disabled={saving || doneToday}
    >
      <Icon /> {label}
    </Button>
  );
};