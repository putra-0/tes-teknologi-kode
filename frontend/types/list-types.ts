import { ResponseApi } from "./api-types";

export interface User {
  uuid: string;
  name: string;
  email: string;
}

export interface UserProfile extends ResponseApi {
  accessToken: string;
  name: string;
  email: string;
}

export interface TaskStatus {
  code: string;
  name: string;
}

export interface CategoryListItem {
  uuid: string;
  name: string;
}

export interface IngredientListItem {
  uuid: string;
  name: string;
}
