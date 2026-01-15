import api from "@/lib/http";
import { UserProfile } from "@/types/list-types";
import { AxiosResponse } from "axios";

export const getProfile = async (): Promise<AxiosResponse<UserProfile>> => {
  return await api.get<UserProfile>("/auth/profile");
};
