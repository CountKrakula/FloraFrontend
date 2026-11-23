import { useState } from "react";
import { CalendarDays, Droplet, Scissors, Shovel, Sprout } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

// Today's date as "YYYY-MM-DD", which is the format a date input uses
const todayString = () => new Date().toLocaleDateString("sv-SE");

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

  // The "Another day?" popup and the date chosen in it
  const [otherDayOpen, setOtherDayOpen] = useState(false);
  const [otherDay, setOtherDay] = useState(todayString());

  const { label, logNote, Icon } = TASK_ACTIONS[task.type];
  const doneToday = wasDoneToday(task);

  // Completes the task today (no date) or on a chosen date
  async function complete(doneAt?: string) {
    if (saving) return;
    setSaving(true);

    try {
      // The backend sets "last done" to the date and calculates the next due date
      const updated = await completeCareTask(task.plantId, task.id, doneAt);
      onCompleted(updated);
      onError?.(null);

      // The log is saved separately: if it fails, the task is still completed,
      // so the user gets a message that says exactly that.
      try {
        const log = await createCareLog(task.plantId, {
          date: doneAt ?? new Date().toISOString(),
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

  // "Mark as ..." button: completes the task today
  function handleClick() {
    if (doneToday) return;
    void complete();
  }

  // "Another day?" popup: completes the task on the chosen date
  async function handleOtherDaySubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    await complete(new Date(otherDay).toISOString());
    setOtherDayOpen(false);
  }

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        className={className}
        onClick={handleClick}
        disabled={saving || doneToday}
      >
        <Icon /> {label}
      </Button>

      <Button
        size="icon-sm"
        variant="ghost"
        aria-label={`${label} another day`}
        title="Done another day?"
        onClick={() => {
          setOtherDay(todayString());
          setOtherDayOpen(true);
        }}
        disabled={saving}
      >
        <CalendarDays />
      </Button>

      {/* Popup for choosing the date the task was done */}
      <Dialog open={otherDayOpen} onOpenChange={setOtherDayOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>When was it done?</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleOtherDaySubmit} className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor={`done-date-${task.id}`}>Date</Label>
              <Input
                id={`done-date-${task.id}`}
                type="date"
                required
                max={todayString()}
                value={otherDay}
                onChange={(e) => setOtherDay(e.target.value)}
              />
            </div>
            <DialogFooter>
              <DialogClose render={<Button type="button" variant="outline" />}>
                Cancel
              </DialogClose>
              <Button type="submit" disabled={saving}>
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};