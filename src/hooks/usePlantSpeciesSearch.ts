import { searchPlantSpecies } from "@/service/plantSpeciesService";
import { useEffect } from "react";

export const usePlantSpeciesSearch = (search: string): void => {
  useEffect(() => {
    const query = search.trim();

    if (!query) return;

    const timeoutId = setTimeout(() => {
      searchPlantSpecies(query);
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [search]);
};
