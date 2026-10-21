import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlantInfoDialog } from "@/components/plants/PlantInfoDialog";
import type { Plant } from "@/components/plants/PlantInfoDialog";

type Props = {
    plant: Plant;
    onSave: (plant: Plant) => void;
};

export const PlantInfoCard = ({ plant, onSave }: Props) => {
    // One row per care item: a label plus its current value
    const rows = [
        { label: "Name", value: plant.name },
        { label: "Location", value: plant.location },
        { label: "Notes", value: plant.notes },
    ];

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Plant information</CardTitle>
                <PlantInfoDialog plant={plant} onSave={onSave} />
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
    );
};