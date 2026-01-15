"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function setRefreshToken(refreshToken: string) {
  const cookiesStore = await cookies();
  cookiesStore.set("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: true,
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function getRefreshToken() {
  const cookiesStore = await cookies();
  return cookiesStore.get("refreshToken")?.value;
}

export async function setToken(token: string) {
  const cookiesStore = await cookies();
  cookiesStore.set("session", token, {
    httpOnly: true,
    sameSite: "strict",
    secure: true,
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function getToken() {
  const cookiesStore = await cookies();
  return cookiesStore.get("session")?.value;
}

export async function logout() {
  const cookiesStore = await cookies();
  cookiesStore.delete("session");
  cookiesStore.delete("refreshToken");
  redirect("/login");
}
