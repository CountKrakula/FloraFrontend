// PlantDetailsPage.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CareInfoCard } from "@/components/care/CareInfoCard";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { MOCK_PLANTS } from "@/data/mockPlants";
import type { Care } from "@/components/care/CareInfoDialog";

export const PlantDetailsPage = () => {
  // The plant id from the URL (/plant-details/:id), it's a string so convert to a number
  const { id } = useParams();

  // Find the plant with that id in the mock data (will be a backend call later)
  const plant = MOCK_PLANTS.find((p) => p.plantId === Number(id));

  // The saved care values, the page owns them so the card can update after Save
  const [care, setCare] = useState<Care>({
    watering: "Every 7 days",
    sunlight: "Bright, indirect",
    soil: "Well-draining mix",
    fertilizing: "Monthly in summer",
    repotting: "Every 2 years",
    pruning: "Spring",
  });

  // No plant with that id
  if (!plant) return <p className="p-8 text-center">Plant not found</p>;

  return (
    <div className="flex items-center justify-center px-4 py-8 md:py-16">
      <div className="w-full max-w-sm md:max-w-md space-y-4">
        {/* Plant image (first image from the plant's images) */}
        <img
          src={plant.plantImages?.[0]?.url}
          alt={plant.name}
          className="h-44 w-full rounded-lg object-cover"
        />
        <div>
          <h1 className="text-xl font-medium">{plant.name}</h1>
          <p className="text-sm text-muted-foreground">
            {plant.plantSpecies?.name} · {plant.notes}
          </p>
        </div>

        {/* Care information card */}
        <CareInfoCard care={care} onSave={setCare} />

        {/* Care log placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Care log</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">Coming soon</CardContent>
        </Card>
      </div>
    </div>
  );
};