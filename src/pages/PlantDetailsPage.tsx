import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { CareLogDto } from "@/types/careLog";
import { getCareLogs } from "@/service/careLogService";
import { CareLogCard } from "@/components/care/CareLogCard";
import type { Plant as PlantInfo } from "@/components/plants/PlantInfoDialog";
import { PlantInfoCard } from "@/components/plants/PlantInfoCard";
import { Droplet, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPlant, updatePlant, deletePlant } from "@/service/plantService";
import { HealthLogCard } from "@/components/plants/HealthLogCard";
import { CareTasksCard } from "@/components/care/CareTasksCard";
import { parseUtcDate } from "@/lib/date";
import { SubmitImage } from "@/components/images/SubmitPlantImage";
import { ImageInfoCard } from "@/components/images/ImageInfoCard";
import { getImageUrl, getImages } from "@/hooks/useImage";
import type { ImageDTO } from "@/types/image";
import { useUserCareTasksContext } from "@/hooks/useUserCareTasksContext";
import { PlantImagePlaceholder } from "@/components/plants/PlantImagePlaceholder";

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

  const {
    userCareTasks,
    updateTaskInState,
    replacePlantTasks,
    loading: userCareTasksLoading,
  } = useUserCareTasksContext();
  const careTasks = userCareTasks.filter((task) => task.plantId === plantId);
  const loadPlantImages = useCallback(() => {
    return getImages(plantId)
      .then((fetchedImages) => {
        setImages(fetchedImages);
        setSelectedImageId((currentImageId) =>
          fetchedImages.some((image) => image.imageId === currentImageId)
            ? currentImageId
            : (fetchedImages[0]?.imageId ?? null),
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

  // Care logs from the backend, shared by the care tasks card and the care log card
  const [careLogs, setCareLogs] = useState<CareLogDto[]>([]);

  // Fetch the plant from the backend when the page loads
  useEffect(() => {
    getPlant(plantId)
      .then((plant) =>
        setInfo({
          name: plant.name,
          location: plant.location,
          notes: plant.notes ?? "",
        }),
      )
      .catch(() => setError("Plant not found"))
      .finally(() => setLoading(false));
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

  // Show the new care log entry at the top of the care log
  function handleLogged(log: CareLogDto) {
    setCareLogs((prev) => [log, ...prev]);
  }

  // Status label based on the watering task's dates from the backend
  const lastWatered = wateringTask?.lastDoneAt
    ? parseUtcDate(wateringTask.lastDoneAt)
    : null;
  const nextWatering = wateringTask
    ? parseUtcDate(wateringTask.nextDueAt)
    : null;
  const now = new Date();

  let status = "No watering schedule";
  let badgeClass =
    "ml-auto rounded-md bg-muted px-3 py-1 text-xs text-muted-foreground";
  if (lastWatered && lastWatered.toDateString() === now.toDateString()) {
    status = "Watered today";
    badgeClass =
      "ml-auto rounded-md bg-green-100 px-3 py-1 text-xs text-green-800";
  } else if (nextWatering && nextWatering <= now) {
    status = "Needs water";
    badgeClass =
      "ml-auto rounded-md bg-amber-100 px-3 py-1 text-xs text-amber-800";
  } else if (nextWatering) {
    status = `Next: ${nextWatering.toLocaleDateString()}`;
    badgeClass =
      "ml-auto rounded-md bg-secondary px-3 py-1 text-xs text-secondary-foreground";
  }

  if (loading) return <p className="p-8 text-center">Loading...</p>;

  // No plant with that id (or it belongs to someone else)
  if (!info)
    return <p className="p-8 text-center">{error ?? "Plant not found"}</p>;

  const selectedImage = images.find(
    (image) => image.imageId === selectedImageId,
  );

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 md:py-12">
      {/* Name and location at the top, full width */}
      <div className="mb-6">
        <h1 className="text-2xl font-medium md:text-3xl">{info.name}</h1>
        <p className="text-sm text-muted-foreground">
          {info.location}
          {info.notes && ` · ${info.notes}`}
        </p>
      </div>

      {error && (
        <p className="mb-4 text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      {/* One column on mobile, two columns on desktop */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left column: images, watering status and plant information */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Plant images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               {selectedImage ? (
                <img
                  src={getImageUrl(selectedImage.url)}
                  alt={info.name}
                  className="h-44 w-full rounded-lg object-cover md:h-72"
                />
              ) : (
                <PlantImagePlaceholder className="h-44 w-full rounded-lg md:h-72" />
              )}
              <ImageInfoCard
                images={images}
                selectedImageId={selectedImageId}
                onImageSelect={(image) => setSelectedImageId(image.imageId)}
              />
              <SubmitImage
                plant={{ PlantId: plantId, name: info.name }}
                images={images}
                selectedIndex={images.findIndex(
                  (image) => image.imageId === selectedImageId,
                )}
                canCreate={!imagesLoading && !imagesError}
                onSaved={loadPlantImages}
              />
            </CardContent>
          </Card>

          {imagesError && (
            <p className="text-sm text-destructive" role="alert">
              {imagesError}
            </p>
          )}

          {/* Watering status */}
          <Card>
            <CardContent>
              <div className="flex items-center gap-2 text-sm">
                <Droplet className="h-4 w-4" />
                <span>
                  Last watered:{" "}
                  {lastWatered ? lastWatered.toLocaleDateString() : "Never"}
                </span>
                <span className={badgeClass}>{status}</span>
              </div>
            </CardContent>
          </Card>

          <PlantInfoCard plant={info} onSave={handleSaveInfo} />
        </div>

        {/* Right column: care schedule, care log and health log */}
        <div className="space-y-4">
          {userCareTasksLoading ? (
            <p role="status">Loading care tasks...</p>
          ) : (
            <CareTasksCard
              plantId={plantId}
              tasks={careTasks}
              onTasksChange={(tasks) => replacePlantTasks(plantId, tasks)}
              onTaskCompleted={updateTaskInState}
              onLogged={handleLogged}
            />
          )}
          <CareLogCard
            plantId={plantId}
            logs={careLogs}
            onLogsChange={setCareLogs}
          />
          <HealthLogCard plantId={plantId} />
        </div>
      </div>

      <Button
        variant="destructive"
        className="mt-8 w-full gap-2 sm:w-auto"
        onClick={handleDelete}
      >
        <Trash2 className="h-4 w-4" />
        Delete plant
      </Button>
    </div>
  );
};
