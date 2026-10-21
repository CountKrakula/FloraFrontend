import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export type Plant = {
  name: string;
  location: string;
  notes: string;
};

type Props = {
  plant: Plant;
  onSave: (plant: Plant) => void;
};

export const PlantInfoDialog = ({ plant, onSave }: Props) => {
  // Is the dialog open or closed
  const [open, setOpen] = useState(false);
  // The values currently typed in the form, starting from the saved values
  const [plantValues, setPlantValues] = useState(plant);

  const handleOpenChange = (isOpen: boolean) => {
    // Reset the form to the saved values every time the dialog opens
    if (isOpen) setPlantValues(plant);
    setOpen(isOpen);
  };

  const handleChange = (field: string, value: string) => {
    // Copy all current values, then overwrite only the field being typed in
    setPlantValues({ ...plantValues, [field]: value });
  };

  // Runs on Save click or Enter key
  const handleSubmit = (e: React.SyntheticEvent) => {
    // Stop the browser from reloading the page
    e.preventDefault();
    // Send the new values up to the page, then close the dialog
    onSave(plantValues);
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
          <DialogTitle>Edit plant information</DialogTitle>
        </DialogHeader>

        {/* The form: Save button or Enter key triggers handleSubmit */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* The six inputs, each one shows and updates its own field */}
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" required value={plantValues.name} onChange={(e) => handleChange("name", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input id="location" value={plantValues.location} onChange={(e) => handleChange("location", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Input id="notes" value={plantValues.notes} onChange={(e) => handleChange("notes", e.target.value)} />
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