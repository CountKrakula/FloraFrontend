import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";

// The shape of the care data: six text fields
export type Care = {
  watering: string;
  sunlight: string;
  soil: string;
  fertilizing: string;
  repotting: string;
  pruning: string;
};

// What the page gives to this dialog: the saved values and a function to call on Save
type Props = {
  care: Care;
  onSave: (care: Care) => void;
};

export const CareInfoDialog = ({ care, onSave }: Props) => {
  // Is the dialog open or closed
  const [open, setOpen] = useState(false);
  // The values currently typed in the form, starting from the saved values
  const [careValues, setCareValues] = useState(care);

  const handleOpenChange = (isOpen: boolean) => {
    // Reset the form to the saved values every time the dialog opens
    if (isOpen) setCareValues(care);
    setOpen(isOpen);
  };

  const handleChange = (field: string, value: string) => {
    // Copy all current values, then overwrite only the field being typed in
    setCareValues({ ...careValues, [field]: value });
  };

  const handleSave = () => {
    // Send the new values up to the page, then close the dialog
    onSave(careValues);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {/* The Edit button that opens the dialog */}
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        Edit
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit care information</DialogTitle>
        </DialogHeader>

        {/* The six inputs, each one shows and updates its own field */}
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
          {/* Cancel closes the dialog without saving */}
          <DialogClose render={<Button variant="outline" />}>
            Cancel
          </DialogClose>
          {/* Save sends the values to the page and closes the dialog */}
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};