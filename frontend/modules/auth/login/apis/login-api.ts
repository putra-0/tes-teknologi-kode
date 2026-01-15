import api from "@/lib/http";
import { ResponseApi } from "@/types/api-types";
import { AxiosResponse } from "axios";

type LoginRequest = {
  email: string;
  password: string;
};

export interface LoginResponse extends ResponseApi {
  refreshToken: string;
  refreshTokenExpiresIn: number;
  accessToken: string;
  accessTokenExpiresIn: number;
  name: string;
  email: string;
}

export async function loginApi(
  data: LoginRequest
): Promise<AxiosResponse<LoginResponse>> {
  return await api.post<LoginResponse>("/auth/login", data);
}
