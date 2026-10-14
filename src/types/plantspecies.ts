export type LightRequirement = "Low" | "Medium" | "Bright" | "DirectSun";

export type PlantSpecies = {
  id: number;
  name: string;
  wateringIntervalDays: number;
  description?: string | null;
  careInstructions?: string | null;
  lightRequirement?: LightRequirement;
};