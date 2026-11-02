export type LightRequirement = "Low" | "Medium" | "Bright" | "DirectSun";

// export type PlantSpecies = {
//   id: number;
//   name: string;
//   wateringIntervalDays: number;
//   description?: string | null;
//   careInstructions?: string | null;
//   lightRequirement?: LightRequirement;
// };

export type PerenualImage = {
  regular_url: string | null;
};

export type PerenualWatering = {
  value: string | null;
  unit: string | null;
};

export type PlantSpeciesListItem = {
  id: number;
  common_name: string | null;
  scientific_name: string[] | null;
  default_image: PerenualImage | null;
};

export type PlantSpeciesListResponse = {
  data: PlantSpeciesListItem[];
};

export type PlantSpeciesDetails = {
  id: number;
  common_name: string | null;
  scientific_name: string[] | null;
  description: string | null;
  watering: string | null;
  watering_general_benchmark: PerenualWatering | null;
  sunlight: string[] | null;
  care_level: string | null;
  indoor: boolean | null;
  poisonous_to_pets: boolean | null;
  default_image: PerenualImage | null;
};
