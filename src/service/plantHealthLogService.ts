import { get, post, del } from "./serviceBase";
import type {
  PlantHealthLogDto,
  CreatePlantHealthLogDto,
} from "@/types/plantHealthLog";

const BASE_URL = "api/planthealthlogs";

export const getHealthLogs = (plantId: number) =>
  get<PlantHealthLogDto[]>(`${BASE_URL}/plant/${plantId}`);

export const createHealthLog = (dto: CreatePlantHealthLogDto) =>
  post<PlantHealthLogDto>(BASE_URL, dto);

export const deleteHealthLog = (id: number) => del<void>(`${BASE_URL}/${id}`);