import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { CARE_TASK_TYPES } from "@/types/careTask";
import type { CareTaskDto, CareTaskType } from "@/types/careTask";
import {
  getCareTasks,
  createCareTask,
  updateCareTask,
  deleteCareTask,
} from "@/service/careTaskService";

type Props = {
  plantId: number;
};

export const CareTasksCard = ({ plantId }: Props) => {
  // All care tasks for this plant
  const [tasks, setTasks] = useState<CareTaskDto[]>([]);
  const [error, setError] = useState<string | null>(null);

  // The dialog is used both for adding and editing.
  // "editing" is the task being edited, or null when adding a new one.
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CareTaskDto | null>(null);
  const [type, setType] = useState<CareTaskType>("Watering");
  const [intervalDays, setIntervalDays] = useState(7);

  // Fetch the care tasks from the backend when the card loads
  useEffect(() => {
    getCareTasks(plantId)
      .then(setTasks)
      .catch(() => setError("Could not load care tasks."));
  }, [plantId]);

  function openAdd() {
    setEditing(null);
    setType("Watering");
    setIntervalDays(7);
    setOpen(true);
  }

  function openEdit(task: CareTaskDto) {
    setEditing(task);
    setType(task.type);
    setIntervalDays(task.intervalDays);
    setOpen(true);
  }

  // Save a new task, or the changes to an existing one
  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    const input = { type, intervalDays };

    try {
      if (editing) {
        await updateCareTask(plantId, editing.id, input);
        // Fetch again, because the backend calculates a new "next due" date
        setTasks(await getCareTasks(plantId));
      } else {
        const created = await createCareTask(plantId, input);
        setTasks((prev) => [...prev, created]);
      }
      setOpen(false);
      setError(null);
    } catch {
      setError("Could not save the care task.");
    }
  }

  // Delete a task and remove it from the list
  async function handleDelete(id: number) {
    try {
      await deleteCareTask(plantId, id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch {
      setError("Could not delete the care task.");
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Care schedule</CardTitle>
        <Button variant="outline" size="sm" onClick={openAdd}>
          Add task
        </Button>
      </CardHeader>

      <CardContent>
        {error && (
          <p className="mb-2 text-sm text-destructive" role="alert">
            {error}
          </p>
        )}

        {/* Empty state when there are no tasks */}
        {tasks.length === 0 && !error && (
          <p className="text-sm text-muted-foreground">No care tasks yet</p>
        )}

        {/* One row per task: type, how often, next date, and edit/delete buttons */}
        {tasks.map((task) => (
          <div key={task.id} className="flex items-center gap-2 border-t py-2 text-sm">
            <div className="flex-1">
              <p className="font-medium">{task.type}</p>
              <p className="text-muted-foreground">
                Every {task.intervalDays} days · Next:{" "}
                {new Date(task.nextDueAt).toLocaleDateString()}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Edit task"
              onClick={() => openEdit(task)}
            >
              <Pencil />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Delete task"
              onClick={() => handleDelete(task.id)}
            >
              <Trash2 />
            </Button>
          </div>
        ))}
      </CardContent>

      {/* Dialog for adding or editing a task */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit care task" : "Add care task"}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="care-task-type">Type</Label>
              <select
                id="care-task-type"
                value={type}
                onChange={(e) => setType(e.target.value as CareTaskType)}
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
              >
                {CARE_TASK_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="care-task-interval">Every how many days?</Label>
              <Input
                id="care-task-interval"
                type="number"
                min={1}
                max={365}
                required
                value={intervalDays}
                onChange={(e) => setIntervalDays(Number(e.target.value))}
              />
            </div>

            <DialogFooter>
              <DialogClose render={<Button type="button" variant="outline" />}>
                Cancel
              </DialogClose>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};