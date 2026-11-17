import { api } from "./AuthService";
import type {
  ProfileDto,
  UpdateAccountInfoDto,
  UpdateProfileDto,
} from "@/types/profile";

export async function getProfile() {
  const response = await api.get<ProfileDto>("api/profile");
  return response.data;
}

export async function updateProfile(dto: UpdateProfileDto) {
  await api.put("api/profile", dto);
}

export async function updateAccountInfo(dto: UpdateAccountInfoDto) {
  await api.post("manage/info", dto);
}
