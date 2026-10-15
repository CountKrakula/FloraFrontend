// PlantDetailsPage.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CareInfoCard } from "@/components/care/CareInfoCard";
import { useState } from "react";
import { useParams } from "react-router-dom";
import type { Care } from "@/components/care/CareInfoDialog";

// Fake plant data for now, will come from the backend later
const plant = { name: "Monstera", species: "Monstera deliciosa", location: "Living room" };

export const PlantDetailsPage = () => {
  // The plant id from the URL (/plant-details/:id), will be used to fetch the right plant later
  const { id } = useParams();

  // The saved care values, the page owns them so the card can update after Save
  const [care, setCare] = useState<Care>({
    watering: "Every 7 days",
    sunlight: "Bright, indirect",
    soil: "Well-draining mix",
    fertilizing: "Monthly in summer",
    repotting: "Every 2 years",
    pruning: "Spring",
  });

  return (
    <div className="flex items-center justify-center px-4 py-8 md:py-16">
      <div className="w-full max-w-sm md:max-w-md space-y-4">
        {/* Plant image placeholder */}
        <div className="flex h-44 items-center justify-center rounded-lg bg-muted">Image</div>
        <div>
          <h1 className="text-xl font-medium">{plant.name}</h1>
          <p className="text-sm text-muted-foreground">
            {plant.species} · {plant.location}
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