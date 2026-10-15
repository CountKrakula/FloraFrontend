export const searchPlantSpecies = (query: string): void => {
  const params = new URLSearchParams({ search: query });

  console.log("Planerat API-anrop:", `GET /api/plant-species?${params}`);
};
