import { get, post, del } from "./serviceBase";
import type {
  PlantHealthLogDto,
  CreatePlantHealthLogDto,
} from "@/types/plantHealthLog";
import type { PagedResult } from "@/types/pagination";

const BASE_URL = "api/planthealthlogs";

// The backend returns one page of logs at a time (newest first)
export const getHealthLogs = (plantId: number, pageNumber = 1, pageSize = 20) =>
  get<PagedResult<PlantHealthLogDto>>(
    `${BASE_URL}/plant/${plantId}?pageNumber=${pageNumber}&pageSize=${pageSize}`
  );

export const createHealthLog = (dto: CreatePlantHealthLogDto) =>
  post<PlantHealthLogDto>(BASE_URL, dto);

export const deleteHealthLog = (id: number) => del<void>(`${BASE_URL}/${id}`);
