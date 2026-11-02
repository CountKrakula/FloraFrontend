import { getPlantDetails } from "@/service/plantSpeciesService";
import type { PlantSpeciesDetails } from "@/types/plantspecies";
import { useEffect, useState } from "react";

export const usePlantSpeciesDetail = (plantId: number) => {
  const [plantDetails, setPlantDetails] = useState<PlantSpeciesDetails | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let active = true;

    getPlantDetails(plantId)
      .then((response) => {
        if (active) setPlantDetails(response);
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err : new Error("Could not load plant details."));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [plantId]);

  return { plantDetails, loading, error };
};
