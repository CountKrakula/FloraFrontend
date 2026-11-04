// PlantDetailsPage.tsx
import { CareInfoCard } from "@/components/care/CareInfoCard";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Care } from "@/components/care/CareInfoDialog";
import type { Log } from "@/components/care/CareLogCard";
import { CareLogCard } from "@/components/care/CareLogCard";
import type { Plant as PlantInfo } from "@/components/plants/PlantInfoDialog";
import { PlantInfoCard } from "@/components/plants/PlantInfoCard";
import { Droplet, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPlant, updatePlant, deletePlant } from "@/service/plantService";
import { HealthLogCard } from "@/components/plants/HealthLogCard";
import { CareTasksCard } from "@/components/care/CareTasksCard";
import { getCareTasks, completeCareTask } from "@/service/careTaskService";
import type { CareTaskDto } from "@/types/careTask";
import { parseUtcDate } from "@/lib/date";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=500&q=80";

export const PlantDetailsPage = () => {
  // The plant id from the URL (/plant-details/:id), it's a string so convert to a number
  const { id } = useParams();
  const plantId = Number(id);
  const navigate = useNavigate();

  // Plant information from the backend (null until it has loaded)
  const [info, setInfo] = useState<PlantInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Care tasks from the backend, shared by the watering section and the care schedule card
  const [careTasks, setCareTasks] = useState<CareTaskDto[]>([]);

  // The saved care values (mock until we decide what to do with this card)
  const [care, setCare] = useState<Care>({
    watering: "Every 7 days",
    sunlight: "Bright, indirect",
    soil: "Well-draining mix",
    fertilizing: "Monthly in summer",
    repotting: "Every 2 years",
    pruning: "Spring",
  });

  // Care log (mock until CareLog is connected)
  const [logs, setLogs] = useState<Log[]>([
    { id: 1, date: "2026-10-22", notes: "Watered", plantId },
    { id: 2, date: "2026-10-27", notes: "Fertilized", plantId },
  ]);

  // Fetch the plant from the backend when the page loads
  useEffect(() => {
    getPlant(plantId)
      .then((plant) =>
        setInfo({
          name: plant.name,
          location: plant.location,
          notes: plant.notes ?? "",
        })
      )
      .catch(() => setError("Plant not found"))
      .finally(() => setLoading(false));
  }, [plantId]);

  // Fetch the care tasks from the backend when the page loads
  useEffect(() => {
    getCareTasks(plantId)
      .then(setCareTasks)
      .catch(() => setError("Could not load care tasks."));
  }, [plantId]);

  // Save changes from the edit dialog to the backend
  async function handleSaveInfo(updated: PlantInfo) {
    try {
      await updatePlant(plantId, {
        name: updated.name,
        location: updated.location,
        notes: updated.notes || undefined,
      });
      setInfo(updated);
      setError(null);
    } catch {
      setError("Could not save changes. Please try again.");
    }
  }

  // Delete the plant after asking the user to confirm
  async function handleDelete() {
    if (!window.confirm("Are you sure you want to delete this plant?")) return;

    try {
      await deletePlant(plantId);
      navigate("/my-plants");
    } catch {
      setError("Could not delete the plant. Please try again.");
    }
  }

  // The plant's watering task (if the user has added one in the care schedule)
  const wateringTask = careTasks.find((task) => task.type === "Watering");

  // Runs when "Mark as watered" is clicked: tells the backend the watering task is done.
  // The backend sets "last done" to now and calculates the next watering date.
  async function handleWatered() {
    if (!wateringTask) return;

    try {
      const updated = await completeCareTask(plantId, wateringTask.id);
      setCareTasks((prev) =>
        prev.map((task) => (task.id === updated.id ? updated : task))
      );
      setError(null);

      // Also add a "Watered" row to the care log (mock until CareLog is connected)
      const todaysDate = new Date().toISOString().slice(0, 10);
      setLogs([...logs, { id: logs.length + 1, date: todaysDate, notes: "Watered", plantId }]);
    } catch {
      setError("Could not mark the plant as watered. Please try again.");
    }
  }

  // Status label based on the watering task's dates from the backend
  const lastWatered = wateringTask?.lastDoneAt ? parseUtcDate(wateringTask.lastDoneAt) : null;
  const nextWatering = wateringTask ? parseUtcDate(wateringTask.nextDueAt) : null;
  const now = new Date();

  let status = "No watering schedule";
  let badgeClass = "ml-auto rounded-md bg-muted px-3 py-1 text-xs text-muted-foreground";
  if (lastWatered && lastWatered.toDateString() === now.toDateString()) {
    status = "Watered today";
    badgeClass = "ml-auto rounded-md bg-green-100 px-3 py-1 text-xs text-green-800";
  } else if (nextWatering && nextWatering <= now) {
    status = "Needs water";
    badgeClass = "ml-auto rounded-md bg-amber-100 px-3 py-1 text-xs text-amber-800";
  } else if (nextWatering) {
    status = `Next: ${nextWatering.toLocaleDateString()}`;
    badgeClass = "ml-auto rounded-md bg-secondary px-3 py-1 text-xs text-secondary-foreground";
  }

  if (loading) return <p className="p-8 text-center">Loading...</p>;

  // No plant with that id (or it belongs to someone else)
  if (!info) return <p className="p-8 text-center">{error ?? "Plant not found"}</p>;

  return (
    <div className="flex items-center justify-center px-4 py-8 md:py-16">
      <div className="w-full max-w-sm md:max-w-md space-y-4">
        <img
          src={DEFAULT_IMAGE}
          alt={info.name}
          className="h-44 w-full rounded-lg object-cover"
        />
        <div>
          <h1 className="text-xl font-medium">{info.name}</h1>
          <p className="text-sm text-muted-foreground">
            {info.location}
            {info.notes && ` · ${info.notes}`}
          </p>
        </div>

        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}

        <div className="flex items-center gap-2 text-sm">
          <Droplet className="h-4 w-4" />
          <span>
            Last watered: {lastWatered ? lastWatered.toLocaleDateString() : "Never"}
          </span>
          <span className={badgeClass}>{status}</span>
        </div>

        <PlantInfoCard plant={info} onSave={handleSaveInfo} />

        {/* Health log card */}
        <HealthLogCard plantId={plantId} />

        {/* Care information card */}
        <CareInfoCard care={care} onSave={setCare} />

        {/* Care schedule from the backend */}
        <CareTasksCard plantId={plantId} tasks={careTasks} onTasksChange={setCareTasks} />

        <Button size="sm" variant="outline" onClick={handleWatered} disabled={!wateringTask}>
          <Droplet className="h-4 w-4" /> Mark as watered
        </Button>
        {!wateringTask && (
          <p className="text-xs text-muted-foreground">
            Add a Watering task in the care schedule to track watering.
          </p>
        )}

        {/* Care log card */}
        <CareLogCard logs={logs} />

        <Button variant="destructive" className="w-full gap-2" onClick={handleDelete}>
          <Trash2 className="h-4 w-4" />
          Delete plant
        </Button>
      </div>
    </div>
  );
};