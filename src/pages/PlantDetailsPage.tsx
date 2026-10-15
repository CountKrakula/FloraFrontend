import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CareInfoDialog } from "@/components/care/CareInfoDialog"


const plant = { name: "Monstera", species: "Monstera deliciosa", location: "Living room" };

const care = [
  { label: "Watering", value: "Every 7 days" },
  { label: "Sunlight", value: "Bright, indirect" },
  { label: "Soil", value: "Well-draining mix" },
  { label: "Fertilizing", value: "Monthly in summer" },
  { label: "Repotting", value: "Every 2 years" },
  { label: "Pruning", value: "Spring" },
];

export const PlantDetailsPage = () => {
  return <div className="flex items-center justify-center px-4 py-8 md:py-16">
    <div className="w-full max-w-sm md:max-w-md space-y-4">
      <div className="flex h-44 items-center justify-center rounded-lg bg-muted">Image</div>
      <div><h1 className="text-xl font-medium">{plant.name}</h1>
        <p className="text-sm text-muted-foreground">
          {plant.species} · {plant.location}
        </p>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Care information</CardTitle>
          <CareInfoDialog />
        </CardHeader>
        <CardContent>
          {care.map((row) => (
            <div key={row.label} className="flex justify-between border-t py-2 text-sm">
              <span className="text-muted-foreground">{row.label}</span>
              <span>{row.value}</span>
            </div>
          ))}

        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Care log</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">Coming soon</CardContent>
      </Card>
    </div>

  </div>

};



