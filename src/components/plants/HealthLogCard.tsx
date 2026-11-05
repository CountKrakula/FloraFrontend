import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { HEALTH_STATUSES } from "@/types/plantHealthLog";
import type { HealthStatus, PlantHealthLogDto } from "@/types/plantHealthLog";
import {
  getHealthLogs,
  createHealthLog,
  deleteHealthLog,
} from "@/service/plantHealthLogService";

type Props = {
  plantId: number;
};

export const HealthLogCard = ({ plantId }: Props) => {
  // All health logs for this plant, newest first (the backend sorts them)
  const [logs, setLogs] = useState<PlantHealthLogDto[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Is the "Add status" dialog open, and which status is selected in it
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<HealthStatus>("Healthy");

  // Fetch the logs from the backend when the card loads
  useEffect(() => {
    getHealthLogs(plantId)
      .then((result) => setLogs(result.items))
      .catch(() => setError("Could not load health logs."));
  }, [plantId]);

  const handleOpenChange = (isOpen: boolean) => {
    // Start from "Healthy" every time the dialog opens
    if (isOpen) setStatus("Healthy");
    setOpen(isOpen);
  };

  // Save a new status to the backend and show it first in the list
  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    try {
      const created = await createHealthLog({ plantId, status });
      setLogs((prev) => [created, ...prev]);
      setOpen(false);
      setError(null);
    } catch {
      setError("Could not save the health status.");
    }
  }

  // Delete a log and remove it from the list
  async function handleDelete(id: number) {
    try {
      await deleteHealthLog(id);
      setLogs((prev) => prev.filter((log) => log.id !== id));
    } catch {
      setError("Could not delete the log.");
    }
  }

  const latest = logs[0];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Health log</CardTitle>

        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger render={<Button variant="outline" size="sm" />}>
            Add status
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>How is your plant doing?</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="health-status">Status</Label>
                <select
                  id="health-status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as HealthStatus)}
                  className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
                >
                  {HEALTH_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
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
      </CardHeader>

      <CardContent>
        {error && (
          <p className="mb-2 text-sm text-destructive" role="alert">
            {error}
          </p>
        )}

        {/* Latest status */}
        {latest && (
          <p className="mb-3 text-sm">
            Current status: <span className="font-medium">{latest.status}</span>
          </p>
        )}

        {/* Empty state when there are no logs */}
        {logs.length === 0 && !error && (
          <p className="text-sm text-muted-foreground">No health status logged yet</p>
        )}

        {/* One row per log: date, status and a delete button */}
        {logs.map((log) => (
          <div
            key={log.id}
            className="flex items-center justify-between gap-4 border-t py-2 text-sm"
          >
            <span className="text-muted-foreground">
              {new Date(log.recordedAt).toLocaleDateString()}
            </span>
            <span className="ml-auto">{log.status}</span>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Delete log"
              onClick={() => handleDelete(log.id)}
            >
              <Trash2 />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
