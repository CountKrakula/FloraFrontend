import type { ImageDTO } from "./image";

export type Plant = {
  plantId: number;
  name: string;
  notes?: string | null;
  createdAt: string;
  userId: number;
  plantImages?: ImageDTO[];
};

export type CreatePlantDto = {
  name: string;
  location: string;
  notes?: string;
};

export type PlantDto = {
  id: number;
  name: string;
  location: string;
  notes?: string | null;
  createdAt: string;
};

export type UpdatePlantDto = {
  name: string;
  location: string;
  notes?: string;
};
