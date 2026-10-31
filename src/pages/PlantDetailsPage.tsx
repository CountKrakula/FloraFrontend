// PlantDetailsPage.tsx
import { CareInfoCard } from "@/components/care/CareInfoCard";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { MOCK_PLANTS } from "@/data/mockPlants";
import type { Care } from "@/components/care/CareInfoDialog";
import type { Log } from "@/components/care/CareLogCard"
import { CareLogCard } from "@/components/care/CareLogCard";
import type { Plant as PlantInfo } from "@/components/plants/PlantInfoDialog"
import { PlantInfoCard } from "@/components/plants/PlantInfoCard";
import { Droplet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAllCareTasks, completeCareTask } from "@/service/caretask-service";

type CareTask = {
  id: number;
  type: string;
  intervalDays: number;
  lastDoneAt: string | null;
  nextDueAt: string;
  plantId: number;
}


export const PlantDetailsPage = () => {
  // The plant id from the URL (/plant-details/:id), it's a string so convert to a number
  const { id } = useParams();

  // Find the plant with that id in the mock data (will be a backend call later)
  const plant = MOCK_PLANTS.find((p) => p.plantId === Number(id));

  // The saved care values, the page owns them so the card can update after Save
  const [care, setCare] = useState<Care>({
    watering: "Not set",
    sunlight: "Bright, indirect",
    soil: "Well-draining mix",
    fertilizing: "Monthly in summer",
    repotting: "Every 2 years",
    pruning: "Spring",
  });

  const [caretasks, setCareTasks] = useState<CareTask[]>([]);

  async function getCareTask(plantId: number) {
    try {
      const caretaskList = await getAllCareTasks(plantId);
      setCareTasks(caretaskList);
    } catch (error) {
      console.error('Error fetching caretasks:', error);
    }
  }

  const wateringTask = caretasks.find((t: CareTask) => t.type === "Watering");
  const fertilizeTask = caretasks.find((t: CareTask) => t.type === "Fertilize");
  const newCareValue = {
    ...care,
    watering: wateringTask ? `Every ${wateringTask.intervalDays} days` : "Not set",
    fertilizing: fertilizeTask ? `Every ${fertilizeTask.intervalDays} days` : "Not set",
  };

  useEffect(() => {
    getCareTask(Number(id));
  }, [id]);

  const [info, setInfo] = useState<PlantInfo>({
    // use the plant’s name if the plant exists, otherwise use an empty string
    name: plant?.name ?? "",
    location: "",
    notes: plant?.notes ?? "",
  });

  const [logs, setLogs] = useState<Log[]>([
    { id: 1, date: "2026-10-22", notes: "Watered", plantId: Number(id) },
    { id: 2, date: "2026-10-27", notes: "Fertilized", plantId: Number(id) },
  ]);


  // Runs when "Mark as watered" is clicked:
  // marks the watering task as done in the backend, then refreshes the care tasks.
  async function handleWatered() {
    // turns the date into a text string and drop the time part
    const todaysDate = new Date().toISOString().slice(0, 10);


    if (wateringTask) {
      try {
        await completeCareTask(Number(id), wateringTask.id);
        setLogs([...logs, { id: logs.length + 1, date: todaysDate, notes: "Watered", plantId: Number(id) }]);
        getCareTask(Number(id)); // Refresh the care tasks after marking as watered
      } catch (error) {
        console.error('Error completing care task:', error);
      }
    }
  }

  // change the status of "Need water" label depending on the date 
  const today = new Date().toISOString().slice(0, 10);
  let status = "Needs water";
  let badgeClass = "ml-auto rounded-md bg-amber-100 px-3 py-1 text-xs text-amber-800";
  if (wateringTask?.lastDoneAt?.slice(0, 10) === today) {
    status = "Watered today";
    badgeClass = "ml-auto rounded-md bg-green-100 px-3 py-1 text-xs text-green-800";
  }

  // No plant with that id
  if (!plant) return <p className="p-8 text-center">Plant not found</p>;

  return (
    <div className="flex items-center justify-center px-4 py-8 md:py-16">
      <div className="w-full max-w-sm md:max-w-md space-y-4">
        {/* Plant image (first image from the plant's images) */}
        <img
          src={plant.plantImages?.[0]?.url}
          alt={info.name}
          className="h-44 w-full rounded-lg object-cover"
        />
        <div>
          <h1 className="text-xl font-medium">{info.name}</h1>
          <p className="text-sm text-muted-foreground">
            {plant.plantSpecies?.name} · {info.notes}
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Droplet className="h-4 w-4" />
          <span>Last watered: {wateringTask?.lastDoneAt?.slice(0, 10) || "Not watered"}</span>
          <span className={badgeClass}>
            {status}
          </span>
        </div>

        <PlantInfoCard plant={info} onSave={setInfo} />

        {/* Care information card */}
        <CareInfoCard care={newCareValue} onSave={setCare} />

        <Button size="sm" variant="outline" onClick={handleWatered}> <Droplet className="h-4 w-4" /> Mark as watered</Button>

        {/* Care log card */}
        <CareLogCard logs={logs} />


      </div>


    </div>
  );
};