import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const CareInfoDialog = () => {
  const [careValues, setCareValues] = useState({
    watering: "",
    sunlight: "",
    soil: "",
    fertilizing: "",
    repotting: "",
    pruning: "",
  });

  const handleChange = (field: string, value: string) => {
    // Copy all current values, then overwrite only the field being typed in
    setCareValues({ ...careValues, [field]: value });
  };

  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        Edit
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit care information</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <Label htmlFor="watering">Watering frequency</Label>
            <Input id="watering" value={careValues.watering} onChange={(e) => handleChange("watering", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="sunlight">Sunlight</Label>
            <Input id="sunlight" value={careValues.sunlight} onChange={(e) => handleChange("sunlight", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="soil">Soil type</Label>
            <Input id="soil" value={careValues.soil} onChange={(e) => handleChange("soil", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="fertilizing">Fertilizing</Label>
            <Input id="fertilizing" value={careValues.fertilizing} onChange={(e) => handleChange("fertilizing", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="repotting">Repotting</Label>
            <Input id="repotting" value={careValues.repotting} onChange={(e) => handleChange("repotting", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="pruning">Pruning</Label>
            <Input id="pruning" value={careValues.pruning} onChange={(e) => handleChange("pruning", e.target.value)} />
          </div>
        </div>

        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            Cancel
          </DialogClose>
          <Button>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};