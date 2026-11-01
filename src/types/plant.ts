import type { Image } from "./image";
import type { PlantSpecies } from "./plantspecies";

export type Plant = {
  plantId: number;
  name: string;
  notes?: string | null;
  createdAt: string;
  userId: number;
  plantSpeciesId?: number;
  plantSpecies?: PlantSpecies;
  plantImages?: Image[];
};

export type CreatePlantDto = {
  name: string;
  location: string;
  notes?: string;
};