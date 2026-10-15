import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CareInfoDialog } from "@/components/care/CareInfoDialog"
import { useState } from "react";
import type { Care } from "@/components/care/CareInfoDialog";


// Fake plant data for now, will come from the backend later
const plant = { name: "Monstera", species: "Monstera deliciosa", location: "Living room" };


export const PlantDetailsPage = () => {
  // The saved care values, the page owns them so the card can update after Save
  const [care, setCare] = useState<Care>({
    watering: "Every 7 days",
    sunlight: "Bright, indirect",
    soil: "Well-draining mix",
    fertilizing: "Monthly in summer",
    repotting: "Every 2 years",
    pruning: "Spring",
  });

  // One row per care item: a label plus its current value
  const rows = [
    { label: "Watering", value: care.watering },
    { label: "Sunlight", value: care.sunlight },
    { label: "Soil", value: care.soil },
    { label: "Fertilizing", value: care.fertilizing },
    { label: "Repotting", value: care.repotting },
    { label: "Pruning", value: care.pruning },
  ];



  return <div className="flex items-center justify-center px-4 py-8 md:py-16">
    <div className="w-full max-w-sm md:max-w-md space-y-4">
      {/* Plant image placeholder */}
      <div className="flex h-44 items-center justify-center rounded-lg bg-muted">Image</div>
      <div><h1 className="text-xl font-medium">{plant.name}</h1>
        <p className="text-sm text-muted-foreground">
          {plant.species} · {plant.location}
        </p>
      </div>

      {/* Care information card, the dialog gets the saved values and updates them on Save */}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Care information</CardTitle>
          <CareInfoDialog care={care} onSave={setCare} />
        </CardHeader>
        <CardContent>
          {rows.map((row) => (
            <div key={row.label} className="flex justify-between border-t py-2 text-sm">
              <span className="text-muted-foreground">{row.label}</span>
              <span>{row.value}</span>
            </div>
          ))}

        </CardContent>
      </Card>

      {/* Care log placeholder*/}
      <Card>
        <CardHeader>
          <CardTitle>Care log</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">Coming soon</CardContent>
      </Card>
    </div>

  </div>

};



