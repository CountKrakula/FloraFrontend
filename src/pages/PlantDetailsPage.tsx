import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { CareLogDto } from "@/types/careLog";
import { getCareLogs, createCareLog } from "@/service/careLogService";
import { CareLogCard } from "@/components/care/CareLogCard";
import type { Plant as PlantInfo } from "@/components/plants/PlantInfoDialog";
import { PlantInfoCard } from "@/components/plants/PlantInfoCard";
import { Droplet, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPlant, updatePlant, deletePlant } from "@/service/plantService";
import { HealthLogCard } from "@/components/plants/HealthLogCard";
import { CareTasksCard } from "@/components/care/CareTasksCard";
import { getCareTasks, completeCareTask } from "@/service/careTaskService";
import type { CareTaskDto } from "@/types/careTask";
import { parseUtcDate } from "@/lib/date";
import { SubmitImage } from "@/components/images/SubmitPlantImage";
import { ImageInfoCard } from "@/components/images/ImageInfoCard";
import { getImageUrl, getImages } from "@/hooks/useImage";
import type { ImageDTO } from "@/types/image";
import { wasDoneToday } from "@/lib/careTaskRules";

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
  const [images, setImages] = useState<ImageDTO[]>([]);
  const [selectedImageId, setSelectedImageId] = useState<number | null>(null);
  const [imagesError, setImagesError] = useState<string | null>(null);
  const [imagesLoading, setImagesLoading] = useState(true);

  const loadPlantImages = useCallback(() => {
    return getImages(plantId)
      .then((fetchedImages) => {
        setImages(fetchedImages);
        setSelectedImageId((currentImageId) =>
          fetchedImages.some((image) => image.imageId === currentImageId)
            ? currentImageId
            : fetchedImages[0]?.imageId ?? null
        );
        setImagesError(null);
      })
      .catch((imageLoadError: unknown) => {
        console.error("Error fetching plant images:", imageLoadError);
        setImagesError("Could not load plant images.");
      })
      .finally(() => setImagesLoading(false));
  }, [plantId]);

  useEffect(() => {
    void loadPlantImages();
  }, [loadPlantImages]);

  // Care tasks from the backend, shared by the watering section and the care schedule card
  const [careTasks, setCareTasks] = useState<CareTaskDto[]>([]);

  // Care logs from the backend, shared by "Mark as watered" and the care log card
  const [careLogs, setCareLogs] = useState<CareLogDto[]>([]);

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

  // Fetch the care logs from the backend when the page loads
  useEffect(() => {
    getCareLogs(plantId, 1, 50)
      .then((result) => setCareLogs(result.items))
      .catch(() => setError("Could not load care logs."));
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
    if (!wateringTask || wasDoneToday(wateringTask)) return;

    try {
      const updated = await completeCareTask(plantId, wateringTask.id);
      setCareTasks((prev) =>
        prev.map((task) => (task.id === updated.id ? updated : task))
      );
      setError(null);

      // Also save a "Watered" entry in the care log
      const log = await createCareLog(plantId, {
        date: new Date().toISOString(),
        notes: "Watered",
      });
      setCareLogs((prev) => [log, ...prev]);
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

  const selectedImage = images.find((image) => image.imageId === selectedImageId);

  return (
    <div className="flex items-center justify-center px-4 py-8 md:py-16">
      <div className="w-full max-w-sm md:max-w-md space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Plant images</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <img
              src={selectedImage ? getImageUrl(selectedImage.url) : DEFAULT_IMAGE}
              alt={info.name}
              className="h-44 w-full rounded-lg object-cover"
            />
            <ImageInfoCard
              images={images}
              selectedImageId={selectedImageId}
              onImageSelect={(image) => setSelectedImageId(image.imageId)}
            />
            <SubmitImage
              plant={{ PlantId: plantId, name: info.name }}
              images={images}
              selectedIndex={images.findIndex((image) => image.imageId === selectedImageId)}
              canCreate={!imagesLoading && !imagesError}
              onSaved={loadPlantImages}
            />
          </CardContent>
        </Card>
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

        {imagesError && (
          <p className="text-sm text-destructive" role="alert">
            {imagesError}
          </p>
        )}

        {/* Health log card */}
        <HealthLogCard plantId={plantId} />

        {/* Care schedule from the backend */}
        <CareTasksCard plantId={plantId} tasks={careTasks} onTasksChange={setCareTasks} />

        <Button size="sm" variant="outline" onClick={handleWatered} disabled={!wateringTask || wasDoneToday(wateringTask)}>
          <Droplet className="h-4 w-4" /> Mark as watered
        </Button>
        {!wateringTask && (
          <p className="text-xs text-muted-foreground">
            Add a Watering task in the care schedule to track watering.
          </p>
        )}

        {/* Care log card */}
        <CareLogCard plantId={plantId} logs={careLogs} onLogsChange={setCareLogs} />

        <Button variant="destructive" className="w-full gap-2" onClick={handleDelete}>
          <Trash2 className="h-4 w-4" />
          Delete plant
        </Button>
      </div>
    </div>
  );
};