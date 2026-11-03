import { get, post, del } from "./serviceBase";
import type {
  PlantHealthLogDto,
  CreatePlantHealthLogDto,
} from "@/types/plantHealthLog";
import type { PagedResult } from "@/types/pagination";

const BASE_URL = "api/planthealthlogs";

export const getHealthLogs = (plantId: number) =>
  get<PagedResult<PlantHealthLogDto>>(`${BASE_URL}/plant/${plantId}`);

export const createHealthLog = (dto: CreatePlantHealthLogDto) =>
  post<PlantHealthLogDto>(BASE_URL, dto);

export const deleteHealthLog = (id: number) => del<void>(`${BASE_URL}/${id}`);
