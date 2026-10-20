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

  // Runs on Save click or Enter key
  const handleSubmit = (e: React.SyntheticEvent) => {
    // Stop the browser from reloading the page
    e.preventDefault();
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

        {/* The form: Save button or Enter key triggers handleSubmit */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* The six inputs, each one shows and updates its own field */}
          <div>
            <Label htmlFor="watering">Watering frequency</Label>
            <Input id="watering" required value={careValues.watering} onChange={(e) => handleChange("watering", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="sunlight">Sunlight</Label>
            <Input id="sunlight" required value={careValues.sunlight} onChange={(e) => handleChange("sunlight", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="soil">Soil type</Label>
            <Input id="soil" required value={careValues.soil} onChange={(e) => handleChange("soil", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="fertilizing">Fertilizing</Label>
            <Input id="fertilizing" required value={careValues.fertilizing} onChange={(e) => handleChange("fertilizing", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="repotting">Repotting</Label>
            <Input id="repotting" required value={careValues.repotting} onChange={(e) => handleChange("repotting", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="pruning">Pruning</Label>
            <Input id="pruning" required value={careValues.pruning} onChange={(e) => handleChange("pruning", e.target.value)} />
          </div>

          <DialogFooter>
            {/* type="button" so Cancel closes the dialog without submitting */}
            <DialogClose render={<Button type="button" variant="outline" />}>
              Cancel
            </DialogClose>
            {/* type="submit" so this button (and Enter) triggers onSubmit */}
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};