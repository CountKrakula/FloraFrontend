import type { PlantSpecies } from "@/types/plantspecies";

export const MOCK_PLANT_SPECIES: PlantSpecies[] = [
  {
    id: 101,
    name: "Monstera deliciosa",
    wateringIntervalDays: 7,
    description: "A tropical house plant with large, split green leaves.",
    careInstructions:
      "Let the top layer of soil dry before watering. Use a pot with drainage and keep out of harsh direct sunlight.",
    lightRequirement: "Bright",
  },
  {
    id: 102,
    name: "Ficus elastica",
    wateringIntervalDays: 10,
    description: "An upright house plant with thick, glossy green leaves.",
    careInstructions:
      "Let the top layer of soil dry before watering. Avoid standing water and wipe the leaves occasionally.",
    lightRequirement: "Bright",
  },
];
