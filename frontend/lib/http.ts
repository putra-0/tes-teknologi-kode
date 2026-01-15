import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { decodeJwt } from "jose";
import { toast } from "sonner";

import { TOAST_POSITION, TOAST_TIMEOUT } from "@/consts";
import { useAuthStore } from "@/store/auth-store";
import { ResponseApi } from "@/types/api-types";
import { logout } from "./sessions";

/* ================= CONFIG ================= */

const CONFIG = {
  TOKEN_EXPIRY_THRESHOLD: 60, // seconds
  TIMEOUT: 10_000,
  PUBLIC_URLS: [
    "/auth/login",
    "/auth/register",
    "/auth/forgot-password",
    "/auth/reset-password",
    "/auth/verify-otp",
  ] as const,
} as const;

/* ================= MESSAGES ================= */

const MESSAGES = {
  ERROR: {
    TOKEN_EXPIRED: "Session expired. Please login again.",
    TOKEN_INVALID: "Invalid token. Please login again.",
    UNAUTHORIZED: "Unauthorized access. Please login again.",
  },
} as const;

/* ================= TYPES ================= */

interface JWTPayload {
  exp: number;
  iat: number;
}

/* ================= TOKEN VALIDATOR ================= */

class TokenValidator {
  static isExpired(token: string): boolean {
    try {
      const decoded = decodeJwt<JWTPayload>(token);
      const now = Date.now() / 1000;
      return decoded.exp < now + CONFIG.TOKEN_EXPIRY_THRESHOLD;
    } catch {
      return true;
    }
  }

  static validate(token: string): void {
    try {
      decodeJwt(token);
    } catch {
      throw new Error(MESSAGES.ERROR.TOKEN_INVALID);
    }
  }
}

/* ================= NOTIFICATION ================= */

class NotificationManager {
  private static lastError = 0;
  private static throttle = 1000;

  static error(message: string): void {
    const now = Date.now();
    if (now - this.lastError > this.throttle) {
      toast.error("Request Failed", {
        description: message,
        duration: TOAST_TIMEOUT,
        position: TOAST_POSITION,
      });
      this.lastError = now;
    }
  }
}

/* ================= AXIOS INSTANCE ================= */

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: CONFIG.TIMEOUT,
});

/* ================= REQUEST INTERCEPTOR ================= */

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const isPublic = CONFIG.PUBLIC_URLS.some((url) =>
      config.url?.includes(url)
    );

    if (isPublic) return config;

    const { token } = useAuthStore.getState();
    if (!token) return config;

    try {
      TokenValidator.validate(token);

      if (TokenValidator.isExpired(token)) {
        logout();
        NotificationManager.error(MESSAGES.ERROR.TOKEN_EXPIRED);
        throw new AxiosError("Token expired", "401", config);
      }

      config.headers.Authorization = `Bearer ${token}`;
      return config;
    } catch (error) {
      logout();
      NotificationManager.error(
        error instanceof Error
          ? error.message
          : MESSAGES.ERROR.TOKEN_INVALID
      );
      throw error;
    }
  },
  (error) => Promise.reject(error)
);

/* ================= RESPONSE INTERCEPTOR ================= */

api.interceptors.response.use(
  (response: AxiosResponse<ResponseApi>) => response,
  (error: AxiosError<ResponseApi>) => {
    if (error.response?.status === 401) {
      logout();
      NotificationManager.error(MESSAGES.ERROR.UNAUTHORIZED);
    } else if (error.response?.data?.responseMessage) {
      NotificationManager.error(error.response.data.responseMessage);
    }

    return Promise.reject(error);
  }
);

export default api;
export { TokenValidator, NotificationManager, CONFIG };
