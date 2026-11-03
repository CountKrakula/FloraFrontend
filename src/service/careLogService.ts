import { get } from "./serviceBase";
import type { CareLogDto } from "@/types/careLog";
import type { PagedResult } from "@/types/pagination";

const baseUrl = (plantId: number) => `api/plants/${plantId}/carelogs`;

export const getCareLogs = (plantId: number) =>
  get<PagedResult<CareLogDto>>(baseUrl(plantId));
