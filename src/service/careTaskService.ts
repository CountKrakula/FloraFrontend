import { get, post, put, del } from "./serviceBase";
import type { CareTaskDto, CareTaskInput } from "@/types/careTask";

// Care tasks always belong to a plant: api/plants/{plantId}/caretasks
const baseUrl = (plantId: number) => `api/plants/${plantId}/caretasks`;

export const getCareTasks = (plantId: number) =>
  get<CareTaskDto[]>(baseUrl(plantId));

export const createCareTask = (plantId: number, input: CareTaskInput) =>
  post<CareTaskDto>(baseUrl(plantId), { ...input, plantId });

export const updateCareTask = (plantId: number, id: number, input: CareTaskInput) =>
  put<void>(`${baseUrl(plantId)}/${id}`, input);

export const deleteCareTask = (plantId: number, id: number) =>
  del<void>(`${baseUrl(plantId)}/${id}`);

export const completeCareTask = (plantId: number, id: number) =>
  post<CareTaskDto>(`${baseUrl(plantId)}/${id}/complete`, {});