export interface Recipe {
  uuid: string;
  name: string;
  description: string | null;
  createdAt: string;
  category: {
    uuid: string;
    name: string;
  };
}

export interface RecipeIngredient {
  uuid: string;
  name: string;
  qty: number | null;
  unit: string | null;
}

export interface RecipeDetail extends Recipe {
  ingredients: RecipeIngredient[];
}
