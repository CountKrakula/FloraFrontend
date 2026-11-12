import { useState } from "react";
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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CareLogDto } from "@/types/careLog";
import { createCareLog, deleteCareLog } from "@/service/careLogService";
import { parseUtcDate } from "@/lib/date";

type Props = {
  plantId: number;
  // The page owns the list, so "Mark as watered" can add logs to it too
  logs: CareLogDto[];
  onLogsChange: (logs: CareLogDto[]) => void;
};

// Today's date as "YYYY-MM-DD", which is the format a date input uses
const todayString = () => new Date().toLocaleDateString("sv-SE");

export const CareLogCard = ({ plantId, logs, onLogsChange }: Props) => {
  const [error, setError] = useState<string | null>(null);

  // The "Add log" dialog and the values typed in it
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(todayString());
  const [notes, setNotes] = useState("");

  // Newest first
  const sorted = [...logs].sort(
    (a, b) => parseUtcDate(b.date).getTime() - parseUtcDate(a.date).getTime()
  );

  function handleOpenChange(isOpen: boolean) {
    // Start from today and an empty note every time the dialog opens
    if (isOpen) {
      setDate(todayString());
      setNotes("");
    }
    setOpen(isOpen);
  }

  // Save a new log to the backend and show it in the list
  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    try {
      const created = await createCareLog(plantId, {
        date: new Date(date).toISOString(),
        notes: notes.trim() || undefined,
      });
      onLogsChange([created, ...logs]);
      setOpen(false);
      setError(null);
    } catch {
      setError("Could not save the care log.");
    }
  }

  // Delete a log and remove it from the list
  async function handleDelete(id: number) {
    try {
      await deleteCareLog(plantId, id);
      onLogsChange(logs.filter((log) => log.id !== id));
    } catch {
      setError("Could not delete the care log.");
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Care Log</CardTitle>
        <Button variant="outline" size="sm" onClick={() => handleOpenChange(true)}>
          Add log
        </Button>
      </CardHeader>

      <CardContent>
        {error && (
          <p className="mb-2 text-sm text-destructive" role="alert">
            {error}
          </p>
        )}

        {/* Empty state when there are no logs */}
        {sorted.length === 0 && (
          <p className="text-sm text-muted-foreground">No care events yet</p>
        )}

        {/* One row per log: date, notes and a delete button */}
        {sorted.map((log) => (
          <div key={log.id} className="flex items-center gap-4 border-t py-2 text-sm">
            <span className="text-muted-foreground">
              {parseUtcDate(log.date).toLocaleDateString()}
            </span>
            {/* Fall back to "No notes" if notes is null or empty */}
            <span className="ml-auto">{log.notes || "No notes"}</span>
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

      {/* Dialog for adding a log */}
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add care log</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="care-log-date">Date</Label>
              <Input
                id="care-log-date"
                type="date"
                required
                max={todayString()}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="care-log-notes">Notes (optional)</Label>
              <Input
                id="care-log-notes"
                placeholder="e.g. Fertilized"
                maxLength={500}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
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