import type { Plant } from "../types/plant";

export const MOCK_PLANTS: Plant[] = [
  {
    plantId: 1,
    name: "Monstera",
    notes: "Living room window",
    createdAt: new Date().toISOString(),
    userId: 1,
    plantSpeciesId: 101,
    plantSpecies: {
      id: 101,
      name: "Monstera Deliciosa",
      wateringIntervalDays: 7,
    },
    plantImages: [
      {
        imageId: 1,
        url: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=500&q=80",
        hash: "",
        isProfilePicture: true,
        plantId: 1,
      },
    ],
  },
  {
    plantId: 2,
    name: "Rubber Tree",
    notes: "Office desk",
    createdAt: new Date().toISOString(),
    userId: 1,
    plantSpeciesId: 102,
    plantSpecies: {
      id: 102,
      name: "Ficus Elastica",
      wateringIntervalDays: 10,
    },
    plantImages: [
      {
        imageId: 2,
        url: "https://images.unsplash.com/photo-1597055181300-e3633a207519?w=500&q=80",
        hash: "",
        isProfilePicture: true,
        plantId: 2,
      },
    ],
  },
];