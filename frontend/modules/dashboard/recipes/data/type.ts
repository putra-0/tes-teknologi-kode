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
