export interface Recipe {
  id?: string;
  _id?: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: "Fácil" | "Intermedio" | "Difícil";
  category: "Desayuno" | "Almuerzo" | "Cena" | "Postre" | "Snack";
  imageUrl: string;
  rating: number;
  userId?: string;
  createdAt: string;
  updatedAt: string;
}
