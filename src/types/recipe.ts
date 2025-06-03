export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prepTime: number; // in minutes
  cookTime: number; // in minutes
  servings: number;
  difficulty: "Fácil" | "Intermedio" | "Difícil";
  category: "Desayuno" | "Almuerzo" | "Cena" | "Postre" | "Snack";
  imageUrl: string;
  rating: number; // 1-5
  createdAt: Date;
  updatedAt: Date;
}
