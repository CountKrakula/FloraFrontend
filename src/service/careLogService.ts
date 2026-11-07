import { get, post, del } from "./serviceBase";
import type { CareLogDto, CreateCareLogDto } from "@/types/careLog";
import type { PagedResult } from "@/types/pagination";

const baseUrl = (plantId: number) => `api/plants/${plantId}/carelogs`;

export const getCareLogs = (
  plantId: number,
  pageNumber = 1,
  pageSize = 10,
) =>
  get<PagedResult<CareLogDto>>(
    `${baseUrl(plantId)}?pageNumber=${pageNumber}&pageSize=${pageSize}`,
  );

export const createCareLog = (plantId: number, dto: CreateCareLogDto) =>
  post<CareLogDto>(baseUrl(plantId), dto);

export const deleteCareLog = (plantId: number, id: number) =>
  del<void>(`${baseUrl(plantId)}/${id}`);