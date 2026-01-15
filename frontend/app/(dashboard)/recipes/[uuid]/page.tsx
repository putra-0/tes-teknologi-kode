"use client";

import { useParams } from "next/navigation";

import { RecipeShow } from "@/modules/dashboard/recipes/components/recipe-show";

export default function RecipeShowPage() {
  const params = useParams<{ uuid: string | string[] }>();
  const uuid = params?.uuid;

  if (!uuid || Array.isArray(uuid)) return null;

  return <RecipeShow uuid={uuid} />;
}
