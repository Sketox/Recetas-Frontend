export interface Recipe {
  id: string;
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
  createdAt: string;
  updatedAt: string;
}
