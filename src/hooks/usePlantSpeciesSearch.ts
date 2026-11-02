import { getPlantsList } from "@/service/plantSpeciesService";
import type { PlantSpeciesListItem } from "@/types/plantspecies";
import { useEffect, useState } from "react";

export const usePlantSpeciesSearch = (search: string, page?: number) => {
  const [plantList, setPlantList] = useState<PlantSpeciesListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const query = search.trim();
    const delay = query ? 400 : 0;

    const timeoutId = setTimeout(() => {
      setLoading(true);
      setError(null);

      getPlantsList(query, page)
        .then((response) => {
          setPlantList(response.data);
        })
        .catch((err) => {
          setError(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [search, page]);

  return { plantList, loading, error };
};
