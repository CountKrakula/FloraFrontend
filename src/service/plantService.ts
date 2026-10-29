import { get, post, put, del } from "./serviceBase";
import type { PlantDto, CreatePlantDto, UpdatePlantDto } from "@/types/plant";

const BASE_URL = "api/plants";

export const getPlants = () => get<PlantDto[]>(BASE_URL);

export const getPlant = (id: number) => get<PlantDto>(`${BASE_URL}/${id}`);

export const createPlant = (dto: CreatePlantDto) => post<PlantDto>(BASE_URL, dto);

export const updatePlant = (id: number, dto: UpdatePlantDto) =>
  put<void>(`${BASE_URL}/${id}`, dto);

export const deletePlant = (id: number) => del<void>(`${BASE_URL}/${id}`);