import { get, post, put, del } from "./serviceBase";
import type { PlantDto, CreatePlantDto, UpdatePlantDto } from "@/types/plant";
import type { PagedResult } from "@/types/pagination";

const BASE_URL = "api/plants";

export const getPlants = (pageNumber = 1, pageSize = 10) =>
  get<PagedResult<PlantDto>>(`${BASE_URL}?pageNumber=${pageNumber}&pageSize=${pageSize}`);

export const getPlant = (id: number) => get<PlantDto>(`${BASE_URL}/${id}`);

export const createPlant = (dto: CreatePlantDto) => post<PlantDto>(BASE_URL, dto);

export const updatePlant = (id: number, dto: UpdatePlantDto) =>
  put<void>(`${BASE_URL}/${id}`, dto);

export const deletePlant = (id: number) => del<void>(`${BASE_URL}/${id}`);