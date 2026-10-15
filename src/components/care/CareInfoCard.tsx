// CareInfoCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CareInfoDialog } from "@/components/care/CareInfoDialog";
import type { Care } from "@/components/care/CareInfoDialog";

type Props = {
  care: Care;
  onSave: (care: Care) => void;
};

export const CareInfoCard = ({ care, onSave }: Props) => {
  // One row per care item: a label plus its current value
  const rows = [
    { label: "Watering", value: care.watering },
    { label: "Sunlight", value: care.sunlight },
    { label: "Soil", value: care.soil },
    { label: "Fertilizing", value: care.fertilizing },
    { label: "Repotting", value: care.repotting },
    { label: "Pruning", value: care.pruning },
  ];

  return (
    // Care information card, the dialog gets the saved values and updates them on Save
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Care information</CardTitle>
        <CareInfoDialog care={care} onSave={onSave} />
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