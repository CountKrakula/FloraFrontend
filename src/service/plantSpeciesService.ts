import type {
  PlantSpeciesDetails,
  PlantSpeciesListResponse,
} from "@/types/plantspecies";
import { api } from "./serviceBase";

export const getPlantsList = async (
  searchText?: string,
  page: number = 1,
): Promise<PlantSpeciesListResponse> => {
  const params = new URLSearchParams({
    query: searchText || "",
    page: String(page),
  });
  const response = await api.get<PlantSpeciesListResponse>(
    `/api/plant-species?${params}`,
  );
  return response.data;
};

export const getPlantDetails = async (
  plantId: number,
): Promise<PlantSpeciesDetails> => {
  const response = await api.get<PlantSpeciesDetails>(
    `/api/plant-species/${plantId}`,
  );
  return response.data;
};
