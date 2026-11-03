import { get } from "./serviceBase";
import type { CareLogDto } from "@/types/careLog";
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
