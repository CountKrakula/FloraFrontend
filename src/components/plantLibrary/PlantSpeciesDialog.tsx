import type { PlantSpecies } from "@/types/plantspecies";
import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

type PlantSpeciesDialogProps = {
  species: PlantSpecies;
};

export const PlantSpeciesDialog = ({ species }: PlantSpeciesDialogProps) => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{species.name}</DialogTitle>
      </DialogHeader>

      <p>{species.description}</p>
      <p>{species.careInstructions}</p>
    </DialogContent>
  );
};
