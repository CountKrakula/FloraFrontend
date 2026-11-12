// Matches CareLogDto from the backend
export type CareLogDto = {
  id: number;
  date: string;
  notes: string | null;
  plantId: number;
};

// Matches CreateCareLogDto from the backend
export type CreateCareLogDto = {
  date: string;
  notes?: string;
};