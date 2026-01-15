import api from "@/lib/http";
import { ResponseApi } from "@/types/api-types";
import { AxiosResponse } from "axios";

type SignupRequest = {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
};

export interface SignupResponse extends ResponseApi {
  retryIn: number;
}

export async function signupApi(
  data: SignupRequest
): Promise<AxiosResponse<SignupResponse>> {
  return await api.post<SignupResponse>("/auth/register", data, {withCredentials: false});
}

export async function verifyOneTimePasswordApi(data: {
  code: string;
  email: string;
}): Promise<AxiosResponse<ResponseApi>> {
  return await api.post("/auth/verify-otp", data);
}
