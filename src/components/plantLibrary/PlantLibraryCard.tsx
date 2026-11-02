import { Leaf } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PlantSpeciesListItem } from "@/types/plantspecies";
import { Dialog, DialogTrigger } from "../ui/dialog";
import { PlantSpeciesDialog } from "./PlantSpeciesDialog";

type PlantLibraryCardProps = {
  species: PlantSpeciesListItem;
};

export const PlantLibraryCard = ({ species }: PlantLibraryCardProps) => {
  return (
    <Dialog>
      <DialogTrigger>
        <Card className="group overflow-hidden border-border p-0 transition-shadow duration-200 hover:shadow-md">
          <div>
            <div className="flex h-48 items-center justify-center bg-muted">
              <Leaf className="h-16 w-16 text-primary" aria-hidden="true" />
            </div>
            <CardHeader className="p-4 pb-1">
              <CardTitle>
                <h2 className="text-lg font-semibold">{species.common_name}</h2>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-4 pt-0">
              {species.scientific_name && (
                <p className="text-sm text-muted-foreground">
                  {species.scientific_name}
                </p>
              )}
            </CardContent>
          </div>
        </Card>
      </DialogTrigger>
      <PlantSpeciesDialog species={species} />
    </Dialog>
  );
};
