import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/ui/field";
import { Button } from "../ui/button";
import { useState } from "react";
import type { CreatePlantDto, PlantDto } from "@/types/plant";
import { createPlant } from "@/service/plantService";

type AddPlantDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onAddPlant: (plant: PlantDto) => void;
};

export const AddPlantDialog = ({
  isOpen,
  onClose,
  onAddPlant,
}: AddPlantDialogProps) => {
  // Form State som exakt matchar CreatePlantDto
  const [name, setName] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [formError, setFormError] = useState<string>("");
  const handleSubmitPlant = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setFormError("Enter a name for your plant");
      return;
    }
    if (!location.trim()) {
      setFormError("Enter where your plant lives");
      return;
    }
    setFormError("");

    const dto: CreatePlantDto = {
      name,
      location,
      notes: notes.trim() ? notes : undefined,
    };

    try {
      // Skickar den nya växten till backend och lägger till den i listan
      const created = await createPlant(dto);
      onAddPlant(created);

      // Återställ formuläret och stäng modalen
      setName("");
      setLocation("");
      setNotes("");
      setFormError("");
      onClose();
    } catch {
      setFormError("Could not save the plant. Please try again.");
    }
  };
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          setFormError("");
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle className="text-xl font-semibold mb-2">
          Add a new plant
        </DialogTitle>

        {/* noValidate turns off the browser's own popups so our formError messages show instead */}
        <form onSubmit={handleSubmitPlant} noValidate className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Plant Name *</Label>
            <Input
              id="name"
              placeholder="e.g. Monstera"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setFormError("");
              }}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              placeholder="e.g. Living Room Window"
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                setFormError("");
              }}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Input
              id="notes"
              placeholder="e.g. Needs watering twice a week"
              value={notes}
              onChange={(e) => {
                setNotes(e.target.value);
                setFormError("");
              }}
            />
          </div>

          <FieldError>{formError}</FieldError>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onClose()}>
              Cancel
            </Button>
            <Button type="submit">Save plant</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
